
import { useState, useEffect, useCallback } from 'react';
import signInOptionsData from '@/config/signInOptions.json';

// Custom event to trigger refresh across all hook instances
const STORAGE_CHANGE_EVENT = 'signInOptionsUpdated';

interface SignInOption {
  id: string;
  label: string;
  applies_to: string;
  category: string;
  is_active: boolean;
}

export function useSignInOptionsJson(appliesTo: string = 'both', category: string = 'visit_type') {
  const [options, setOptions] = useState<SignInOption[]>([]);
  const [allOptions, setAllOptions] = useState<SignInOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Load options from localStorage or fallback to JSON file
  const loadOptions = useCallback(() => {
    setLoading(true);
    try {
      const savedOptions = localStorage.getItem('signInOptions');
      const optionsData = savedOptions ? JSON.parse(savedOptions) : signInOptionsData;
      
      setAllOptions(optionsData);
      
      const filteredOptions = optionsData.filter((option: SignInOption) => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      setOptions(filteredOptions);
    } catch (error) {
      console.error('Error loading sign-in options:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [appliesTo, category]);

  // Save options to localStorage
  const saveOptions = useCallback((newOptions: SignInOption[]) => {
    try {
      localStorage.setItem('signInOptions', JSON.stringify(newOptions));
      setAllOptions(newOptions);
      
      const filteredOptions = newOptions.filter(option => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      setOptions(filteredOptions);
      
      // Dispatch custom event to notify other hook instances
      window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));
    } catch (error) {
      console.error('Error saving options:', error);
      throw new Error('Failed to save options');
    }
  }, [appliesTo, category]);

  // Add new option
  const addOption = useCallback(async (label: string, applies: string, cat: string) => {
    try {
      const newOption: SignInOption = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: label.trim(),
        applies_to: applies,
        category: cat,
        is_active: true
      };

      const updatedOptions = [...allOptions, newOption];
      saveOptions(updatedOptions);
      return null; // Success
    } catch (error: any) {
      return { message: error.message || 'Failed to add option' };
    }
  }, [allOptions, saveOptions]);

  // Remove/deactivate option
  const removeOption = useCallback(async (id: string) => {
    try {
      const updatedOptions = allOptions.map(option => 
        option.id === id ? { ...option, is_active: false } : option
      );
      saveOptions(updatedOptions);
      return null; // Success
    } catch (error: any) {
      return { message: error.message || 'Failed to remove option' };
    }
  }, [allOptions, saveOptions]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  // Listen for storage changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      loadOptions();
    };

    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
  }, [loadOptions]);

  return { 
    options, 
    loading, 
    addOption, 
    removeOption: removeOption 
  };
}


import { useState, useEffect, useCallback } from 'react';
import signInOptionsData from '@/config/signInOptions.json';

// Custom event to trigger refresh across all hook instances
const STORAGE_CHANGE_EVENT = 'signInOptionsUpdated';
const STORAGE_VERSION_KEY = 'signInOptionsVersion';
const CURRENT_VERSION = '1.0';

interface SignInOption {
  id: string;
  label: string;
  applies_to: string;
  category: string;
  is_active: boolean;
}

// Initialize localStorage with defaults and custom options merged
const initializeStorage = () => {
  const savedOptions = localStorage.getItem('signInOptions');
  const savedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
  
  console.log('[initializeStorage] Checking localStorage:', { 
    savedOptions: savedOptions ? 'exists' : 'missing', 
    savedVersion,
    currentVersion: CURRENT_VERSION 
  });
  
  if (!savedOptions) {
    console.log('[initializeStorage] No localStorage found, initializing with defaults');
    localStorage.setItem('signInOptions', JSON.stringify(signInOptionsData));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    return signInOptionsData;
  }
  
  const localStorageData = JSON.parse(savedOptions);
  console.log('[initializeStorage] Found existing localStorage data:', localStorageData.length, 'items');
  
  // Always return the existing localStorage data (includes custom options)
  // Only merge if version is different AND we're missing defaults
  if (savedVersion !== CURRENT_VERSION) {
    console.log('[initializeStorage] Version mismatch, merging with defaults');
    
    // Start with existing localStorage data to preserve custom options
    const mergedData = [...localStorageData];
    
    // Add any new defaults that don't exist yet
    signInOptionsData.forEach((defaultOption: SignInOption) => {
      const existsInStorage = mergedData.some(localOption => 
        localOption.id === defaultOption.id
      );
      
      if (!existsInStorage) {
        console.log('[initializeStorage] Adding new default option:', defaultOption);
        mergedData.push(defaultOption);
      }
    });
    
    localStorage.setItem('signInOptions', JSON.stringify(mergedData));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    console.log('[initializeStorage] Merged and saved', mergedData.length, 'total options');
    
    return mergedData;
  }
  
  console.log('[initializeStorage] Using existing localStorage data as-is');
  return localStorageData;
};

export function useSignInOptionsJson(appliesTo: string = 'both', category: string = 'visit_type') {
  const [options, setOptions] = useState<SignInOption[]>([]);
  const [allOptions, setAllOptions] = useState<SignInOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Load options from localStorage with proper initialization
  const loadOptions = useCallback(() => {
    console.log(`[useSignInOptionsJson] Loading options for appliesTo: ${appliesTo}, category: ${category}`);
    setLoading(true);
    try {
      const optionsData = initializeStorage();
      console.log('[useSignInOptionsJson] Loaded options data:', optionsData);
      
      setAllOptions(optionsData);
      
      const filteredOptions = optionsData.filter((option: SignInOption) => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      console.log(`[useSignInOptionsJson] Filtered options for ${category}:`, filteredOptions);
      setOptions(filteredOptions);
    } catch (error) {
      console.error('Error loading sign-in options:', error);
      setOptions([]);
      setAllOptions([]);
    } finally {
      setLoading(false);
    }
  }, [appliesTo, category]);

  // Save options to localStorage
  const saveOptions = useCallback((newOptions: SignInOption[]) => {
    try {
      console.log('[useSignInOptionsJson] Saving options to localStorage:', newOptions);
      localStorage.setItem('signInOptions', JSON.stringify(newOptions));
      setAllOptions(newOptions);
      
      const filteredOptions = newOptions.filter(option => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      console.log(`[useSignInOptionsJson] Filtered options after save for ${category}:`, filteredOptions);
      setOptions(filteredOptions);
      
      // Dispatch custom event to notify other hook instances
      console.log('[useSignInOptionsJson] Dispatching storage change event');
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
      console.log(`[useSignInOptionsJson] Storage change event received for ${category}`);
      loadOptions();
    };

    console.log(`[useSignInOptionsJson] Setting up storage change listener for ${category}`);
    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    return () => {
      console.log(`[useSignInOptionsJson] Cleaning up storage change listener for ${category}`);
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    };
  }, [loadOptions, category]);

  return { 
    options, 
    loading, 
    addOption, 
    removeOption: removeOption 
  };
}

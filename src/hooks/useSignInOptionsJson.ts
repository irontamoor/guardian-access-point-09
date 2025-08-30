import { useState, useEffect } from 'react';
import signInOptionsData from '@/config/signInOptions.json';
import { VMSApi } from '@/api/routes';

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

  // Load options from JSON file or localStorage fallback
  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      try {
        console.log(`[useSignInOptionsJson] Loading options for category: "${category}", appliesTo: "${appliesTo}"`);
        
        // Try to get updated options from localStorage first (for persistence)
        let currentOptions = signInOptionsData;
        const storedOptions = localStorage.getItem('signInOptions');
        if (storedOptions) {
          try {
            currentOptions = JSON.parse(storedOptions);
            console.log('[useSignInOptionsJson] Using updated options from localStorage');
          } catch (e) {
            console.warn('[useSignInOptionsJson] Failed to parse stored options, using defaults');
          }
        }
        
        setAllOptions(currentOptions);
        
        // Filter based on criteria
        const filteredOptions = currentOptions.filter((option: SignInOption) => 
          option.is_active && 
          (option.applies_to === appliesTo || option.applies_to === 'both') &&
          option.category === category
        );
        
        console.log(`[useSignInOptionsJson] Filtered options:`, {
          totalOptions: currentOptions.length,
          categoryMatch: currentOptions.filter((option: SignInOption) => option.category === category).length,
          finalFiltered: filteredOptions.length,
          filteredOptions: filteredOptions.map(opt => ({ id: opt.id, label: opt.label, applies_to: opt.applies_to }))
        });
        
        setOptions(filteredOptions);
      } catch (error) {
        console.error('Error loading sign-in options:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [appliesTo, category]);

  // Add new option (persisted to file via API)
  const addOption = async (label: string, applies: string, cat: string) => {
    try {
      const newOption: SignInOption = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: label.trim(),
        applies_to: applies,
        category: cat,
        is_active: true
      };

      console.log('[useSignInOptionsJson] Adding new option:', newOption);
      
      // Update the options array
      const updatedOptions = [...allOptions, newOption];
      
      // Save to file via API
      await VMSApi.updateSignInOptions(updatedOptions);
      
      // Update local state
      setAllOptions(updatedOptions);
      
      return null; // Success
    } catch (error: any) {
      console.error('Error adding option:', error);
      return { message: error.message || 'Failed to add option' };
    }
  };

  // Remove option (persisted to file via API)
  const removeOption = async (id: string) => {
    try {
      console.log('[useSignInOptionsJson] Removing option:', id);
      
      // Check if it's a built-in option (from original JSON)
      const isBuiltIn = signInOptionsData.some(option => option.id === id);
      
      if (isBuiltIn) {
        // For built-in options, mark as inactive instead of removing
        const updatedOptions = allOptions.map(option => 
          option.id === id ? { ...option, is_active: false } : option
        );
        
        // Save to file via API
        await VMSApi.updateSignInOptions(updatedOptions);
        
        // Update local state
        setAllOptions(updatedOptions);
      } else {
        // For custom options, remove completely
        const updatedOptions = allOptions.filter(option => option.id !== id);
        
        // Save to file via API
        await VMSApi.updateSignInOptions(updatedOptions);
        
        // Update local state
        setAllOptions(updatedOptions);
      }
      
      return null; // Success
    } catch (error: any) {
      console.error('Error removing option:', error);
      return { message: error.message || 'Failed to remove option' };
    }
  };

  return { 
    options, 
    loading, 
    addOption, 
    removeOption 
  };
}
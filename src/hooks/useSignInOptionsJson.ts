
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
  
  console.log('[initializeStorage] Detailed check:', { 
    hasLocalStorage: !!savedOptions,
    savedVersion,
    currentVersion: CURRENT_VERSION,
    localStorageLength: savedOptions ? JSON.parse(savedOptions).length : 0
  });
  
  // If no localStorage, initialize with defaults
  if (!savedOptions) {
    console.log('[initializeStorage] No localStorage found, initializing with defaults');
    localStorage.setItem('signInOptions', JSON.stringify(signInOptionsData));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    console.log('[initializeStorage] Initialized with', signInOptionsData.length, 'default options');
    return signInOptionsData;
  }
  
  try {
    const localStorageData = JSON.parse(savedOptions);
    console.log('[initializeStorage] Parsed localStorage data:', {
      totalItems: localStorageData.length,
      relationshipItems: localStorageData.filter((item: SignInOption) => item.category === 'relationship').length,
      customItems: localStorageData.filter((item: SignInOption) => item.id.startsWith('custom_')).length
    });
    
    // CRITICAL: Always preserve existing data, especially custom options
    // Only add missing defaults if version changed
    if (savedVersion !== CURRENT_VERSION) {
      console.log('[initializeStorage] Version mismatch detected, merging carefully');
      
      // Start with ALL existing data to preserve custom options
      const mergedData = [...localStorageData];
      let addedCount = 0;
      
      // Only add defaults that are completely missing
      signInOptionsData.forEach((defaultOption: SignInOption) => {
        const existsInStorage = mergedData.some(localOption => 
          localOption.id === defaultOption.id
        );
        
        if (!existsInStorage) {
          console.log('[initializeStorage] Adding missing default:', defaultOption.label, defaultOption.category);
          mergedData.push(defaultOption);
          addedCount++;
        }
      });
      
      // Save merged data
      localStorage.setItem('signInOptions', JSON.stringify(mergedData));
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      
      console.log('[initializeStorage] Merge complete:', {
        originalCount: localStorageData.length,
        addedDefaults: addedCount,
        finalCount: mergedData.length,
        relationshipCount: mergedData.filter((item: SignInOption) => item.category === 'relationship').length
      });
      
      return mergedData;
    }
    
    // Version matches, use existing data as-is
    console.log('[initializeStorage] Version matches, using existing data:', {
      totalOptions: localStorageData.length,
      relationshipOptions: localStorageData.filter((item: SignInOption) => item.category === 'relationship' && item.is_active).length
    });
    
    return localStorageData;
  } catch (error) {
    console.error('[initializeStorage] Error parsing localStorage, reinitializing:', error);
    localStorage.setItem('signInOptions', JSON.stringify(signInOptionsData));
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    return signInOptionsData;
  }
};

export function useSignInOptionsJson(appliesTo: string = 'both', category: string = 'visit_type') {
  const [options, setOptions] = useState<SignInOption[]>([]);
  const [allOptions, setAllOptions] = useState<SignInOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Load options from localStorage with proper initialization
  const loadOptions = useCallback(() => {
    console.log(`[useSignInOptionsJson] Loading options for appliesTo: "${appliesTo}", category: "${category}"`);
    setLoading(true);
    try {
      const optionsData = initializeStorage();
      console.log(`[useSignInOptionsJson] Loaded ${optionsData.length} total options from storage`);
      
      setAllOptions(optionsData);
      
      const filteredOptions = optionsData.filter((option: SignInOption) => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      
      console.log(`[useSignInOptionsJson] Filtered for category "${category}":`, {
        totalActive: optionsData.filter((option: SignInOption) => option.is_active).length,
        categoryMatch: optionsData.filter((option: SignInOption) => option.category === category).length,
        finalFiltered: filteredOptions.length,
        filteredOptions: filteredOptions.map(opt => ({ id: opt.id, label: opt.label, applies_to: opt.applies_to }))
      });
      
      setOptions(filteredOptions);
    } catch (error) {
      console.error('Error loading sign-in options:', error);
      setOptions([]);
      setAllOptions([]);
    } finally {
      setLoading(false);
    }
  }, [appliesTo, category]);

  // Save options to localStorage and trigger immediate sync
  const saveOptions = useCallback((newOptions: SignInOption[]) => {
    try {
      console.log('[useSignInOptionsJson] Saving options to localStorage:', {
        totalOptions: newOptions.length,
        relationshipOptions: newOptions.filter(opt => opt.category === 'relationship').length,
        customOptions: newOptions.filter(opt => opt.id.startsWith('custom_')).length
      });
      
      localStorage.setItem('signInOptions', JSON.stringify(newOptions));
      setAllOptions(newOptions);
      
      const filteredOptions = newOptions.filter(option => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      
      console.log(`[useSignInOptionsJson] Updated filtered options for "${category}":`, {
        filteredCount: filteredOptions.length,
        filteredLabels: filteredOptions.map(opt => opt.label)
      });
      
      setOptions(filteredOptions);
      
      // Force immediate synchronization across all instances
      console.log('[useSignInOptionsJson] Dispatching storage change event for immediate sync');
      window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { 
        detail: { 
          category, 
          appliesTo, 
          updatedOptions: filteredOptions 
        } 
      }));
      
      // Also trigger a delayed refresh to catch any instances that missed the event
      setTimeout(() => {
        console.log('[useSignInOptionsJson] Secondary sync event dispatch');
        window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT + '_secondary'));
      }, 100);
      
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

  // Listen for storage changes from other components with enhanced sync
  useEffect(() => {
    const handleStorageChange = (event?: CustomEvent) => {
      console.log(`[useSignInOptionsJson] Storage change event received for "${category}"`, {
        eventDetail: event?.detail,
        currentCategory: category,
        currentAppliesTo: appliesTo
      });
      loadOptions();
    };

    const handleSecondarySync = () => {
      console.log(`[useSignInOptionsJson] Secondary sync event for "${category}"`);
      loadOptions();
    };

    console.log(`[useSignInOptionsJson] Setting up enhanced storage listeners for "${category}"`);
    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    window.addEventListener(STORAGE_CHANGE_EVENT + '_secondary', handleSecondarySync);
    
    return () => {
      console.log(`[useSignInOptionsJson] Cleaning up storage listeners for "${category}"`);
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
      window.removeEventListener(STORAGE_CHANGE_EVENT + '_secondary', handleSecondarySync);
    };
  }, [loadOptions, category, appliesTo]);

  return { 
    options, 
    loading, 
    addOption, 
    removeOption: removeOption 
  };
}

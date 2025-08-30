import { useState, useEffect } from 'react';
import signInOptionsData from '@/config/signInOptions.json';

interface SignInOption {
  id: string;
  label: string;
  applies_to: string;
  category: string;
  is_active: boolean;
}

export function useSignInOptionsJson(appliesTo: string = 'both', category: string = 'visit_type') {
  const [options, setOptions] = useState<SignInOption[]>([]);
  const [sessionOptions, setSessionOptions] = useState<SignInOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Load options directly from JSON file
  useEffect(() => {
    setLoading(true);
    try {
      console.log(`[useSignInOptionsJson] Loading options directly from JSON for category: "${category}", appliesTo: "${appliesTo}"`);
      
      // Start with JSON file data
      const allOptions = [...signInOptionsData, ...sessionOptions];
      
      // Filter based on criteria
      const filteredOptions = allOptions.filter((option: SignInOption) => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      
      console.log(`[useSignInOptionsJson] Filtered options:`, {
        totalJsonOptions: signInOptionsData.length,
        totalSessionOptions: sessionOptions.length,
        categoryMatch: allOptions.filter((option: SignInOption) => option.category === category).length,
        finalFiltered: filteredOptions.length,
        filteredOptions: filteredOptions.map(opt => ({ id: opt.id, label: opt.label, applies_to: opt.applies_to }))
      });
      
      setOptions(filteredOptions);
    } catch (error) {
      console.error('Error loading sign-in options from JSON:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [appliesTo, category, sessionOptions]);

  // Add new option (session-only, not persisted)
  const addOption = async (label: string, applies: string, cat: string) => {
    try {
      const newOption: SignInOption = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: label.trim(),
        applies_to: applies,
        category: cat,
        is_active: true
      };

      console.log('[useSignInOptionsJson] Adding session-only option:', newOption);
      setSessionOptions(prev => [...prev, newOption]);
      return null; // Success
    } catch (error: any) {
      console.error('Error adding session option:', error);
      return { message: error.message || 'Failed to add option' };
    }
  };

  // Remove/deactivate option (session-only for custom options, ignored for JSON options)
  const removeOption = async (id: string) => {
    try {
      // Only allow removal of session options (custom ones)
      if (id.startsWith('session_')) {
        console.log('[useSignInOptionsJson] Removing session option:', id);
        setSessionOptions(prev => prev.filter(option => option.id !== id));
      } else {
        console.log('[useSignInOptionsJson] Cannot remove JSON file option:', id);
        return { message: 'Cannot remove built-in options. Changes are session-only.' };
      }
      return null; // Success
    } catch (error: any) {
      console.error('Error removing session option:', error);
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
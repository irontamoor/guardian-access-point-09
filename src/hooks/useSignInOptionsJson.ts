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
  const [loading, setLoading] = useState(false);

  // Load options directly from JSON file
  useEffect(() => {
    setLoading(true);
    try {
      console.log(`[useSignInOptionsJson] Loading options directly from JSON for category: "${category}", appliesTo: "${appliesTo}"`);
      
      // Filter based on criteria
      const filteredOptions = signInOptionsData.filter((option: SignInOption) => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      
      console.log(`[useSignInOptionsJson] Filtered options:`, {
        totalJsonOptions: signInOptionsData.length,
        categoryMatch: signInOptionsData.filter((option: SignInOption) => option.category === category).length,
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
  }, [appliesTo, category]);

  return { 
    options, 
    loading
  };
}
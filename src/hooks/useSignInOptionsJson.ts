
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

  useEffect(() => {
    setLoading(true);
    try {
      const filteredOptions = signInOptionsData.filter(option => 
        option.is_active && 
        (option.applies_to === appliesTo || option.applies_to === 'both') &&
        option.category === category
      );
      setOptions(filteredOptions);
    } catch (error) {
      console.error('Error loading sign-in options:', error);
    } finally {
      setLoading(false);
    }
  }, [appliesTo, category]);

  return { options, loading };
}


import { useSignInOptionsJson } from './useSignInOptionsJson';

// Legacy hook that now uses JSON data
export function useSignInOptions(appliesTo: string = 'both', category: string = 'visit_type') {
  return useSignInOptionsJson(appliesTo, category);
}

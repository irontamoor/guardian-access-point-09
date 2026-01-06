// Error sanitization utility to prevent information leakage

const SENSITIVE_KEYWORDS = [
  'relation',
  'column', 
  'function',
  'permission denied',
  'table',
  'policy',
  'constraint',
  'does not exist',
  'violates',
  'duplicate key',
  'foreign key',
  'null value',
  'syntax error',
  'pg_',
  'auth.',
  'storage.',
  'supabase',
];

export function sanitizeError(error: unknown): string {
  const errorMsg = error instanceof Error 
    ? error.message 
    : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message: unknown }).message)
      : 'Unknown error';
  
  const lowerMsg = errorMsg.toLowerCase();
  
  for (const keyword of SENSITIVE_KEYWORDS) {
    if (lowerMsg.includes(keyword.toLowerCase())) {
      // Log full error in development only
      if (import.meta.env.DEV) {
        console.error('[INTERNAL ERROR]', errorMsg);
      }
      return 'An error occurred. Please try again or contact support.';
    }
  }
  
  return 'An error occurred. Please try again.';
}

export function sanitizeErrorWithContext(error: unknown, context: string): string {
  const sanitized = sanitizeError(error);
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
  return sanitized;
}

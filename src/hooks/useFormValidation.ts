import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface FieldError {
  message: string;
  hasError: boolean;
}

export interface ValidationState {
  [fieldName: string]: FieldError;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationState>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((fieldName: string, value: string): FieldError => {
    const rule = rules[fieldName];
    if (!rule) return { message: '', hasError: false };

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return { message: `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`, hasError: true };
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return { message: `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} must be at least ${rule.minLength} characters`, hasError: true };
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return { message: `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} format is invalid`, hasError: true };
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return { message: customError, hasError: true };
      }
    }

    return { message: '', hasError: false };
  }, [rules]);

  const validate = useCallback((data: { [key: string]: string }): boolean => {
    const newErrors: ValidationState = {};
    let hasErrors = false;

    Object.keys(rules).forEach(fieldName => {
      const value = data[fieldName] || '';
      const fieldError = validateField(fieldName, value);
      newErrors[fieldName] = fieldError;
      if (fieldError.hasError) {
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [rules, validateField]);

  const validateSingle = useCallback((fieldName: string, value: string) => {
    const fieldError = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: fieldError }));
    return !fieldError.hasError;
  }, [validateField]);

  const setFieldTouched = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback((fieldName: string): FieldError => {
    return errors[fieldName] || { message: '', hasError: false };
  }, [errors]);

  const isFieldTouched = useCallback((fieldName: string): boolean => {
    return touched[fieldName] || false;
  }, [touched]);

  return {
    errors,
    validate,
    validateSingle,
    setFieldTouched,
    clearErrors,
    getFieldError,
    isFieldTouched,
  };
};
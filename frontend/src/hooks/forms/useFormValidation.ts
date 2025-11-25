/**
 * Form Validation Hook
 *
 * Provides common validation utilities for forms.
 * Can be used standalone or with useFormState.
 *
 * @example
 * ```tsx
 * const { validateField, validateForm } = useFormValidation({
 *   email: [required(), email()],
 *   password: [required(), minLength(8)],
 * });
 *
 * const emailError = validateField('email', formValues.email);
 * const allErrors = validateForm(formValues);
 * ```
 */

import { useMemo, useCallback } from 'react';

export type ValidationRule<T = any> = (value: T) => string | undefined;

export interface ValidationSchema<T> {
  [K: string]: ValidationRule[];
}

/**
 * Common validation rules
 */
export const validators = {
  /**
   * Required field validator
   */
  required: (message = 'This field is required'): ValidationRule => {
    return (value: any) => {
      if (value === undefined || value === null || value === '') {
        return message;
      }
      if (typeof value === 'string' && value.trim() === '') {
        return message;
      }
      return undefined;
    };
  },

  /**
   * Email format validator
   */
  email: (message = 'Invalid email address'): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return undefined;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? undefined : message;
    };
  },

  /**
   * Minimum length validator
   */
  minLength: (
    length: number,
    message?: string
  ): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return undefined;
      return value.length >= length
        ? undefined
        : message || `Must be at least ${length} characters`;
    };
  },

  /**
   * Maximum length validator
   */
  maxLength: (
    length: number,
    message?: string
  ): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return undefined;
      return value.length <= length
        ? undefined
        : message || `Must be at most ${length} characters`;
    };
  },

  /**
   * Pattern validator (regex)
   */
  pattern: (
    regex: RegExp,
    message = 'Invalid format'
  ): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return undefined;
      return regex.test(value) ? undefined : message;
    };
  },

  /**
   * Minimum value validator (for numbers)
   */
  min: (
    minValue: number,
    message?: string
  ): ValidationRule<number> => {
    return (value: number) => {
      if (value === undefined || value === null) return undefined;
      return value >= minValue
        ? undefined
        : message || `Must be at least ${minValue}`;
    };
  },

  /**
   * Maximum value validator (for numbers)
   */
  max: (
    maxValue: number,
    message?: string
  ): ValidationRule<number> => {
    return (value: number) => {
      if (value === undefined || value === null) return undefined;
      return value <= maxValue
        ? undefined
        : message || `Must be at most ${maxValue}`;
    };
  },

  /**
   * URL validator
   */
  url: (message = 'Invalid URL'): ValidationRule<string> => {
    return (value: string) => {
      if (!value) return undefined;
      try {
        new URL(value);
        return undefined;
      } catch {
        return message;
      }
    };
  },

  /**
   * Custom validator
   */
  custom: <T = any>(
    validatorFn: (value: T) => boolean,
    message = 'Invalid value'
  ): ValidationRule<T> => {
    return (value: T) => {
      return validatorFn(value) ? undefined : message;
    };
  },

  /**
   * Match field validator (e.g., password confirmation)
   */
  matches: (
    otherField: string,
    message = 'Fields do not match'
  ): ValidationRule => {
    return (value: any, allValues: any) => {
      if (!value) return undefined;
      return value === allValues?.[otherField] ? undefined : message;
    };
  },
};

export interface UseFormValidationReturn<T> {
  /**
   * Validate a single field
   */
  validateField: (fieldName: keyof T, value: any, allValues?: T) => string | undefined;

  /**
   * Validate entire form
   */
  validateForm: (values: T) => Partial<Record<keyof T, string>>;

  /**
   * Check if a field has errors
   */
  hasError: (fieldName: keyof T, errors: Partial<Record<keyof T, string>>) => boolean;
}

/**
 * Hook for form validation with schema
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: ValidationSchema<T>
): UseFormValidationReturn<T> {
  const validateField = useCallback(
    (fieldName: keyof T, value: any, allValues?: T): string | undefined => {
      const rules = schema[fieldName as string];
      if (!rules || rules.length === 0) return undefined;

      for (const rule of rules) {
        const error = rule(value, allValues);
        if (error) return error;
      }

      return undefined;
    },
    [schema]
  );

  const validateForm = useCallback(
    (values: T): Partial<Record<keyof T, string>> => {
      const errors: Partial<Record<keyof T, string>> = {};

      Object.keys(schema).forEach((fieldName) => {
        const error = validateField(fieldName as keyof T, values[fieldName], values);
        if (error) {
          errors[fieldName as keyof T] = error;
        }
      });

      return errors;
    },
    [schema, validateField]
  );

  const hasError = useCallback(
    (fieldName: keyof T, errors: Partial<Record<keyof T, string>>): boolean => {
      return !!errors[fieldName];
    },
    []
  );

  return {
    validateField,
    validateForm,
    hasError,
  };
}

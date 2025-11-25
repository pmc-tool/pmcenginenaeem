/**
 * Form State Hook
 *
 * Manages form state with validation, dirty tracking, and error handling.
 * Provides a unified interface for form management across the application.
 *
 * @example
 * ```tsx
 * const form = useFormState({
 *   initialValues: { email: '', password: '' },
 *   onSubmit: async (values) => {
 *     await login(values);
 *   },
 * });
 *
 * <input
 *   value={form.values.email}
 *   onChange={(e) => form.setFieldValue('email', e.target.value)}
 *   onBlur={() => form.setFieldTouched('email')}
 * />
 * {form.errors.email && form.touched.email && <span>{form.errors.email}</span>}
 * ```
 */

import { useState, useCallback } from 'react';

export interface UseFormStateConfig<T> {
  /**
   * Initial form values
   */
  initialValues: T;

  /**
   * Form submission handler
   */
  onSubmit: (values: T) => void | Promise<void>;

  /**
   * Validation function (optional)
   * Returns error object where keys match field names
   */
  validate?: (values: T) => Partial<Record<keyof T, string>>;

  /**
   * Reset form after successful submission
   * @default false
   */
  resetOnSubmit?: boolean;
}

export interface UseFormStateReturn<T> {
  /**
   * Current form values
   */
  values: T;

  /**
   * Form errors (keyed by field name)
   */
  errors: Partial<Record<keyof T, string>>;

  /**
   * Touched fields (for showing errors only after user interaction)
   */
  touched: Partial<Record<keyof T, boolean>>;

  /**
   * Is form currently submitting
   */
  isSubmitting: boolean;

  /**
   * Has form been modified from initial values
   */
  isDirty: boolean;

  /**
   * Is form valid (no errors)
   */
  isValid: boolean;

  /**
   * Set value for a specific field
   */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;

  /**
   * Mark field as touched
   */
  setFieldTouched: <K extends keyof T>(field: K, touched?: boolean) => void;

  /**
   * Set error for a specific field
   */
  setFieldError: <K extends keyof T>(field: K, error: string) => void;

  /**
   * Reset form to initial values
   */
  reset: () => void;

  /**
   * Handle form submission
   */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;

  /**
   * Get field props (value, onChange, onBlur) for easy spreading
   */
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: () => void;
  };
}

/**
 * Custom hook for managing form state with validation and submission
 */
export function useFormState<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
  resetOnSubmit = false,
}: UseFormStateConfig<T>): UseFormStateReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form is dirty
  const isDirty = Object.keys(values).some(
    (key) => values[key] !== initialValues[key]
  );

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Run validation if validator is provided
      if (validate) {
        const newValues = { ...values, [field]: value };
        const validationErrors = validate(newValues);
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (validationErrors[field]) {
            newErrors[field] = validationErrors[field];
          } else {
            delete newErrors[field];
          }
          return newErrors;
        });
      }
    },
    [values, validate]
  );

  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, isTouched = true) => {
      setTouched((prev) => ({ ...prev, [field]: isTouched }));
    },
    []
  );

  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string) => {
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    []
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      // Submit
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        if (resetOnSubmit) {
          reset();
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit, resetOnSubmit, reset]
  );

  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFieldValue(field, e.target.value as T[K]);
      },
      onBlur: () => {
        setFieldTouched(field);
      },
    }),
    [values, setFieldValue, setFieldTouched]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    reset,
    handleSubmit,
    getFieldProps,
  };
}

/**
 * Example: Form Migration
 *
 * This file demonstrates how to migrate a typical form component
 * to use our new custom hooks from Phase 3.
 *
 * BEFORE: Manual state management (100+ LOC)
 * AFTER: Using useFormState + useFormValidation (40 LOC)
 *
 * This is an example/reference file showing the migration pattern.
 */

import React from 'react';
import { useFormState, validators } from '../../../hooks';
import { Button, TextField } from '../../ui';

// ============================================================================
// BEFORE: Manual Form State Management (~100 LOC)
// ============================================================================

export function ContactFormBefore() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateField = (fieldName: string, value: string) => {
    const newErrors = { ...errors };

    if (fieldName === 'name') {
      if (!value) {
        newErrors.name = 'Name is required';
      } else {
        delete newErrors.name;
      }
    }

    if (fieldName === 'email') {
      if (!value) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Invalid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (fieldName === 'message') {
      if (!value) {
        newErrors.message = 'Message is required';
      } else if (value.length < 10) {
        newErrors.message = 'Message must be at least 10 characters';
      } else {
        delete newErrors.message;
      }
    }

    setErrors(newErrors);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (touched.name) {
      validateField('name', e.target.value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched.email) {
      validateField('email', e.target.value);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (touched.message) {
      validateField('message', e.target.value);
    }
  };

  const handleNameBlur = () => {
    setTouched({ ...touched, name: true });
    validateField('name', name);
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    validateField('email', email);
  };

  const handleMessageBlur = () => {
    setTouched({ ...touched, message: true });
    validateField('message', message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ name: true, email: true, message: true });

    // Validate all fields
    validateField('name', name);
    validateField('email', email);
    validateField('message', message);

    // Check if there are errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactForm({ name, email, message });
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        error={touched.name ? errors.name : undefined}
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
        error={touched.email ? errors.email : undefined}
      />

      <TextField
        label="Message"
        value={message}
        onChange={handleMessageChange}
        onBlur={handleMessageBlur}
        error={touched.message ? errors.message : undefined}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}

// ============================================================================
// AFTER: Using Custom Hooks (~40 LOC)
// ============================================================================

export function ContactFormAfter() {
  const form = useFormState({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: async (values) => {
      await submitContactForm(values);
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.name) {
        errors.name = 'Name is required';
      }

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Invalid email address';
      }

      if (!values.message) {
        errors.message = 'Message is required';
      } else if (values.message.length < 10) {
        errors.message = 'Message must be at least 10 characters';
      }

      return errors;
    },
    resetOnSubmit: true,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        label="Name"
        {...form.getFieldProps('name')}
        error={form.touched.name ? form.errors.name : undefined}
      />

      <TextField
        label="Email"
        type="email"
        {...form.getFieldProps('email')}
        error={form.touched.email ? form.errors.email : undefined}
      />

      <TextField
        label="Message"
        {...form.getFieldProps('message')}
        error={form.touched.message ? form.errors.message : undefined}
      />

      <Button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}

// ============================================================================
// EVEN BETTER: Using useFormValidation with validators (~35 LOC)
// ============================================================================

export function ContactFormBest() {
  const form = useFormState({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: async (values) => {
      await submitContactForm(values);
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      // Use built-in validators
      const nameError = validators.required()('name', values.name);
      if (nameError) errors.name = nameError;

      const emailRequired = validators.required()(values.email);
      const emailFormat = validators.email()(values.email);
      if (emailRequired) errors.email = emailRequired;
      else if (emailFormat) errors.email = emailFormat;

      const messageRequired = validators.required()(values.message);
      const messageLength = validators.minLength(10)(values.message);
      if (messageRequired) errors.message = messageRequired;
      else if (messageLength) errors.message = messageLength;

      return errors;
    },
    resetOnSubmit: true,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        label="Name"
        {...form.getFieldProps('name')}
        error={form.touched.name ? form.errors.name : undefined}
      />

      <TextField
        label="Email"
        type="email"
        {...form.getFieldProps('email')}
        error={form.touched.email ? form.errors.email : undefined}
      />

      <TextField
        label="Message"
        {...form.getFieldProps('message')}
        error={form.touched.message ? form.errors.message : undefined}
      />

      <Button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}

// ============================================================================
// Mock API function
// ============================================================================

async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}) {
  // Simulate API call
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

/**
 * MIGRATION SUMMARY:
 *
 * Code Reduction: 100 LOC → 35 LOC (65% reduction)
 *
 * Benefits:
 * - ✅ Less boilerplate
 * - ✅ Consistent validation patterns
 * - ✅ Built-in dirty tracking
 * - ✅ Automatic touched state management
 * - ✅ Type-safe form values
 * - ✅ Reusable validation rules
 * - ✅ Better error handling
 * - ✅ Easier to test
 *
 * Migration Steps:
 * 1. Replace multiple useState calls with single useFormState
 * 2. Move validation logic to validate function
 * 3. Replace manual onChange/onBlur with getFieldProps()
 * 4. Remove manual error/touched state management
 * 5. Use built-in validators for common rules
 */

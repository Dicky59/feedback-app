import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FeedbackData } from '../types/feedback';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation', () => {
  const initialData: FeedbackData = {
    name: '',
    email: '',
    message: '',
  };

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    expect(result.current.formData).toEqual(initialData);
    expect(result.current.errors).toEqual({});
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isFormValid).toBe(false);
  });

  it('updates form data when updateField is called', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    act(() => {
      result.current.updateField('name', 'John Doe');
    });

    expect(result.current.formData.name).toBe('John Doe');
    expect(result.current.isDirty).toBe(true);
  });

  it('validates name field correctly', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    // Test empty name
    act(() => {
      result.current.updateField('name', '');
    });

    expect(result.current.errors.name).toBe('Name is required');

    // Test name too short
    act(() => {
      result.current.updateField('name', 'A');
    });

    expect(result.current.errors.name).toBe('Name must be at least 2 characters');

    // Test name too long
    act(() => {
      result.current.updateField('name', 'A'.repeat(101));
    });

    expect(result.current.errors.name).toBe('Name must not exceed 100 characters');

    // Test valid name
    act(() => {
      result.current.updateField('name', 'John Doe');
    });

    expect(result.current.errors.name).toBeUndefined();
  });

  it('validates email field correctly', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    // Test empty email
    act(() => {
      result.current.updateField('email', '');
    });

    expect(result.current.errors.email).toBe('Email is required');

    // Test invalid email format
    act(() => {
      result.current.updateField('email', 'invalid-email');
    });

    expect(result.current.errors.email).toBe('Please enter a valid email address');

    // Test email too long
    act(() => {
      result.current.updateField('email', 'a'.repeat(250) + '@example.com');
    });

    expect(result.current.errors.email).toBe('Email must not exceed 255 characters');

    // Test valid email
    act(() => {
      result.current.updateField('email', 'john@example.com');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('validates message field correctly', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    // Test empty message
    act(() => {
      result.current.updateField('message', '');
    });

    expect(result.current.errors.message).toBe('Message is required');

    // Test message too short
    act(() => {
      result.current.updateField('message', 'Short');
    });

    expect(result.current.errors.message).toBe('Message must be at least 10 characters');

    // Test message too long
    act(() => {
      result.current.updateField('message', 'A'.repeat(1001));
    });

    expect(result.current.errors.message).toBe('Message must not exceed 1000 characters');

    // Test valid message
    act(() => {
      result.current.updateField('message', 'This is a valid message with enough characters');
    });

    expect(result.current.errors.message).toBeUndefined();
  });

  it('resets form correctly', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    // First, make some changes
    act(() => {
      result.current.updateField('name', 'John Doe');
      result.current.updateField('email', 'john@example.com');
    });

    expect(result.current.formData.name).toBe('John Doe');
    expect(result.current.isDirty).toBe(true);

    // Then reset
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(initialData);
    expect(result.current.errors).toEqual({});
    expect(result.current.isDirty).toBe(false);
  });

  it('determines form validity correctly', () => {
    const { result } = renderHook(() => useFormValidation(initialData));

    // Initially invalid (not dirty)
    expect(result.current.isFormValid).toBe(false);

    // Make form dirty but with errors
    act(() => {
      result.current.updateField('name', '');
    });

    expect(result.current.isFormValid).toBe(false);

    // Fix all fields
    act(() => {
      result.current.updateField('name', 'John Doe');
      result.current.updateField('email', 'john@example.com');
      result.current.updateField('message', 'This is a valid message with enough characters');
    });

    expect(result.current.isFormValid).toBe(true);
  });
});

import { useEffect, useState } from 'react';
import type { FeedbackData, ValidationErrors } from '../types/feedback';

export const useFormValidation = (initialData: FeedbackData) => {
  const [formData, setFormData] = useState<FeedbackData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  // Real-time validation
  useEffect(() => {
    if (isDirty) {
      const newErrors: ValidationErrors = {};

      // Validate name
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length > 100) {
        newErrors.name = 'Name must not exceed 100 characters';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      // Validate email
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (formData.email.length > 255) {
        newErrors.email = 'Email must not exceed 255 characters';
      }

      // Validate message
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      } else if (formData.message.length > 1000) {
        newErrors.message = 'Message must not exceed 1000 characters';
      } else if (formData.message.length < 10) {
        newErrors.message = 'Message must be at least 10 characters';
      }

      setErrors(newErrors);
    }
  }, [formData, isDirty]);


  const updateField = (field: keyof FeedbackData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
    setIsDirty(false);
  };

  const isFormValid = Object.keys(errors).length === 0 && isDirty;

  return {
    formData,
    errors,
    isDirty,
    isFormValid,
    updateField,
    resetForm,
    setFormData
  };
};

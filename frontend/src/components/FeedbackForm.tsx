import React, { useEffect, useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { FeedbackService } from '../services/feedbackService';
import type { FeedbackRequest } from '../types/feedback';

export const FeedbackForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Auto-clear success messages after 3 seconds
  useEffect(() => {
    if (message && message.includes('Thank you')) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const {
    formData,
    errors,
    isFormValid,
    updateField,
    resetForm
  } = useFormValidation({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof FeedbackRequest, value);

    if (message) {
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setMessage('Please fix the validation errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await FeedbackService.submitFeedback(formData);
      setMessage(`Thank you! Your feedback has been submitted successfully. Reference ID: ${response.id}`);
      resetForm();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage(error instanceof Error ? error.message : 'Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {message && (
        <div className={`message ${message.includes('Thank you') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <h2>Submit Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={errors.message ? 'error' : ''}
            required
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};
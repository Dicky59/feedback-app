import React, { useEffect, useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { FeedbackService } from '../services/feedbackService';
import type { FeedbackData } from '../types/feedback';
import './FeedbackForm.css';
import { Modal } from './Modal';

export const FeedbackForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  // Auto-close success modal after 3 seconds
  useEffect(() => {
    if (isModalOpen && modalType === 'success') {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
        setMessage('');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isModalOpen, modalType]);

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
    updateField(name as keyof FeedbackData, value);

    if (isModalOpen) {
      setIsModalOpen(false);
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setMessage('Please fix the validation errors before submitting.');
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await FeedbackService.submitFeedback(formData);
      setMessage(`Thank you! Your feedback has been submitted successfully. Reference ID: ${response.id}`);
      setModalType('success');
      setIsModalOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage(error instanceof Error ? error.message : 'Error submitting feedback. Please try again.');
      setModalType('error');
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  return (
    <div className="feedback-form-container">
      <h2>Submit Your Feedback</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter your full name"
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter your email address"
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={errors.message ? 'error' : ''}
            placeholder="Please share your feedback, suggestions, or comments..."
            required
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={modalType}
      >
        <p className={`modal-message ${modalType}`}>
          {message || 'Test message - no message set'}
        </p>
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { FeedbackService } from '../services/feedbackService';
import type { FeedbackRequest } from '../types/feedback';

export const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackRequest>({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const response = await FeedbackService.submitFeedback(formData);
      setMessage(`Thank you! Your feedback has been submitted successfully. Reference ID: ${response.id}`);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage(error instanceof Error ? error.message : 'Error submitting feedback. Please try again.');
    } finally {
      setLoading(false);
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
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};
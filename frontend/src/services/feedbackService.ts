import type { FeedbackRequest, FeedbackResponse } from '../types/feedback';

const API_BASE_URL = 'http://localhost:8080/api';

export class FeedbackService {
  /**
   * Submit feedback to the backend API
   */
  static async submitFeedback(feedback: FeedbackRequest): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: FeedbackResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback. Please try again.');
    }
  }

  /**
   * Test API connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'OPTIONS',
      });
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}
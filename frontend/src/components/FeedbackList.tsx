import React, { useEffect, useState } from 'react';
import { FeedbackService } from '../services/feedbackService';
import type { FeedbackItem } from '../types/feedback';
import './FeedbackList.css';

export const FeedbackList: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError('');

    try {
      const feedback = await FeedbackService.getAllFeedback();
      setFeedbackList(feedback);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="feedback-list-container">
        <h2>Feedback List</h2>
        <div className="loading">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-list-container">
        <h2>Feedback List</h2>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchFeedback} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-list-container">
      <div className="feedback-list-header">
        <h2>Feedback List</h2>
        <button onClick={fetchFeedback} className="refresh-button">
          Refresh
        </button>
      </div>

      {feedbackList.length === 0 ? (
        <div className="no-feedback">
          <p>No feedback submitted yet.</p>
          <p>Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="feedback-list">
          {feedbackList.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <h3 className="feedback-name">{feedback.name}</h3>
                <span className="feedback-date">{formatDate(feedback.createdAt)}</span>
              </div>
              <p className="feedback-email">{feedback.email}</p>
              <p className="feedback-message">{feedback.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

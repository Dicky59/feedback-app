import React from 'react';
import { FeedbackForm } from '../components/FeedbackForm';

export const HomePage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Submit Your Feedback</h1>
        <p>We value your opinion! Please share your thoughts, suggestions, or any issues you've encountered.</p>
      </div>
      <FeedbackForm />
    </div>
  );
};

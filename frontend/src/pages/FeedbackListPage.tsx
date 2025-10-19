import React from 'react';
import { FeedbackList } from '../components/FeedbackList';

export const FeedbackListPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Feedback</h1>
        <p>View all submitted feedback from our users.</p>
      </div>
      <FeedbackList />
    </div>
  );
};

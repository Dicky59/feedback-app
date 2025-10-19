import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Submit Feedback
          </Link>
          <Link
            to="/feedback-list"
            className={`nav-link ${location.pathname === '/feedback-list' ? 'active' : ''}`}
          >
            View Feedback
          </Link>
        </div>
      </div>
    </nav>
  );
};

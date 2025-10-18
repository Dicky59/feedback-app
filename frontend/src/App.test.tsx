import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the feedback app header', () => {
    render(<App />);

    expect(screen.getByText('Feedback App')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our feedback application!')).toBeInTheDocument();
  });

  it('renders the feedback form', () => {
    render(<App />);

    expect(screen.getByText('Submit Your Feedback')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
  });
});
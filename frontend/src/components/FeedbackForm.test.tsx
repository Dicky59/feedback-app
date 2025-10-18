import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeedbackForm } from './FeedbackForm';

// Mock the feedback service
vi.mock('../services/feedbackService', () => ({
  FeedbackService: {
    submitFeedback: vi.fn(),
  },
}));

// Mock the useFormValidation hook
vi.mock('../hooks/useFormValidation', () => ({
  useFormValidation: () => ({
    formData: {
      name: '',
      email: '',
      message: '',
    },
    errors: {},
    isFormValid: true,
    updateField: vi.fn(),
    resetForm: vi.fn(),
  }),
}));

describe('FeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the feedback form with all fields', () => {
    render(<FeedbackForm />);

    expect(screen.getByText('Submit Your Feedback')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
  });

  it('has proper input placeholders', () => {
    render(<FeedbackForm />);

    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Please share your feedback, suggestions, or comments...')).toBeInTheDocument();
  });

  it('submit button is enabled when form is valid', () => {
    render(<FeedbackForm />);

    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    expect(submitButton).not.toBeDisabled();
  });
});

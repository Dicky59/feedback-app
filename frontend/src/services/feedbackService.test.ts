import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FeedbackData, FeedbackResponse } from '../types/feedback';
import { FeedbackService } from './feedbackService';

// Mock fetch globally
const mockFetch = vi.fn();
(globalThis as any).fetch = mockFetch;

describe('FeedbackService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFeedbackRequest: FeedbackData = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Great service!',
  };

  const mockFeedbackResponse: FeedbackResponse = {
    id: 1,
    name: 'John Doe',
    message: 'Great service!',
  };

  it('submits feedback successfully', async () => {
    const mockResponse = {
      ok: true,
      json: async () => mockFeedbackResponse,
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    const result = await FeedbackService.submitFeedback(mockFeedbackRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/feedback',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFeedbackRequest),
      }
    );

    expect(result).toEqual(mockFeedbackResponse);
  });

  it('handles API error responses', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 400,
      json: async () => ({
        error: 'Validation failed',
        details: 'Name is required',
      }),
    };

    mockFetch.mockResolvedValueOnce(mockErrorResponse);

    await expect(FeedbackService.submitFeedback(mockFeedbackRequest))
      .rejects
      .toThrow('HTTP error! status: 400');
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(FeedbackService.submitFeedback(mockFeedbackRequest))
      .rejects
      .toThrow('Network error');
  });

  it('handles malformed JSON responses', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    await expect(FeedbackService.submitFeedback(mockFeedbackRequest))
      .rejects
      .toThrow('HTTP error! status: 500');
  });

  it('handles server errors with custom message', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 500,
      json: async () => ({
        message: 'Database connection failed',
      }),
    };

    mockFetch.mockResolvedValueOnce(mockErrorResponse);

    await expect(FeedbackService.submitFeedback(mockFeedbackRequest))
      .rejects
      .toThrow('Database connection failed');
  });

  it('uses correct API endpoint', async () => {
    const mockResponse = {
      ok: true,
      json: async () => mockFeedbackResponse,
    };

    mockFetch.mockResolvedValueOnce(mockResponse);

    await FeedbackService.submitFeedback(mockFeedbackRequest);

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/feedback',
      expect.any(Object)
    );
  });
});

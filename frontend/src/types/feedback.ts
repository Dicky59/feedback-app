export interface FeedbackData {
  name: string;
  email: string;
  message: string;
}

export interface FeedbackRequest {
  name: string;
  email: string;
  message: string;
}

export interface FeedbackResponse {
  id: number;
  name: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}
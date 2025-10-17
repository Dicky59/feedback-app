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
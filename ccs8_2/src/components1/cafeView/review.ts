export interface Review {
  authorName: string;
  rating: number;
  text: string;
  time: string; // ISO date string
}

export interface GoogleReviewResponse {
  status: string;
  result?: {
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time: number; // Unix timestamp in seconds
    }>;
  };
  error_message?: string;
}
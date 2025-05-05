import { Review, GoogleReviewResponse } from './review';

export const parseGoogleReviews = (response: GoogleReviewResponse): Review[] => {
  if (response.status !== 'OK' || !response.result?.reviews) {
    return [];
  }

  return response.result.reviews.map((review) => ({
    authorName: review.author_name || 'Anonymous',
    rating: Math.max(1, Math.min(5, review.rating)) || 0, // Ensure rating is between 1 and 5
    text: review.text || 'No review text provided',
    time: new Date(review.time * 1000).toISOString(), // Convert Unix timestamp to ISO string
  }));
};
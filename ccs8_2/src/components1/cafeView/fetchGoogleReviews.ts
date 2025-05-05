import { GoogleReviewResponse } from './review';

  export const findPlaceId = async (cafeName: string): Promise<string | null> => {
    if (!cafeName || typeof cafeName !== 'string' || cafeName.trim() === '') {
      throw new Error('Invalid cafe name');
    }

    return new Promise<string | null>((resolve, reject) => {
      const mapDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(mapDiv);

      service.findPlaceFromQuery(
        {
          query: cafeName,
          fields: ['place_id'],
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            resolve(results[0].place_id || null);
          } else {
            console.warn('No Place ID found:', { status });
            resolve(null);
          }
        }
      );
    });
  };

  export const fetchGoogleReviews = async (placeId: string, cafeName?: string): Promise<GoogleReviewResponse> => {
    console.log('Fetching reviews with Place ID:', placeId, 'Cafe Name:', cafeName);

    let finalPlaceId = placeId;

    if ((!placeId || typeof placeId !== 'string' || placeId.trim() === '') && cafeName) {
      const foundPlaceId = await findPlaceId(cafeName);
      if (!foundPlaceId) {
        throw new Error('Could not find Place ID for the provided cafe name');
      }
      finalPlaceId = foundPlaceId;
    }

    if (!finalPlaceId || typeof finalPlaceId !== 'string' || finalPlaceId.trim() === '') {
      throw new Error('Invalid Place ID');
    }

    return new Promise<GoogleReviewResponse>((resolve, reject) => {
      const mapDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(mapDiv);

      service.getDetails(
        {
          placeId: finalPlaceId,
          fields: ['reviews'],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.reviews) {
            const response: GoogleReviewResponse = {
              status: 'OK',
              result: {
                reviews: place.reviews.map((review) => ({
                  author_name: review.author_name || '',
                  rating: review.rating || 0,
                  text: review.text || '',
                  time: review.time || 0,
                })),
              },
            };
            console.log('Google API Response:', response);
            resolve(response);
          } else {
            console.error('Error fetching Google reviews:', { status });
            reject(new Error(`Failed to fetch reviews from Google Places API: ${status}`));
          }
        }
      );
    });
  };
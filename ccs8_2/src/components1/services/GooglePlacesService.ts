// src/services/GooglePlacesService.ts
import { safeGetCache } from './cacheHelper';

interface PlaceSuggestion {
  name: string;
  place_id: string;
  lat: number;
  lon: number;
}

export interface CafeDetails {
  place_id: string;
  name: string;
  photos: string[];
  lat: number;
  lon: number;
  address: string;
  rating: number | null;
  amenities: string[];
}

// Cache responses to avoid unnecessary API calls
const apiCache = new Map<string, string | null>();

// API key from .env
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || 'AIzaSyBOQbqvtffeuLeuo4DpS_zBF71ic-R0ocU';

export const fetchPlaceSuggestions = (
  query: string,
  onSuccess: (results: PlaceSuggestion[]) => void,
  onError: () => void
) => {
  if (!window.google?.maps?.places) {
    console.error('[fetchPlaceSuggestions] Google Maps API not loaded.');
    onError();
    return;
  }

  const autocompleteService = new window.google.maps.places.AutocompleteService();

  autocompleteService.getPlacePredictions(
    {
      input: query,
      types: ['cafe'],
      location: new window.google.maps.LatLng(9.3077, 123.3074), // Dumaguete City
      radius: 10000, // 10km
    },
    (predictions, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
        console.error(`[fetchPlaceSuggestions] Autocomplete failed: ${status}`);
        onError();
        return;
      }

      const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
      const results: PlaceSuggestion[] = [];
      let processed = 0;

      predictions.forEach((prediction) => {
        placesService.getDetails(
          {
            placeId: prediction.place_id,
            fields: ['name', 'geometry', 'formatted_address'],
          },
          (place, detailStatus) => {
            if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
              results.push({
                name: place.name || prediction.description,
                place_id: prediction.place_id,
                lat: place.geometry.location.lat(),
                lon: place.geometry.location.lng(),
              });
            }
            processed++;
            if (processed === predictions.length) {
              onSuccess(results);
            }
          }
        );
      });

      if (predictions.length === 0) {
        onSuccess([]);
      }
    }
  );
};

export const fetchTopCafes = (
  onSuccess: (cafes: CafeDetails[]) => void,
  onError: () => void
) => {
  if (!window.google?.maps?.places) {
    console.error('[fetchTopCafes] Google Maps API not loaded.');
    onError();
    return;
  }

  const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));

  placesService.nearbySearch(
    {
      location: new window.google.maps.LatLng(9.3077, 123.3074),
      radius: 10000,
      type: 'cafe',
      rankBy: window.google.maps.places.RankBy.PROMINENCE,
    },
    (results, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) {
        console.error(`[fetchTopCafes] NearbySearch failed: ${status}`);
        onError();
        return;
      }

      const cafes: CafeDetails[] = results.slice(0, 5).map((place) => ({
        place_id: place.place_id || '',
        name: place.name || '',
        photos: place.photos
          ? place.photos.slice(0, 3).map((photo) => {
              const url = photo.getUrl({ maxWidth: 400 });
              return typeof url === 'string' ? url : 'https://via.placeholder.com/400x300?text=No+Image';
            })
          : ['https://via.placeholder.com/400x300?text=No+Image'],
        lat: place.geometry?.location?.lat() || 9.3077,
        lon: place.geometry?.location?.lng() || 123.3074,
        address: place.vicinity || place.formatted_address || 'Unknown address',
        rating: place.rating || null,
        amenities: place.types?.includes('wifi') ? ['Wi-Fi'] : [], // Placeholder
      }));

      onSuccess(cafes);
    }
  );
};

export const fetchCafesByQuery = (
  query: string,
  lat: number,
  lon: number,
  onSuccess: (cafes: CafeDetails[]) => void,
  onError: () => void
) => {
  if (!window.google?.maps?.places) {
    console.error('[fetchCafesByQuery] Google Maps API not loaded.');
    onError();
    return;
  }

  const autocompleteService = new window.google.maps.places.AutocompleteService();

  autocompleteService.getPlacePredictions(
    {
      input: query,
      types: ['cafe'],
      location: new window.google.maps.LatLng(lat, lon),
      radius: 5000, // Tighten radius to 5km to prioritize local results
    },
    (predictions, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
        console.error(`[fetchCafesByQuery] Autocomplete failed: ${status}`);
        onError();
        return;
      }

      console.log('[fetchCafesByQuery] Predictions:', predictions);

      // Filter predictions to include only those in Dumaguete
      const filteredPredictions = predictions.filter(prediction => {
        const secondaryText = prediction.structured_formatting.secondary_text.toLowerCase();
        return secondaryText.includes('dumaguete');
      });

      if (filteredPredictions.length === 0) {
        console.log('[fetchCafesByQuery] No predictions found in Dumaguete');
        onSuccess([]);
        return;
      }

      const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
      const cafes: CafeDetails[] = [];
      let processed = 0;

      filteredPredictions.forEach((prediction) => {
        console.log(`[fetchCafesByQuery] Fetching details for place_id: ${prediction.place_id}`);
        placesService.getDetails(
          {
            placeId: prediction.place_id,
            fields: ['name', 'geometry', 'formatted_address', 'photos', 'rating', 'types'],
          },
          (place, detailStatus) => {
            if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
              console.log(`[fetchCafesByQuery] Place details for ${prediction.place_id}:`, place);
              const cafe: CafeDetails = {
                place_id: prediction.place_id,
                name: place.name || prediction.description,
                photos: place.photos
                  ? place.photos.slice(0, 3).map((photo) => {
                      const url = photo.getUrl({ maxWidth: 400 });
                      console.log(`[fetchCafesByQuery] Photo URL for ${place.name}: ${url}`);
                      return typeof url === 'string' ? url : 'https://via.placeholder.com/400x300?text=No+Image';
                    })
                  : ['https://via.placeholder.com/400x300?text=No+Image'],
                lat: place.geometry.location.lat(),
                lon: place.geometry.location.lng(),
                address: place.formatted_address || 'Unknown address',
                rating: place.rating || null,
                amenities: place.types?.includes('wifi') ? ['Wi-Fi'] : [],
              };
              console.log(`[fetchCafesByQuery] Added cafe: ${cafe.name}, Photos: ${JSON.stringify(cafe.photos)}`);
              cafes.push(cafe);
            } else {
              console.error(`[fetchCafesByQuery] Failed to fetch details for place_id: ${prediction.place_id}, status: ${detailStatus}`);
            }
            processed++;
            if (processed === filteredPredictions.length) {
              console.log('[fetchCafesByQuery] Final cafes:', cafes);
              onSuccess(cafes);
            }
          }
        );
      });
    }
  );
};

export const fetchPlacePhoto = async (
  placeId: string,
  onSuccess: (photoUrl: string | null) => void,
  onError: () => void
) => {
  if (!placeId || typeof placeId !== 'string' || placeId.trim() === '') {
    console.error('[fetchPlacePhoto] Invalid place_id:', placeId);
    onError();
    return;
  }

  console.log(`[fetchPlacePhoto] Fetching photo for place_id: ${placeId}`);

  const cacheKey = `photo_${placeId}`;
  if (apiCache.has(cacheKey)) {
    const cachedUrl = safeGetCache(apiCache, cacheKey, null);
    console.log(`[fetchPlacePhoto] Cache hit for ${placeId}: ${cachedUrl}`);
    onSuccess(cachedUrl || 'https://via.placeholder.com/400x300?text=No+Image');
    return;
  }

  try {
    // Step 1: Fetch photo_reference from Place Details API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo&key=${GOOGLE_API_KEY}`;
    console.log(`[fetchPlacePhoto] Fetching details from: ${detailsUrl}`);
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK' || !detailsData.result?.photos || detailsData.result.photos.length === 0) {
      console.error(`[fetchPlacePhoto] Failed to fetch photo_reference for place ${placeId}:`, detailsData.status, detailsData.error_message || '');
      apiCache.set(cacheKey, 'https://via.placeholder.com/400x300?text=No+Image');
      onSuccess('https://via.placeholder.com/400x300?text=No+Image');
      // Test with a known place_id
      if (placeId === 'ChIJN1t_tDeuEmsRUsoyG83frY4') {
        console.log('[fetchPlacePhoto] Testing with known place_id ChIJN1t_tDeuEmsRUsoyG83frY4');
        await fetchPlacePhoto('ChIJN1t_tDeuEmsRUsoyG83frY4', onSuccess, onError);
      }
      return;
    }

    const photoReference = detailsData.result.photos[0].photo_reference;
    console.log(`[fetchPlacePhoto] Photo reference for ${placeId}: ${photoReference}`);

    // Step 2: Fetch the image URL using the Place Photos API
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
    console.log(`[fetchPlacePhoto] Generated photo URL for ${placeId}: ${photoUrl}`);

    // Validate the URL by attempting a fetch
    const photoResponse = await fetch(photoUrl, { method: 'HEAD' });
    if (!photoResponse.ok) {
      console.error(`[fetchPlacePhoto] Failed to validate photo URL for ${placeId}: ${photoResponse.status} ${photoResponse.statusText}`);
      apiCache.set(cacheKey, 'https://via.placeholder.com/400x300?text=No+Image');
      onSuccess('https://via.placeholder.com/400x300?text=No+Image');
      return;
    }

    apiCache.set(cacheKey, photoUrl);
    onSuccess(photoUrl);
  } catch (error) {
    console.error(`[fetchPlacePhoto] Error fetching photo for place ${placeId}:`, error);
    apiCache.set(cacheKey, 'https://via.placeholder.com/400x300?text=No+Image');
    onError();
  }
};

export const getFallbackSliderItems = (): CafeDetails[] => [
  {
    place_id: '1',
    name: 'Sans Rival Bistro',
    photos: ['https://via.placeholder.com/400x300?text=Sans+Rival+Bistro'],
    lat: 9.3081,
    lon: 123.3078,
    address: 'San Jose St, Dumaguete, 6200 Negros Oriental',
    rating: 4.5,
    amenities: ['Wi-Fi', 'Outdoor Seating'],
  },
  {
    place_id: '2',
    name: 'Gabby’s Bistro',
    photos: ['https://via.placeholder.com/400x300?text=Gabby’s+Bistro'],
    lat: 9.3112,
    lon: 123.3065,
    address: 'Paseo Perdices, Rizal Blvd, Dumaguete, 6200',
    rating: 4.3,
    amenities: ['Wi-Fi', 'Air Conditioning'],
  },
  {
    place_id: '3',
    name: 'Fun Cafe/Bar',
    photos: ['https://via.placeholder.com/400x300?text=Fun+Cafe+Bar'],
    lat: 9.3068,
    lon: 123.3059,
    address: 'Corner Noble Franca St & St Catalina St, Dumaguete, 6200',
    rating: 4.0,
    amenities: ['Wi-Fi', 'Board Games', 'Ping-Pong'],
  },
  {
    place_id: '4',
    name: 'Cafe Mamia',
    photos: ['https://via.placeholder.com/400x300?text=Cafe+Mamia'],
    lat: 9.3105,
    lon: 123.3082,
    address: 'Rizal Blvd, Dumaguete, 6200 Negros Oriental',
    rating: 4.2,
    amenities: ['Wi-Fi', 'Cozy Atmosphere'],
  },
  {
    place_id: '5',
    name: 'Chapters Cafe',
    photos: ['https://via.placeholder.com/400x300?text=Chapters+Cafe'],
    lat: 9.3075,
    lon: 123.3067,
    address: 'Sta. Catalina St, Dumaguete, 6200 Negros Oriental',
    rating: 4.4,
    amenities: ['Wi-Fi', 'Vibrant Decor'],
  },
];


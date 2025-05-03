import { CafeDetails, DUMAGUETE_COORDINATES } from './Body2.script';

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY || 'ad9ccb4d38894adc9f2d8e53a218afae';
const GOOGLE_API_KEY = 'AIzaSyBOQbqvtffeuLeuo4DpS_zBF71ic-R0ocU';
const GEOAPIFY_PLACES_API = 'https://api.geoapify.com/v2/places';
const GEOAPIFY_AUTOCOMPLETE_API = 'https://api.geoapify.com/v1/geocode/autocomplete';
const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place';
const GOOGLE_PHOTO_API = 'https://maps.googleapis.com/maps/api/place/photo';

// Cache responses to avoid unnecessary API calls
const apiCache = new Map<string, any>();

/**
 * Make a cached API request
 */
const cachedFetch = async (url: string): Promise<any> => {
  if (apiCache.has(url)) {
    console.log(`Cache hit for URL: ${url}`); // Debug cache usage
    return apiCache.get(url);
  }
  
  console.log(`Fetching from API: ${url}`); // Debug new fetch
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  apiCache.set(url, data);
  return data;
};

/**
 * Convert Geoapify feature to CafeDetails
 */
const featureToCafeDetails = (feature: any): CafeDetails => {
  const properties = feature.properties;
  
  const addressParts = [
    properties.housenumber,
    properties.street,
    properties.city || 'Dumaguete City'
  ].filter(Boolean);
  
  // Placeholder photos (overridden by Google API in cafeView.tsx)
  const photos = Array(3).fill('/api/placeholder/200/150');
  
  const amenities: string[] = extractAmenities(properties);
  
  const openNow = determineOpenStatus(properties.opening_hours);
  
  const priceLevel = properties.price_level ? 
    properties.price_level.split('$').length - 1 : 
    Math.floor(Math.random() * 3) + 1;
  
  return {
    place_id: properties.place_id || feature.id,
    name: properties.name || 'Unknown Cafe',
    address: properties.formatted || addressParts.join(', '),
    rating: properties.rating || parseFloat((Math.random() * 2 + 3).toFixed(1)),
    photos,
    openNow,
    priceLevel,
    phoneNumber: properties.contact?.phone,
    website: properties.contact?.website,
    amenities,
    lat: properties.lat,
    lon: properties.lon,
    description: properties.description || undefined
  };
};

/**
 * Extract amenities from place properties
 */
const extractAmenities = (properties: any): string[] => {
  const amenities: string[] = [];
  
  if (properties.categories?.includes('catering.cafe')) amenities.push('Coffee');
  if (properties.takeaway === true) amenities.push('Takeaway');
  if (properties.outdoor_seating === true) amenities.push('Outdoor Seating');
  if (properties.internet_access === 'wlan' || properties.internet_access === 'yes') amenities.push('Wi-Fi');
  if (properties.air_conditioning === true) amenities.push('Air Conditioning');
  
  const defaultAmenities = ['Coffee', 'Wi-Fi', 'Outdoor Seating', 'Study-Friendly'];
  if (amenities.length < 2) {
    for (const amenity of defaultAmenities) {
      if (!amenities.includes(amenity) && Math.random() > 0.5) {
        amenities.push(amenity);
      }
      if (amenities.length >= 3) break;
    }
  }
  
  return amenities;
};

/**
 * Determine if a place is currently open based on opening hours
 */
const determineOpenStatus = (openingHours: any): boolean | undefined => {
  if (!openingHours) return undefined;
  
  try {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    const daysMap: { [key: string]: number } = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    
    for (const dayEntry in openingHours) {
      if (daysMap[dayEntry.toLowerCase()] === day) {
        const hours = openingHours[dayEntry];
        
        for (const period of hours) {
          const [openHour, openMinute] = period.open.split(':').map(Number);
          const [closeHour, closeMinute] = period.close.split(':').map(Number);
          
          const currentTimeInMinutes = hour * 60 + minute;
          const openTimeInMinutes = openHour * 60 + openMinute;
          const closeTimeInMinutes = closeHour * 60 + closeMinute;
          
          if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
            return true;
          }
        }
        
        return false;
      }
    }
    
    return undefined;
  } catch {
    return undefined;
  }
};

/**
 * Find Google Place ID by name and address
 */
export const findGooglePlaceId = async (
  name: string,
  address: string,
  callback: (placeId: string | null) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const query = `${name}, ${address}`;
    const url: string = `${GOOGLE_PLACES_API}/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
    
    const data = await cachedFetch(url);
    
    if (data?.candidates?.length > 0) {
      console.log(`Found Google Place ID for ${name} at ${address}: ${data.candidates[0].place_id}`); // Detailed log
      callback(data.candidates[0].place_id);
    } else {
      console.warn(`No Google Place ID found for ${name} at ${address}, response:`, data); // Detailed log
      callback(null);
    }
  } catch (error) {
    console.error(`Error in findGooglePlaceId for ${name} at ${address}:`, error); // Detailed log
    errorCallback(`Error finding Google Place ID: ${error}`);
  }
};

/**
 * Fetch Google Place Details (photos, reviews, and editorial summary)
 */
export const fetchGooglePlaceDetails = async (
  googlePlaceId: string,
  callback: (details: { photos?: string[], reviews?: Array<{ author_name: string, rating: number, text: string }>, editorial_summary?: { overview: string } }) => void,
  errorCallback: (error: string) => void
) => {
  const url: string = `${GOOGLE_PLACES_API}/details/json?place_id=${encodeURIComponent(googlePlaceId)}&fields=photos,reviews,editorial_summary&max_review_count=5&key=${GOOGLE_API_KEY}`;
  
  console.log(`Fetching Google Place Details for placeId: ${googlePlaceId}`); // Debug log
  
  try {
    if (!googlePlaceId || !googlePlaceId.startsWith('ChIJ')) {
      throw new Error('Invalid Google Place ID');
    }
    
    const data = await cachedFetch(url);
    
    console.log(`Google Place Details Raw Response for ${googlePlaceId}:`, data); // Log raw response
    
    if (data?.status !== 'OK') {
      console.error('Google Places API error:', {
        placeId: googlePlaceId,
        status: data.status,
        error_message: data.error_message || 'Unknown API error',
        response: data,
      });
      apiCache.delete(url); // Invalidate cache on error
      errorCallback(`Google Places API error: ${data.error_message || 'Unknown error'}`);
      return;
    }
    
    if (data?.result) {
      const photos = data.result.photos?.slice(0, 2).map((photo: any) => 
        `${GOOGLE_PHOTO_API}?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
      ) || [];
      
      const reviews = data.result.reviews?.slice(0, 5).map((review: any) => ({
        author_name: review.author_name || 'Anonymous',
        rating: review.rating || 0,
        text: review.text || ''
      })) || [];
      
      const editorial_summary = data.result.editorial_summary
        ? { overview: data.result.editorial_summary.overview }
        : undefined;
      
      console.log('Google Place Details Processed:', { placeId: googlePlaceId, photos, reviews, editorial_summary }); // Log processed data
      callback({ photos, reviews, editorial_summary });
    } else {
      console.warn('No result in Google Places API response:', { placeId: googlePlaceId, response: data });
      apiCache.delete(url); // Invalidate cache on empty result
      callback({});
    }
  } catch (error) {
    console.error('Error fetching Google Place details:', { placeId: googlePlaceId, error });
    apiCache.delete(url); // Invalidate cache on error
    errorCallback(`Error fetching Google Place details: ${error}`);
  }
};

/**
 * Fetch top cafes in Dumaguete using Geoapify
 */
export const fetchTopCafes = async (
  callback: (cafes: CafeDetails[]) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const queryUrl = `${GEOAPIFY_PLACES_API}?categories=catering.cafe,commercial.food_and_drink&filter=circle:${DUMAGUETE_COORDINATES.lng},${DUMAGUETE_COORDINATES.lat},5000&bias=proximity:${DUMAGUETE_COORDINATES.lng},${DUMAGUETE_COORDINATES.lat}&limit=5&apiKey=${GEOAPIFY_API_KEY}`;
    
    const data = await cachedFetch(queryUrl);
    
    if (data?.features?.length > 0) {
      const cafes: CafeDetails[] = data.features
        .slice(0, 5)
        .map((feature: any) => featureToCafeDetails(feature));
      callback(cafes);
    } else {
      errorCallback('No cafes found');
    }
  } catch (error) {
    errorCallback(`Error fetching top cafes: ${error}`);
  }
};

/**
 * Fetch detailed cafe information by place ID
 */
export const fetchCafeDetails = async (
  placeId: string,
  callback: (cafeDetails: CafeDetails) => void,
  errorCallback: (error: string) => void
) => {
  if (!placeId) {
    errorCallback('Invalid place ID');
    return;
  }

  try {
    const detailsUrl = `${GEOAPIFY_PLACES_API}?categories=catering.cafe,commercial.food_and_drink&filter=place:${placeId}&apiKey=${GEOAPIFY_API_KEY}`;
    
    const data = await cachedFetch(detailsUrl);
    
    if (data?.features?.length > 0) {
      const cafeDetails = featureToCafeDetails(data.features[0]);
      callback(cafeDetails);
    } else {
      errorCallback('Place not found');
    }
  } catch (error) {
    errorCallback(`Error fetching cafe details: ${error}`);
  }
};

/**
 * Search for cafes by text query
 */
export const searchCafesByText = async (
  query: string,
  callback: (results: Array<{ name: string, place_id: string }>) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const searchUrl = `${GEOAPIFY_PLACES_API}?categories=catering.cafe,commercial.food_and_drink&filter=circle:${DUMAGUETE_COORDINATES.lng},${DUMAGUETE_COORDINATES.lat},5000&bias=proximity:${DUMAGUETE_COORDINATES.lng},${DUMAGUETE_COORDINATES.lat}&name=${encodeURIComponent(query)}&limit=5&apiKey=${GEOAPIFY_API_KEY}`;
    
    const data = await cachedFetch(searchUrl);
    
    if (data?.features?.length > 0) {
      const searchResults = data.features.map((feature: any) => ({
        name: feature.properties.name || 'Unknown Cafe',
        place_id: feature.properties.place_id || feature.id
      }));
      callback(searchResults);
    } else {
      callback([]);
    }
  } catch (error) {
    errorCallback(`Error searching cafes: ${error}`);
  }
};

/**
 * Fetch place suggestions using Geoapify Autocomplete
 */
export const fetchPlaceSuggestions = async (
  query: string,
  callback: (results: Array<{ name: string, place_id: string, lat: number, lon: number }>) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const searchUrl = `${GEOAPIFY_AUTOCOMPLETE_API}?text=${encodeURIComponent(query)}&type=amenity&filter=circle:${DUMAGUETE_COORDINATES.lng},${DUMAGUETE_COORDINATES.lat},5000&limit=5&apiKey=${GEOAPIFY_API_KEY}`;
    
    const data = await cachedFetch(searchUrl);
    
    if (data?.features?.length > 0) {
      const suggestions = data.features.map((feature: any) => ({
        name: feature.properties.name || feature.properties.formatted || 'Unknown Place',
        place_id: feature.properties.place_id || feature.id,
        lat: feature.properties.lat,
        lon: feature.properties.lon
      }));
      callback(suggestions);
    } else {
      callback([]);
    }
  } catch (error) {
    errorCallback(`Error fetching suggestions: ${error}`);
  }
};

/**
 * Fetch cafes near a location
 */
export const fetchCafesNearLocation = async (
  lat: number,
  lon: number,
  callback: (cafes: CafeDetails[]) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const queryUrl = `${GEOAPIFY_PLACES_API}?categories=catering.cafe,commercial.food_and_drink&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=300&apiKey=${GEOAPIFY_API_KEY}`;
    
    const data = await cachedFetch(queryUrl);
    
    if (data?.features?.length > 0) {
      const cafes: CafeDetails[] = data.features.map((feature: any) => featureToCafeDetails(feature));
      callback(cafes);
    } else {
      errorCallback('No cafes found');
    }
  } catch (error) {
    errorCallback(`Error fetching cafes: ${error}`);
  }
};
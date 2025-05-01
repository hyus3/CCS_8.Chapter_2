import { CafeDetails, DUMAGUETE_COORDINATES } from './Body2.script';

const GEOAPIFY_API_KEY = 'ad9ccb4d38894adc9f2d8e53a218afae';
const GEOAPIFY_PLACES_API = 'https://api.geoapify.com/v2/places';

// Cache responses to avoid unnecessary API calls
const apiCache = new Map<string, any>();

/**
 * Make a cached API request
 */
const cachedFetch = async (url: string): Promise<any> => {
  // Check if result is in cache
  if (apiCache.has(url)) {
    return apiCache.get(url);
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache the result
  apiCache.set(url, data);
  
  return data;
};

/**
 * Convert Geoapify feature to CafeDetails
 */
const featureToCafeDetails = (feature: any): CafeDetails => {
  const properties = feature.properties;
  
  // Extract address components
  const addressParts = [
    properties.housenumber,
    properties.street,
    properties.city || 'Dumaguete City'
  ].filter(Boolean);
  
  // Generate photos - in a real app, you could use actual photo URLs from the API
  // or integrate with a photo service
  const photos = Array(3).fill('/api/placeholder/200/150');
  
  // Extract amenities
  const amenities: string[] = extractAmenities(properties);
  
  // Determine if the place is open now
  const openNow = determineOpenStatus(properties.opening_hours);
  
  // Convert price level from $ notation to number (1-3)
  const priceLevel = properties.price_level ? 
    properties.price_level.split('$').length - 1 : 
    Math.floor(Math.random() * 3) + 1;
  
  return {
    place_id: properties.place_id || feature.id,
    name: properties.name || 'Unknown Cafe',
    address: properties.formatted || addressParts.join(', '),
    rating: properties.rating || parseFloat((Math.random() * 2 + 3).toFixed(1)), // Generate rating between 3.0-5.0
    photos: photos,
    openNow: openNow,
    priceLevel: priceLevel,
    phoneNumber: properties.contact?.phone,
    website: properties.contact?.website,
    amenities: amenities
  };
};

/**
 * Extract amenities from place properties
 */
const extractAmenities = (properties: any): string[] => {
  const amenities: string[] = [];
  
  // Check for common amenities based on property values
  if (properties.categories?.includes('catering.cafe')) amenities.push('Coffee');
  if (properties.takeaway === true) amenities.push('Takeaway');
  if (properties.outdoor_seating === true) amenities.push('Outdoor Seating');
  if (properties.internet_access === 'wlan' || properties.internet_access === 'yes') amenities.push('Wi-Fi');
  if (properties.air_conditioning === true) amenities.push('Air Conditioning');
  
  // Add common cafe amenities if not enough were found
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
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    const daysMap: {[key: string]: number} = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    
    // Check if there's an entry for today
    for (const dayEntry in openingHours) {
      if (daysMap[dayEntry.toLowerCase()] === day) {
        const hours = openingHours[dayEntry];
        
        // Check if the current time falls within any of the open periods
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
        
        return false; // Not within any open period today
      }
    }
    
    return undefined; // No information for today
  } catch (error) {
    return undefined; // Error parsing opening hours
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
    
    if (data && data.features && data.features.length > 0) {
      // Convert features to cafe details
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
  try {
    // For Geoapify, we can use the details endpoint
    const detailsUrl = `${GEOAPIFY_PLACES_API}?id=${placeId}&apiKey=${GEOAPIFY_API_KEY}`;
    
    const data = await cachedFetch(detailsUrl);
    
    if (data && data.features && data.features.length > 0) {
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
    // Add text search parameter to the query
    const searchUrl = `${GEOAPIFY_PLACES_API}?categories=catering.cafe,commercial.food_and_drink&filter=circle:${DUMAGUETE_COORDINATES.lng},${DUMAGUETE_COORDINATES.lat},5000&bias=proximity:${DUMAGUETE_COORDINATES.lng},${DUMAGUETE_COORDINATES.lat}&name=${encodeURIComponent(query)}&limit=5&apiKey=${GEOAPIFY_API_KEY}`;
    
    const data = await cachedFetch(searchUrl);
    
    if (data && data.features && data.features.length > 0) {
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
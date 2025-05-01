import { CafeDetails, DUMAGUETE_COORDINATES } from './Body2.script';

// Nominatim API for OpenStreetMap geocoding
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

// Cache responses to avoid unnecessary API calls
const apiCache = new Map<string, any>();

/**
 * Make a cached API request with appropriate delay for Nominatim's rate limits
 */
const cachedFetch = async (url: string): Promise<any> => {
  if (apiCache.has(url)) return apiCache.get(url);
  
  // Add delay to avoid hitting rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'DumagueteCafeCompass/1.0',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  
  const data = await response.json();
  apiCache.set(url, data);
  return data;
};

/**
 * Extract amenities from OSM tags
 */
const extractAmenities = (tags: any): string[] => {
  const amenities: string[] = [];
  
  if (tags) {
    if (tags.cuisine === 'coffee_shop') amenities.push('Coffee');
    if (tags.takeaway === 'yes') amenities.push('Takeaway');
    if (tags.cuisine?.includes('breakfast')) amenities.push('Breakfast');
    if (tags.internet_access === 'wlan' || tags.internet_access === 'yes') amenities.push('Wi-Fi');
    if (tags.outdoor_seating === 'yes') amenities.push('Outdoor Seating');
    if (tags['socket:power'] === 'yes') amenities.push('Power Outlets');
    if (tags.air_conditioning === 'yes') amenities.push('Air Conditioning');
    if (tags.study === 'yes') amenities.push('Study-Friendly');
    if (tags.dog === 'yes' || tags.pet === 'yes') amenities.push('Pet-Friendly');
  }
  
  // Add common amenities if not enough were found
  const defaultAmenities = ['Coffee', 'Wi-Fi', 'Outdoor Seating', 'Study-Friendly'];
  if (amenities.length < 2) {
    for (const amenity of defaultAmenities) {
      if (!amenities.includes(amenity) && Math.random() > 0.5) {
        amenities.push(amenity);
        if (amenities.length >= 3) break;
      }
    }
  }
  
  return amenities;
};

/**
 * Convert an OSM node to a cafe details object
 */
const osmNodeToCafeDetails = async (node: any): Promise<CafeDetails> => {
  // Get photo placeholders
  const photos = Array(3).fill('/api/placeholder/200/150');
  
  // Extract opening hours
  let openNow: boolean | undefined = undefined;
  if (node.tags?.opening_hours) {
    try {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hour = now.getHours();
      const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      const today = days[dayOfWeek];
      
      if (node.tags.opening_hours.includes(today) && node.tags.opening_hours.includes(':')) {
        const hoursPart = node.tags.opening_hours.split(' ')[1];
        const [open, close] = hoursPart.split('-').map((t: string) => parseInt(t.split(':')[0]));
        openNow = hour >= open && hour < close;
      }
    } catch {
      // If parsing fails, leave as undefined
    }
  }
  
  // Create cafe details
  return {
    place_id: node.osm_id.toString(),
    name: node.tags?.name || 'Unknown Cafe',
    address: [
      node.tags?.['addr:housenumber'],
      node.tags?.['addr:street'],
      node.address?.road,
      node.address?.city || 'Dumaguete City'
    ].filter(Boolean).join(', '),
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
    photos: photos,
    openNow: openNow,
    phoneNumber: node.tags?.phone,
    website: node.tags?.website || node.tags?.contact_website,
    amenities: extractAmenities(node.tags),
    priceLevel: node.tags?.price_level ? parseInt(node.tags.price_level) : 
                (Math.floor(Math.random() * 3) + 1)
  };
};

/**
 * Fetch top cafes in Dumaguete using OpenStreetMap
 */
export const fetchTopCafesOSM = async (
  callback: (cafes: CafeDetails[]) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const queryUrl = `${NOMINATIM_API}/search?q=cafe+in+dumaguete&format=json&limit=5&addressdetails=1&category=amenity:cafe&bounded=1&viewbox=${DUMAGUETE_COORDINATES.lng - 0.05},${DUMAGUETE_COORDINATES.lat - 0.05},${DUMAGUETE_COORDINATES.lng + 0.05},${DUMAGUETE_COORDINATES.lat + 0.05}`;
    
    const results = await cachedFetch(queryUrl);
    
    if (results && results.length > 0) {
      const cafes: CafeDetails[] = await Promise.all(
        results.slice(0, 5).map((result: any) => osmNodeToCafeDetails(result))
      );
      
      callback(cafes);
    } else {
      errorCallback('No cafes found');
    }
  } catch (error) {
    errorCallback(`Error fetching top cafes: ${error}`);
  }
};

/**
 * Fetch detailed cafe information by OSM ID
 */
export const fetchCafeDetailsOSM = async (
  placeId: string,
  callback: (cafeDetails: CafeDetails) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const detailsUrl = `${NOMINATIM_API}/lookup?osm_ids=N${placeId}&format=json&addressdetails=1&extratags=1`;
    
    const results = await cachedFetch(detailsUrl);
    
    if (results && results.length > 0) {
      const cafeDetails = await osmNodeToCafeDetails(results[0]);
      callback(cafeDetails);
    } else {
      errorCallback('Place not found');
    }
  } catch (error) {
    errorCallback(`Error fetching cafe details: ${error}`);
  }
};

/**
 * Search for cafes and return full details of first result
 */
export const searchCafeByTextAndGetDetails = async (
  query: string,
  callback: (cafeDetails: CafeDetails) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const searchUrl = `${NOMINATIM_API}/search?q=${encodeURIComponent(query)}+cafe+dumaguete&format=json&limit=5&bounded=1&viewbox=${DUMAGUETE_COORDINATES.lng - 0.05},${DUMAGUETE_COORDINATES.lat - 0.05},${DUMAGUETE_COORDINATES.lng + 0.05},${DUMAGUETE_COORDINATES.lat + 0.05}`;
    
    const results = await cachedFetch(searchUrl);
    
    if (results && results.length > 0) {
      fetchCafeDetailsOSM(
        results[0].osm_id.toString(),
        callback,
        errorCallback
      );
    } else {
      errorCallback('No results found');
    }
  } catch (error) {
    errorCallback(`Error searching cafes: ${error}`);
  }
};
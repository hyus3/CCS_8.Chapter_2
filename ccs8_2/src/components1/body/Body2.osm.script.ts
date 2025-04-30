import { CafeDetails, DUMAGUETE_COORDINATES } from './Body2.script';

// Nominatim API for OpenStreetMap geocoding
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

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
  
  // Add delay to avoid hitting rate limits (Nominatim requires 1 request per second)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Make the request with appropriate headers
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'DumagueteCafeCompass/1.0', // Important! Nominatim requires a user agent
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache the result
  apiCache.set(url, data);
  
  return data;
};

/**
 * Get photo URLs from Mapillary (a service that provides street-level imagery)
 * or use placeholder images if not available
 */
const getPhotoUrls = async (lat: number, lon: number, count: number = 3): Promise<string[]> => {
  // For simplicity, we're just returning placeholder images
  // In a real implementation, you could integrate with Flickr or Mapillary APIs
  return Array(count).fill('/api/placeholder/200/150');
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
  
  // Add a few common amenities if not enough were found
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
 * Convert an OSM node to a cafe details object
 */
const osmNodeToCafeDetails = async (node: any): Promise<CafeDetails> => {
  // Get photo URLs
  const photos = await getPhotoUrls(node.lat, node.lon);
  
  // Extract opening hours
  let openNow: boolean | undefined = undefined;
  if (node.tags?.opening_hours) {
    // Simple opening hours parser - just for demo
    // In a real app, you would use a library like opening_hours.js
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = days[dayOfWeek];
    
    // Very simplified check for "Mo-Fr 08:00-20:00" format
    try {
      if (node.tags.opening_hours.includes(today) && 
          node.tags.opening_hours.includes(':')) {
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
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Generate a rating between 3.0 and 5.0
    photos: photos,
    openNow: openNow,
    phoneNumber: node.tags?.phone,
    website: node.tags?.website || node.tags?.contact_website,
    amenities: extractAmenities(node.tags),
    priceLevel: node.tags?.price_level ? parseInt(node.tags.price_level) : 
                (Math.floor(Math.random() * 3) + 1) // Generate a price level between 1 and 3
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
    // Query for cafes in Dumaguete
    const queryUrl = `${NOMINATIM_API}/search?q=cafe+in+dumaguete&format=json&limit=5&addressdetails=1&category=amenity:cafe&bounded=1&viewbox=${DUMAGUETE_COORDINATES.lng - 0.05},${DUMAGUETE_COORDINATES.lat - 0.05},${DUMAGUETE_COORDINATES.lng + 0.05},${DUMAGUETE_COORDINATES.lat + 0.05}`;
    
    const results = await cachedFetch(queryUrl);
    
    if (results && results.length > 0) {
      // Process only up to 5 results
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
    // Get details for a specific place
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
 * Search for cafes by text query
 */
export const searchCafesByTextOSM = async (
  query: string,
  callback: (results: Array<{ name: string, place_id: string }>) => void,
  errorCallback: (error: string) => void
) => {
  try {
    // Search for cafes by name
    const searchUrl = `${NOMINATIM_API}/search?q=${encodeURIComponent(query)}+cafe+dumaguete&format=json&limit=5&bounded=1&viewbox=${DUMAGUETE_COORDINATES.lng - 0.05},${DUMAGUETE_COORDINATES.lat - 0.05},${DUMAGUETE_COORDINATES.lng + 0.05},${DUMAGUETE_COORDINATES.lat + 0.05}`;
    
    const results = await cachedFetch(searchUrl);
    
    if (results && results.length > 0) {
      const searchResults = results.map((result: any) => ({
        name: result.display_name.split(',')[0] || result.name || 'Unknown Cafe',
        place_id: result.osm_id.toString()
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
 * Search for cafes and return full details of first result
 */
export const searchCafeByTextAndGetDetails = async (
  query: string,
  callback: (cafeDetails: CafeDetails) => void,
  errorCallback: (error: string) => void
) => {
  searchCafesByTextOSM(
    query,
    (results) => {
      if (results.length > 0) {
        fetchCafeDetailsOSM(
          results[0].place_id,
          callback,
          errorCallback
        );
      } else {
        errorCallback('No results found');
      }
    },
    errorCallback
  );
};
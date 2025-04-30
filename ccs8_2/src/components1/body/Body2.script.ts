import debounce from 'lodash/debounce';

// Interface for cafe details
export interface CafeDetails {
  place_id: string;
  name: string;
  address: string;
  rating: number;
  photos: string[];
  openNow?: boolean;
  priceLevel?: number;
  phoneNumber?: string;
  website?: string;
  amenities: string[];
}

// Dumaguete City coordinates
export const DUMAGUETE_COORDINATES = {
  lat: 9.3076,
  lng: 123.3080
};

// Dumaguete boundaries for restricting search
export const DUMAGUETE_BOUNDS = {
  southwest: { lat: 9.2576, lng: 123.2580 },
  northeast: { lat: 9.3576, lng: 123.3580 }
};

/**
 * Options for Place Autocomplete
 */
export const getAutocompleteOptions = () => {
  return {
    types: ['establishment'],
    componentRestrictions: { country: 'ph' },
    strictBounds: true,
    bounds: new google.maps.LatLngBounds(
      new google.maps.LatLng(DUMAGUETE_BOUNDS.southwest.lat, DUMAGUETE_BOUNDS.southwest.lng),
      new google.maps.LatLng(DUMAGUETE_BOUNDS.northeast.lat, DUMAGUETE_BOUNDS.northeast.lng)
    ),
    fields: ['place_id', 'name', 'types', 'geometry']
  };
};

/**
 * Get places service instance
 */
export const getPlacesService = (): google.maps.places.PlacesService => {
  // Create a div to host the PlacesService
  const serviceDiv = document.createElement('div');
  return new google.maps.places.PlacesService(serviceDiv);
};

/**
 * Fetch top cafes in Dumaguete
 */
export const fetchTopCafes = (
  callback: (cafes: CafeDetails[]) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const placesService = getPlacesService();
    
    // Define the request for nearby search
    const request = {
      location: DUMAGUETE_COORDINATES,
      radius: 3000,  // 3km radius
      type: 'cafe',
      rankBy: google.maps.places.RankBy.PROMINENCE
    };
    
    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Take the top 5 cafes
        const topCafes = results.slice(0, 5).map(place => {
          // Create placeholder photos array since we'll need to fetch actual photos
          const photos = place.photos ? 
            [place.photos[0].getUrl({ maxWidth: 200, maxHeight: 150 })] : 
            ['/api/placeholder/200/150'];
          
          return {
            place_id: place.place_id || '',
            name: place.name || 'Unknown Cafe',
            address: place.vicinity || '',
            rating: place.rating || 0,
            photos: photos,
            openNow: place.opening_hours?.isOpen() || false,
            amenities: []
          };
        });
        
        callback(topCafes);
      } else {
        errorCallback(`Places API request failed: ${status}`);
      }
    });
  } catch (error) {
    errorCallback(`Error fetching top cafes: ${error}`);
  }
};

/**
 * Fetch detailed cafe information by place_id
 */
export const fetchCafeDetails = (
  placeId: string,
  callback: (cafeDetails: CafeDetails) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const placesService = getPlacesService();
    
    const request = {
      placeId: placeId,
      fields: [
        'name', 
        'formatted_address', 
        'rating', 
        'photos', 
        'opening_hours', 
        'price_level', 
        'formatted_phone_number', 
        'website', 
        'types'
      ]
    };
    
    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        // Extract amenities from place types
        const amenities: string[] = extractAmenities(place);
        
        const cafeDetails: CafeDetails = {
          place_id: placeId,
          name: place.name || 'Unknown Cafe',
          address: place.formatted_address || '',
          rating: place.rating || 0,
          photos: place.photos ? 
            place.photos.slice(0, 3).map(photo => photo.getUrl({ maxWidth: 500, maxHeight: 300 })) : 
            ['/api/placeholder/500/300'],
          openNow: place.opening_hours?.isOpen() || false,
          priceLevel: place.price_level,
          phoneNumber: place.formatted_phone_number,
          website: place.website,
          amenities: amenities
        };
        
        callback(cafeDetails);
      } else {
        errorCallback(`Place details request failed: ${status}`);
      }
    });
  } catch (error) {
    errorCallback(`Error fetching cafe details: ${error}`);
  }
};

/**
 * Extract amenities from place types and add common cafe amenities
 */
const extractAmenities = (place: google.maps.places.PlaceResult): string[] => {
  const amenities: string[] = [];
  
  // Extract from place types
  if (place.types) {
    if (place.types.includes('meal_takeaway')) amenities.push('Takeaway');
    if (place.types.includes('restaurant')) amenities.push('Food');
    if (place.types.includes('cafe')) amenities.push('Coffee');
  }
  
  // For demonstration purposes, add some common cafe amenities randomly
  // In a real app, these would come from the API or user-contributed data
  const commonAmenities = [
    { name: 'Wi-Fi', probability: 0.7 },
    { name: 'Outdoor Seating', probability: 0.5 },
    { name: 'Power Outlets', probability: 0.6 },
    { name: 'Air Conditioning', probability: 0.8 },
    { name: 'Breakfast', probability: 0.4 },
    { name: 'Study-Friendly', probability: 0.3 },
    { name: 'Pet-Friendly', probability: 0.2 }
  ];
  
  commonAmenities.forEach(item => {
    if (Math.random() < item.probability) {
      amenities.push(item.name);
    }
  });
  
  return amenities;
};

/**
 * Search for cafes by text query
 */
export const searchCafesByText = (
  query: string,
  callback: (placeId: string) => void,
  errorCallback: (error: string) => void
) => {
  try {
    const placesService = getPlacesService();
    
    const request = {
      query: `${query} cafe Dumaguete`,
      fields: ['name', 'place_id']
    };
    
    placesService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const firstResult = results[0];
        if (firstResult.place_id) {
          callback(firstResult.place_id);
        } else {
          errorCallback('No place ID found for search result');
        }
      } else {
        errorCallback(`Text search request failed: ${status}`);
      }
    });
  } catch (error) {
    errorCallback(`Error searching cafes: ${error}`);
  }
};

/**
 * Create a debounced search function to avoid API spam
 */
export const debouncedSearch = debounce((
  query: string,
  callback: (placeId: string) => void,
  errorCallback: (error: string) => void
) => {
  searchCafesByText(query, callback, errorCallback);
}, 500); // 500ms delay

/**
 * Generate fallback slider items when API fails
 */
export const getFallbackSliderItems = (): CafeDetails[] => {
  return [
    { 
      place_id: '1', 
      name: 'Hemingway Cafe', 
      address: 'Dumaguete City', 
      rating: 4.5, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Wi-Fi', 'Outdoor Seating'] 
    },
    { 
      place_id: '2', 
      name: 'Kava Modern Filipino', 
      address: 'Dumaguete City', 
      rating: 4.2, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Wi-Fi'] 
    },
    { 
      place_id: '3', 
      name: 'Mulat Cafe', 
      address: 'Dumaguete City', 
      rating: 4.7, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Outdoor Seating'] 
    },
    { 
      place_id: '4', 
      name: 'Tuesday Cafe', 
      address: 'Dumaguete City', 
      rating: 4.0, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Wi-Fi', 'Power Outlets'] 
    },
    { 
      place_id: '5', 
      name: 'Overdose Coffee', 
      address: 'Dumaguete City', 
      rating: 4.3, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Breakfast'] 
    }
  ];
};
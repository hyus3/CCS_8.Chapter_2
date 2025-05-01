// src/components1/body/Body2.script.ts
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
  lat?: number; // Added for navigation
  lon?: number; // Added for navigation
  description?: string; // Added for cafeView.tsx
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
 * Extract amenities from place types and add common cafe amenities
 */
const extractAmenities = (place: google.maps.places.PlaceResult): string[] => {
  const amenities: string[] = [];
  
  if (place.types) {
    if (place.types.includes('meal_takeaway')) amenities.push('Takeaway');
    if (place.types.includes('restaurant')) amenities.push('Food');
    if (place.types.includes('cafe')) amenities.push('Coffee');
  }
  
  const commonAmenities = [
    { name: 'Wi-Fi', probability: 0.7 },
    { name: 'Outdoor Seating', probability: 0.5 },
    { name: 'Power Outlets', probability: 0.6 },
    { name: 'Air Conditioning', probability: 0.8 },
    { name: 'Breakfast', probability: 0.4 },
    { name: 'Study-Friendly', probability: 0.3 }
  ];
  
  if (amenities.length < 3) {
    commonAmenities.forEach(item => {
      if (Math.random() < item.probability && !amenities.includes(item.name)) {
        amenities.push(item.name);
      }
    });
  }
  
  return amenities;
};

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
      amenities: ['Wi-Fi', 'Outdoor Seating'],
      lat: 9.3076,
      lon: 123.3080
    },
    { 
      place_id: '2', 
      name: 'Kava Modern Filipino', 
      address: 'Dumaguete City', 
      rating: 4.2, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Wi-Fi'],
      lat: 9.3076,
      lon: 123.3080
    },
    { 
      place_id: '3', 
      name: 'Mulat Cafe', 
      address: 'Dumaguete City', 
      rating: 4.7, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Outdoor Seating'],
      lat: 9.3076,
      lon: 123.3080
    },
    { 
      place_id: '4', 
      name: 'Tuesday Cafe', 
      address: 'Dumaguete City', 
      rating: 4.0, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Wi-Fi', 'Power Outlets'],
      lat: 9.3076,
      lon: 123.3080
    },
    { 
      place_id: '5', 
      name: 'Overdose Coffee', 
      address: 'Dumaguete City', 
      rating: 4.3, 
      photos: ['/api/placeholder/200/150'], 
      amenities: ['Breakfast'],
      lat: 9.3076,
      lon: 123.3080
    }
  ];
};
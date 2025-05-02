// src/services/GooglePlacesService.ts
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

export const fetchPlaceSuggestions = (
  query: string,
  onSuccess: (results: PlaceSuggestion[]) => void,
  onError: () => void
) => {
  if (!window.google?.maps?.places) {
    console.error('Google Maps API not loaded. Ensure the script is included and the API key is valid.');
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
        console.error(`Autocomplete failed: ${status}`);
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
    console.error('Google Maps API not loaded. Ensure the script is included and the API key is valid.');
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
        console.error(`NearbySearch failed: ${status}`);
        onError();
        return;
      }

      const cafes: CafeDetails[] = results.slice(0, 5).map((place) => ({
        place_id: place.place_id || '',
        name: place.name || '',
        photos: place.photos
          ? place.photos.slice(0, 3).map((photo) => photo.getUrl({ maxWidth: 400 }))
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
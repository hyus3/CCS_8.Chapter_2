import { v4 as uuidv4 } from 'uuid';

// Interfaces and Types
export interface CafeDetails {
    place_id: string;
    name: string;
    address: string;
    rating: number;
    photos: string[];
    amenities: string[];
    lat: number;
    lng: number;
}

interface CacheEntry {
    data: google.maps.places.PlaceResult;
    timestamp: number;
}

// Custom Error Types
class PlacesServiceError extends Error {
    constructor(message: string, public readonly status?: string) {
        super(message);
        this.name = 'PlacesServiceError';
    }
}

class NetworkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NetworkError';
    }
}

// Configuration
const CONFIG = {
    API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    DUMAGUETE_CENTER: { lat: 9.3076, lng: 123.3080 },
    DEFAULT_RADIUS: 5000,
    DEFAULT_MAX_RESULTS: 30,
    PLACEHOLDER_IMAGE: 'https://via.placeholder.com/400x300?text=No+Image',
    RETRY_ATTEMPTS: 3,
    RETRY_BASE_DELAY: 500,
    CACHE_TTL: 24 * 60 * 60 * 1000,
    BATCH_SIZE: 5,
    RATE_LIMIT_DELAY: 100,
} as const;

// Cache
const placeDetailsCache = new Map<string, CacheEntry>();

// Tag Mappings
// Tag Mappings
const TAG_MAPPINGS: { [key: string]: readonly string[] } = {
    Coffee: ['coffee', 'espresso', 'latte'],
    Brunch: ['brunch', 'breakfast', 'lunch'],
    Pastries: ['bakery', 'pastry', 'dessert'],
    'Study Spot': ['quiet', 'wifi', 'study'],
    'Date Spot': ['romantic', 'cozy', 'intimate'],
    'Work-Friendly': ['wifi', 'outlets', 'workspace'],
} as const;

// Utility Functions
const delay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

const validateInputs = (
    tags: string[],
    map: google.maps.Map,
    radius: number,
    maxResults: number
): void => {
    if (!Array.isArray(tags)) {
        throw new PlacesServiceError('Tags must be an array');
    }
    if (!map) {
        throw new PlacesServiceError('Map instance is required');
    }
    if (radius <= 0 || radius > 50000) {
        throw new PlacesServiceError('Radius must be between 0 and 50,000 meters');
    }
    if (maxResults <= 0 || maxResults > 60) {
        throw new PlacesServiceError('Max results must be between 0 and 60');
    }
};

/**
 * Checks if a place matches the provided tags
 * @param place Google Places API PlaceResult
 * @param tags Array of tags to match
 * @returns True if the place matches any tag
 */
const matchesTags = (
    place: google.maps.places.PlaceResult,
    tags: string[]
): boolean => {
    if (!tags.length) return true;

    const placeTypes = place.types ?? [];
    const placeName = place.name?.toLowerCase() ?? '';

    return tags.some(tag => {
        const tagKeywords = TAG_MAPPINGS[tag] ?? [tag.toLowerCase()];
        return tagKeywords.some(keyword =>
            placeTypes.includes(keyword) ||
            placeName.includes(keyword) ||
            (tag === 'Date Spot' && (place.rating ?? 0) >= 4)
        );
    });
};

/**
 * Infers amenities based on place characteristics
 * @param place Google Places API PlaceResult
 * @param tags Array of tags
 * @returns Array of inferred amenities
 */
const inferAmenities = (
    place: google.maps.places.PlaceResult,
    tags: string[]
): string[] => {
    const amenities = new Set<string>();
    const types = place.types ?? [];

    if (types.includes('cafe')) amenities.add('Coffee');
    if (types.includes('cafe') || types.includes('coffee_shop') ||
        tags.includes('Study Spot') || tags.includes('Work-Friendly') ||
        (place.rating ?? 0) >= 4) {
        amenities.add('Wi-Fi');
    }
    if (types.includes('bakery') || types.includes('cafe') ||
        types.includes('food')) {
        amenities.add('Pastries');
    }
    if (types.includes('breakfast') || types.includes('restaurant') ||
        types.includes('food')) {
        amenities.add('Brunch');
    }
    if ((place.rating ?? 0) >= 4) amenities.add('Cozy');

    return Array.from(amenities);
};

/**
 * Fetches photo URL with retry logic
 * @param photo Google Places Photo object
 * @param maxWidth Maximum width for the photo
 * @param attempt Current retry attempt
 * @returns Photo URL or placeholder
 */
const fetchPhotoWithRetry = async (
    photo: google.maps.places.PlacePhoto,
    maxWidth: number,
    attempt: number = 1
): Promise<string> => {
    try {
        return photo.getUrl({ maxWidth });
    } catch (error) {
        console.warn(`Photo fetch attempt ${attempt} failed:`, error);
        if (attempt >= CONFIG.RETRY_ATTEMPTS) {
            return CONFIG.PLACEHOLDER_IMAGE;
        }
        await delay(CONFIG.RETRY_BASE_DELAY * Math.pow(2, attempt - 1));
        return fetchPhotoWithRetry(photo, maxWidth, attempt + 1);
    }
};

/**
 * Fetches detailed place information
 * @param placeId Google Place ID
 * @param service Google PlacesService instance
 * @returns Place details
 */
const fetchPlaceDetails = async (
    placeId: string,
    service: google.maps.places.PlacesService
): Promise<google.maps.places.PlaceResult> => {
    if (!placeId) {
        throw new PlacesServiceError('Invalid placeId provided');
    }

    const cached = placeDetailsCache.get(placeId);
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_TTL) {
        return cached.data;
    }

    const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: ['name', 'formatted_address', 'photos', 'types', 'rating', 'geometry'],
    };

    try {
        const result = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
            service.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    resolve(place);
                } else {
                    reject(new PlacesServiceError(`Failed to fetch place details: ${status}`, status));
                }
            });
        });

        placeDetailsCache.set(placeId, { data: result, timestamp: Date.now() });
        return result;
    } catch (error) {
        throw error instanceof PlacesServiceError
            ? error
            : new NetworkError('Network error fetching place details');
    }
};

/**
 * Fetches cafes using PlacesService Text Search with tag filtering
 * @param tags Array of tags to filter cafes
 * @param map Google Maps instance
 * @param radius Search radius in meters
 * @param maxResults Maximum number of results
 * @returns Array of CafeDetails
 */
export const fetchCafesByTags = async (
    tags: string[] = [],
    map: google.maps.Map,
    radius: number = CONFIG.DEFAULT_RADIUS,
    maxResults: number = CONFIG.DEFAULT_MAX_RESULTS
): Promise<CafeDetails[]> => {
    validateInputs(tags, map, radius, maxResults);

    if (!window.google) {
        throw new PlacesServiceError('Google Maps API not available');
    }

    const service = new google.maps.places.PlacesService(map);
    const tagKeywords = tags.flatMap(tag =>
        TAG_MAPPINGS[tag] ?? [tag.toLowerCase()]
    );
    const query = `cafe ${tagKeywords.join(' ')} Dumaguete`;

    const request: google.maps.places.TextSearchRequest = {
        location: CONFIG.DUMAGUETE_CENTER,
        radius,
        query,
    };

    try {
        const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
            service.textSearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    resolve(results);
                } else {
                    reject(new PlacesServiceError(`TextSearch failed: ${status} for query: ${query}`, status));
                }
            });
        });

        const filteredPlaces = results
            .filter(place => place.place_id && matchesTags(place, tags))
            .slice(0, maxResults);

        const detailedCafes: CafeDetails[] = [];
        for (let i = 0; i < filteredPlaces.length; i += CONFIG.BATCH_SIZE) {
            const batch = filteredPlaces.slice(i, i + CONFIG.BATCH_SIZE);
            const batchResults = await Promise.all(
                batch.map(async (place, index) => {
                    await delay(index * CONFIG.RATE_LIMIT_DELAY);
                    const details = await fetchPlaceDetails(place.place_id!, service);
                    const amenities = inferAmenities(place, tags);

                    return {
                        place_id: place.place_id!,
                        name: place.name ?? 'Unknown Cafe',
                        address: details.formatted_address ?? place.vicinity ?? 'Unknown address',
                        rating: place.rating ?? 0,
                        photos: details.photos
                            ? await Promise.all(
                                details.photos.map(photo =>
                                    fetchPhotoWithRetry(photo, 400)
                                )
                            )
                            : [CONFIG.PLACEHOLDER_IMAGE],
                        amenities,
                        lat: place.geometry?.location?.lat() ?? CONFIG.DUMAGUETE_CENTER.lat,
                        lng: place.geometry?.location?.lng() ?? CONFIG.DUMAGUETE_CENTER.lng,
                    };
                })
            );
            detailedCafes.push(...batchResults);
        }

        const filteredCafes = detailedCafes.filter(cafe =>
                tags.length === 0 || tags.some(tag => {
                    const tagKeywords = TAG_MAPPINGS[tag] ?? [tag.toLowerCase()];
                    return (
                        cafe.amenities.some(amenity =>
                            tagKeywords.includes(amenity.toLowerCase())
                        ) ||
                        cafe.name.toLowerCase().includes(tag.toLowerCase()) ||
                        (tag === 'Study Spot' && cafe.amenities.includes('Wi-Fi')) ||
                        (tag === 'Work-Friendly' && cafe.amenities.includes('Wi-Fi')) ||
                        (tag === 'Date Spot' && cafe.rating >= 4)
                    );
                })
        );

        return filteredCafes.length > 0
            ? filteredCafes
            : detailedCafes.length > 0
                ? detailedCafes
                : getFallbackCafes();
    } catch (error) {
        console.error(`Error fetching cafes with query "${query}":`, error);
        throw error instanceof PlacesServiceError
            ? error
            : new NetworkError('Network error fetching cafes');
    }
};

/**
 * Provides fallback cafes in case of error or no results
 * @returns Array of fallback CafeDetails
 */
export const getFallbackCafes = (): CafeDetails[] => [
    {
        place_id: `fallback_${uuidv4()}`,
        name: 'Fallback Cafe',
        address: '123 Main St, Dumaguete City',
        rating: 4,
        photos: ['https://via.placeholder.com/400x300?text=Fallback+Cafe'],
        amenities: ['Wi-Fi', 'Coffee'],
        lat: CONFIG.DUMAGUETE_CENTER.lat,
        lng: CONFIG.DUMAGUETE_CENTER.lng,
    },
    {
        place_id: `fallback_${uuidv4()}`,
        name: 'Another Cafe',
        address: '456 Coastal Rd, Dumaguete City',
        rating: 3.5,
        photos: ['https://via.placeholder.com/400x300?text=Another+Cafe'],
        amenities: ['Wi-Fi', 'Brunch'],
        lat: CONFIG.DUMAGUETE_CENTER.lat + 0.01,
        lng: CONFIG.DUMAGUETE_CENTER.lng + 0.01,
    },
];
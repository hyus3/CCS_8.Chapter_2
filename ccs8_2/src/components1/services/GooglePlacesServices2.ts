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

// Custom error types
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
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const DUMAGUETE_CENTER = { lat: 9.3076, lng: 123.3080 };
const DEFAULT_RADIUS = 5000; // 5km radius
const DEFAULT_MAX_RESULTS = 15;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';
const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY = 500; // ms
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Cache with expiration
interface CacheEntry {
    data: google.maps.places.PlaceResult;
    timestamp: number;
}

const placeDetailsCache = new Map<string, CacheEntry>();

// Tag mappings configuration
const getTagMappings = (): { [key: string]: string[] } => ({
    Coffee: ['coffee', 'espresso', 'latte'],
    Brunch: ['brunch', 'breakfast', 'lunch'],
    Pastries: ['bakery', 'pastry', 'dessert'],
    'Study Spot': ['quiet', 'wifi', 'study'],
    'Date Spot': ['romantic', 'cozy', 'intimate'],
    'Work-Friendly': ['wifi', 'outlets', 'workspace'],
});

/**
 * Delays execution for a specified time.
 * @param ms - Delay in milliseconds
 * @returns Promise that resolves after the delay
 */
const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Checks if a place matches the provided tags.
 * @param place - Google Places API PlaceResult
 * @param tags - Array of tags to match
 * @returns True if the place matches any tag
 */
function matchesTags(place: google.maps.places.PlaceResult, tags: string[]): boolean {
    if (tags.length === 0) return true;

    const tagMappings = getTagMappings();
    const placeTypes = place.types ?? [];
    const placeName = place.name?.toLowerCase() ?? '';

    return tags.some((tag) => {
        const tagKeywords = tagMappings[tag] ?? [tag.toLowerCase()];
        return tagKeywords.some(
            (keyword) =>
                placeTypes.includes(keyword) ||
                placeName.includes(keyword) ||
                (tag === 'Date Spot' && (place.rating ?? 0) >= 4)
        );
    });
}

/**
 * Infers amenities based on place types and tags.
 * @param place - Google Places API PlaceResult
 * @param tags - Array of tags
 * @returns Array of inferred amenities
 */
function inferAmenities(
    place: google.maps.places.PlaceResult,
    tags: string[]
): string[] {
    const amenities: string[] = [];
    const types = place.types ?? [];

    // Always assume cafes have coffee
    if (types.includes('cafe')) {
        amenities.push('Coffee');
    }
    // Broader Wi-Fi inference
    if (
        types.includes('cafe') ||
        types.includes('coffee_shop') ||
        tags.includes('Study Spot') ||
        tags.includes('Work-Friendly') ||
        (place.rating ?? 0) >= 4
    ) {
        amenities.push('Wi-Fi');
    }
    // Pastries for cafes or food-related types
    if (types.includes('bakery') || types.includes('cafe') || types.includes('food')) {
        amenities.push('Pastries');
    }
    // Brunch for food-related types
    if (
        types.includes('breakfast') ||
        types.includes('restaurant') ||
        types.includes('food')
    ) {
        amenities.push('Brunch');
    }
    // Cozy for high-rated cafes
    if ((place.rating ?? 0) >= 4) {
        amenities.push('Cozy');
    }

    return Array.from(new Set(amenities)); // Remove duplicates, compatible with ES5
}

/**
 * Fetches photo URL with retry logic.
 * @param photo - Google Places Photo object
 * @param maxWidth - Maximum width for the photo
 * @param attempt - Current retry attempt
 * @returns Photo URL or placeholder
 * @throws NetworkError if all retries fail
 */
async function fetchPhotoWithRetry(
    photo: google.maps.places.PlacePhoto,
    maxWidth: number,
    attempt: number = 1
): Promise<string> {
    try {
        return photo.getUrl({ maxWidth });
    } catch (error) {
        console.warn(`Photo fetch attempt ${attempt} failed:`, error);
        if (attempt >= RETRY_ATTEMPTS) {
            throw new NetworkError('Failed to fetch photo after max retries');
        }
        await delay(RETRY_BASE_DELAY * Math.pow(2, attempt - 1));
        return fetchPhotoWithRetry(photo, maxWidth, attempt + 1);
    }
}

/**
 * Fetches detailed place info.
 * @param placeId - Google Place ID
 * @param service - Google PlacesService instance
 * @returns Place details
 * @throws PlacesServiceError if the request fails
 */
async function fetchPlaceDetails(
    placeId: string,
    service: google.maps.places.PlacesService
): Promise<google.maps.places.PlaceResult> {
    if (!placeId) {
        throw new PlacesServiceError('Invalid placeId provided');
    }

    // Check cache
    const cached = placeDetailsCache.get(placeId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
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
        // Update cache
        placeDetailsCache.set(placeId, { data: result, timestamp: Date.now() });
        return result;
    } catch (error) {
        console.error(`Error fetching details for place ${placeId}:`, error);
        throw error instanceof PlacesServiceError ? error : new NetworkError('Network error fetching place details');
    }
}

/**
 * Fetches cafes using PlacesService Text Search with tag filtering.
 * @param tags - Array of tags to filter cafes
 * @param map - Google Maps instance
 * @param radius - Search radius in meters (default: 5000)
 * @param maxResults - Maximum number of results (default: 15)
 * @returns Array of CafeDetails
 * @throws PlacesServiceError or NetworkError on failure
 */
export async function fetchCafesByTags(
    tags: string[],
    map: google.maps.Map,
    radius: number = DEFAULT_RADIUS,
    maxResults: number = DEFAULT_MAX_RESULTS
): Promise<CafeDetails[]> {
    if (!window.google || !map) {
        throw new PlacesServiceError('Google Maps API or map instance not available');
    }

    const service = new google.maps.places.PlacesService(map);
    const tagMappings = getTagMappings();

    // Use all tag keywords
    const tagKeywords = tags.flatMap((tag) => {
        const keywords = tagMappings[tag] ?? [tag.toLowerCase()];
        return keywords;
    });
    const query = `cafe ${tagKeywords.join(' ')} Dumaguete`;

    const request: google.maps.places.TextSearchRequest = {
        location: DUMAGUETE_CENTER,
        radius,
        query,
    };

    try {
        const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
            service.textSearch(request, (results, status) => {
                console.log('Raw API Results:', results); // Debug
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    resolve(results);
                } else {
                    reject(new PlacesServiceError(`TextSearch failed: ${status} for query: ${query}`, status));
                }
            });
        });

        // Filter by tags (OR logic)
        const filteredPlaces = results
            .filter((place: google.maps.places.PlaceResult) => place.place_id && matchesTags(place, tags))
            .slice(0, maxResults);

        // Fetch detailed info with batching
        const detailedCafes: CafeDetails[] = [];
        for (let i = 0; i < filteredPlaces.length; i += 5) {
            const batch = filteredPlaces.slice(i, i + 5);
            const batchResults = await Promise.all(
                batch.map(async (place: google.maps.places.PlaceResult, index: number) => {
                    await delay(index * 100); // Rate limiting
                    const details = await fetchPlaceDetails(place.place_id!, service);

                    const amenities = inferAmenities(place, tags);

                    return {
                        place_id: place.place_id!,
                        name: place.name ?? 'Unknown Cafe',
                        address: details.formatted_address ?? place.vicinity ?? 'Unknown address',
                        rating: place.rating ?? 0,
                        photos: details.photos
                            ? await Promise.all(
                                details.photos.map((photo) =>
                                    fetchPhotoWithRetry(photo, 400).catch(() => PLACEHOLDER_IMAGE)
                                )
                            )
                            : [PLACEHOLDER_IMAGE],
                        amenities,
                        lat: place.geometry?.location?.lat() ?? DUMAGUETE_CENTER.lat,
                        lng: place.geometry?.location?.lng() ?? DUMAGUETE_CENTER.lng,
                    };
                })
            );
            detailedCafes.push(...batchResults);
        }

        // Final filtering (OR logic)
        const filteredCafes = detailedCafes.filter((cafe) =>
                tags.length === 0 || tags.some((tag) => {
                    const tagKeywords = tagMappings[tag] ?? [tag.toLowerCase()];
                    const match =
                        cafe.amenities.some((amenity) =>
                            tagKeywords.includes(amenity.toLowerCase())
                        ) ||
                        cafe.name.toLowerCase().includes(tag.toLowerCase()) ||
                        (tag === 'Study Spot' && cafe.amenities.includes('Wi-Fi')) ||
                        (tag === 'Work-Friendly' && cafe.amenities.includes('Wi-Fi')) ||
                        (tag === 'Date Spot' && cafe.rating >= 4);
                    if (!match) {
                        console.log(`Cafe "${cafe.name}" filtered out for tag "${tag}"`, {
                            amenities: cafe.amenities,
                            name: cafe.name,
                            rating: cafe.rating,
                        });
                    }
                    return match;
                })
        );

        return filteredCafes.length > 0
            ? filteredCafes
            : detailedCafes.length > 0
                ? detailedCafes
                : getFallbackCafes();
    } catch (error) {
        console.error(`Error fetching cafes with query "${query}":`, error);
        throw error instanceof PlacesServiceError ? error : new NetworkError('Network error fetching cafes');
    }
}

/**
 * Provides fallback cafes in case of error or no results.
 * @returns Array of fallback CafeDetails
 */
export function getFallbackCafes(): CafeDetails[] {
    return [
        {
            place_id: 'fallback_1',
            name: 'Fallback Cafe',
            address: '123 Main St, Dumaguete City',
            rating: 4,
            photos: ['https://via.placeholder.com/400x300?text=Fallback+Cafe'],
            amenities: ['Wi-Fi', 'Coffee'],
            lat: DUMAGUETE_CENTER.lat,
            lng: DUMAGUETE_CENTER.lng,
        },
        {
            place_id: 'fallback_2',
            name: 'Another Cafe',
            address: '456 Coastal Rd, Dumaguete City',
            rating: 3.5,
            photos: ['https://via.placeholder.com/400x300?text=Another+Cafe'],
            amenities: ['Wi-Fi', 'Brunch'],
            lat: DUMAGUETE_CENTER.lat + 0.01,
            lng: DUMAGUETE_CENTER.lng + 0.01,
        },
    ];
}
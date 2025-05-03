import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchCafeDetails, fetchGooglePlaceDetails, findGooglePlaceId } from '../body/GeopifyService';
import { CafeDetails } from '../body/Body2.script';
import './cafeView.css';
import '../body/loading.css';

const DUMAGUETE_COORDINATES = { lat: 9.3076, lng: 123.3080 };
const PLACEHOLDER_PHOTO = 'https://via.placeholder.com/400x300?text=No+Image';

// Random cafe descriptions for fallback
const RANDOM_DESCRIPTIONS: Array<string> = [
  'A cozy spot perfect for coffee lovers, offering a warm ambiance and friendly service.',
  'A vibrant cafe with a modern vibe, ideal for work or catching up with friends.',
  'A charming hideaway serving delicious brews and a relaxing atmosphere.',
  'A trendy cafe known for its artisanal drinks and welcoming environment.',
  'A quaint coffee shop with a focus on quality and community.',
];

// Type for Google Place details (matches GeopifyService.ts)
interface GooglePlaceDetails {
  photos?: string[];
  reviews?: Array<{ author_name: string; rating: number; text: string }>;
  status?: string;
  error_message?: string;
}

// Type for raw Google Places API response
interface GoogleApiResponse {
  html_attributions?: string[];
  result?: {
    name?: string;
    formatted_address?: string;
    rating?: number;
    photos?: Array<{ photo_reference: string }>;
    reviews?: Array<{ author_name: string; rating: number; text: string }>;
    types?: string[];
    geometry?: {
      location?: {
        lat: () => number;
        lng: () => number;
      };
    };
  };
  status: string;
  error_message?: string;
}

const CafeView: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const { state } = useLocation();
  const [cafe, setCafe] = useState<CafeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [photoLoading, setPhotoLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [googlePhotos, setGooglePhotos] = useState<string[]>([]);
  const [reviews, setReviews] = useState<
    Array<{ author_name: string; rating: number; text: string }>
  >([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  // Helper to convert GoogleApiResponse to GooglePlaceDetails
  const mapGoogleApiResponse = (response: GoogleApiResponse): GooglePlaceDetails => {
    if (response.status !== 'OK' || !response.result) {
      return {
        status: response.status,
        error_message: response.error_message,
        photos: [],
        reviews: [],
      };
    }
    return {
      status: 'OK',
      photos: response.result.photos
        ? response.result.photos.slice(0, 2).map(
            (photo) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY || 'AIzaSyBOQbqvtffeuLeuo4DpS_zBF71ic-R0ocU'}`
          )
        : [],
      reviews: response.result.reviews?.slice(0, 3) || [],
    };
  };

  // Helper to fetch cafe details (Geoapify or Google) with retry
  const fetchCafeDetailsWithRetry = (
    placeId: string,
    isGoogleId: boolean,
    callback: (cafeDetails: CafeDetails, googleDetails?: GooglePlaceDetails) => void,
    errorCallback: (err: string, status?: string) => void,
    retries: number = 2
  ) => {
    const attemptFetch = (attempt: number) => {
      if (isGoogleId) {
        fetchGooglePlaceDetails(
          placeId,
          (details: GooglePlaceDetails) => {
            if (details.status && details.status !== 'OK') {
              console.error('Google Places API error:', {
                placeId,
                status: details.status,
                error_message: details.error_message || 'Unknown API error',
                attempt,
              });
              errorCallback(`API error: ${details.error_message || 'Unknown error'}`, details.status);
              return;
            }
            const cafeDetails: CafeDetails = {
              place_id: placeId,
              name: state?.cafeDetails?.name || 'Unknown Cafe',
              address: state?.cafeDetails?.address || 'Unknown Address',
              rating: state?.cafeDetails?.rating || 0,
              photos: details.photos || state?.cafeDetails?.photos || [PLACEHOLDER_PHOTO],
              amenities: state?.cafeDetails?.amenities || ['Coffee'],
              lat: state?.lat || DUMAGUETE_COORDINATES.lat,
              lon: state?.lon || DUMAGUETE_COORDINATES.lng,
            };
            callback(cafeDetails, details);
          },
          (err) => {
            console.warn(`Google fetch attempt ${attempt + 1} failed for placeId ${placeId}: ${err}`);
            if (attempt < retries) {
              setTimeout(() => attemptFetch(attempt + 1), 1000);
            } else {
              console.error('Final Google fetch error:', { placeId, error: err, retries });
              errorCallback(`Failed to fetch Google details: ${err}`);
            }
          }
        );
      } else {
        fetchCafeDetails(
          placeId,
          (cafeDetails) => {
            findGooglePlaceId(
              cafeDetails.name,
              cafeDetails.address,
              (googlePlaceId) => {
                if (googlePlaceId) {
                  fetchGooglePlaceDetails(
                    googlePlaceId,
                    (googleDetails: GooglePlaceDetails) => {
                      callback(cafeDetails, googleDetails);
                    },
                    (err) => {
                      console.warn('Failed to fetch Google details for Geoapify cafe:', err);
                      callback(cafeDetails, {
                        status: 'OK',
                        photos: cafeDetails.photos || [PLACEHOLDER_PHOTO],
                        reviews: [],
                      });
                    }
                  );
                } else {
                  callback(cafeDetails, {
                    status: 'OK',
                    photos: cafeDetails.photos || [PLACEHOLDER_PHOTO],
                    reviews: [],
                  });
                }
              },
              (err) => {
                console.warn('Failed to find Google Place ID:', err);
                callback(cafeDetails, {
                  status: 'OK',
                  photos: cafeDetails.photos || [PLACEHOLDER_PHOTO],
                  reviews: [],
                });
              }
            );
          },
          (err) => {
            console.warn(`Geoapify fetch attempt ${attempt + 1} failed for placeId ${placeId}: ${err}`);
            if (attempt < retries) {
              setTimeout(() => attemptFetch(attempt + 1), 1000);
            } else {
              console.error('Final Geoapify fetch error:', { placeId, error: err, retries });
              errorCallback(`Failed to fetch Geoapify details: ${err}`);
            }
          }
        );
      }
    };
    attemptFetch(0);
  };

  useEffect(() => {
    if (!placeId || typeof placeId !== 'string' || placeId.trim() === '') {
      console.warn('Invalid placeId:', {
        placeId,
        reason: !placeId ? 'Missing placeId' : 'Non-string or empty placeId',
      });
      setError('Invalid cafe ID provided. Please try another cafe.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setPhotoLoading(true);

    const isGoogleId = state?.source === 'slider' || placeId.startsWith('ChIJ');
    fetchCafeDetailsWithRetry(
      placeId,
      isGoogleId,
      (cafeDetails, googleDetails) => {
        setCafe(cafeDetails);
        setGooglePhotos(googleDetails?.photos || cafeDetails.photos || [PLACEHOLDER_PHOTO]);
        setReviews(googleDetails?.reviews || []);
        setPhotoLoading(false);
        setLoading(false);
        setTimeout(() => initializeMap(cafeDetails), 100);
      },
      (err, status) => {
        let userError = 'Unable to load cafe details. Please try again later.';
        if (status === 'NOT_FOUND') {
          userError = 'Cafe not found. Please try another cafe.';
        } else if (status === 'INVALID_REQUEST') {
          userError = 'Invalid cafe ID. Please try another cafe.';
        } else if (err.includes('Failed to fetch')) {
          userError = 'Network error. Please check your connection and try again.';
        } else if (err.includes('Geoapify')) {
          userError = 'Unable to load cafe details from Geoapify. Please try another cafe.';
        }
        setError(userError);
        console.error('Error loading cafe:', { placeId, source: state?.source, error: err, status });
        if (state?.cafeDetails) {
          const fallbackCafe: CafeDetails = {
            place_id: placeId,
            name: state.cafeDetails.name || 'Unknown Cafe',
            address: state.cafeDetails.address || 'Unknown Address',
            rating: state.cafeDetails.rating || 0,
            photos: state.cafeDetails.photos || [PLACEHOLDER_PHOTO],
            amenities: state.cafeDetails.amenities || ['Coffee'],
            lat: state.lat || DUMAGUETE_COORDINATES.lat,
            lon: state.lon || DUMAGUETE_COORDINATES.lng,
          };
          setCafe(fallbackCafe);
          setGooglePhotos(fallbackCafe.photos);
          setReviews([]);
          setPhotoLoading(false);
          setLoading(false);
          setTimeout(() => initializeMap(fallbackCafe), 100);
        } else {
          setPhotoLoading(false);
          setLoading(false);
        }
      }
    );
  }, [placeId, state]);

  const initializeMap = (cafeDetails: CafeDetails) => {
    if (!mapRef.current || leafletMap.current) return;

    const lat = cafeDetails.lat || state?.lat || DUMAGUETE_COORDINATES.lat;
    const lon = cafeDetails.lon || state?.lon || DUMAGUETE_COORDINATES.lng;

    leafletMap.current = L.map(mapRef.current).setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);
    L.marker([lat, lon])
      .addTo(leafletMap.current)
      .bindPopup(cafeDetails.name)
      .openPopup();
  };

  const handleBack = () => {
    navigate('/search', {
      state: {
        lat: state?.lat || DUMAGUETE_COORDINATES.lat,
        lon: state?.lon || DUMAGUETE_COORDINATES.lng,
      },
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error && !cafe) {
    return (
      <div className="cafe-view-error">
        {error}
        <button className="back-button" onClick={handleBack}>Back to Search</button>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="cafe-view-error">
        Cafe not found
        <button className="back-button" onClick={handleBack}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="cafe-view-container">
      <div className="cafe-view-content">
        <div className="left-section">
          <div className="cafe-image-container">
            {photoLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : googlePhotos.length > 0 ? (
              <img
                src={googlePhotos[0]}
                alt={`${cafe.name} main view`}
                className="cafe-image"
              />
            ) : (
              <div className="placeholder-image">No Image Available</div>
            )}
          </div>
          <div className="cafe-map-container">
            <div ref={mapRef} className="cafe-map"></div>
          </div>
        </div>
        <div className="right-section">
          <h1 className="cafe-name">{cafe.name}</h1>
          <div className="cafe-reviews">
            <h2>Reviews</h2>
            {photoLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{review.author_name}</span>
                      <span className="review-rating">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-reviews">No reviews available</p>
            )}
          </div>
          <button className="back-button" onClick={handleBack}>Back to Search</button>
        </div>
      </div>
    </div>
  );
};

export default CafeView;
// src/components1/cafeView/cafeView.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchCafeDetails, findGooglePlaceId, fetchGooglePlaceDetails } from '../body/GeopifyService';
import { CafeDetails } from '../body/Body2.script';
import './cafeView.css';

const DUMAGUETE_COORDINATES = { lat: 9.3076, lng: 123.3080 };

// Random cafe descriptions for fallback
const RANDOM_DESCRIPTIONS = [
  'A cozy spot perfect for coffee lovers, offering a warm ambiance and friendly service.',
  'A vibrant cafe with a modern vibe, ideal for work or catching up with friends.',
  'A charming hideaway serving delicious brews and a relaxing atmosphere.',
  'A trendy cafe known for its artisanal drinks and welcoming environment.',
  'A quaint coffee shop with a focus on quality and community.'
];

const CafeView: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const { state } = useLocation();
  const [cafe, setCafe] = useState<CafeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [googlePhotos, setGooglePhotos] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Array<{ author_name: string, rating: number, text: string }>>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!placeId) {
      setError("No cafe ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchCafeDetails(
      placeId,
      (cafeDetails) => {
        setCafe(cafeDetails);
        // Fetch Google Place ID and details
        findGooglePlaceId(
          cafeDetails.name,
          cafeDetails.address,
          (googlePlaceId) => {
            if (googlePlaceId) {
              fetchGooglePlaceDetails(
                googlePlaceId,
                (details) => {
                  setGooglePhotos(details.photos || []);
                  setReviews(details.reviews || []);
                  setLoading(false);
                  setTimeout(() => initializeMap(cafeDetails), 100);
                },
                (err) => {
                  console.warn(`Google API error: ${err}`);
                  setGooglePhotos([]);
                  setReviews([]);
                  setLoading(false);
                  setTimeout(() => initializeMap(cafeDetails), 100);
                }
              );
            } else {
              setGooglePhotos([]);
              setReviews([]);
              setLoading(false);
              setTimeout(() => initializeMap(cafeDetails), 100);
            }
          },
          (err) => {
            console.warn(`Google Place ID error: ${err}`);
            setGooglePhotos([]);
            setReviews([]);
            setLoading(false);
            setTimeout(() => initializeMap(cafeDetails), 100);
          }
        );
      },
      (err) => {
        setError(`Unable to load cafe details. Please try again.`);
        setLoading(false);
      }
    );

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [placeId]);

  const initializeMap = (cafeDetails: CafeDetails) => {
    if (!mapRef.current || leafletMap.current) return;

    const lat = cafeDetails.lat || DUMAGUETE_COORDINATES.lat;
    const lon = cafeDetails.lon || DUMAGUETE_COORDINATES.lng;
    
    leafletMap.current = L.map(mapRef.current).setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap.current);
    L.marker([lat, lon])
      .addTo(leafletMap.current)
      .bindPopup(cafeDetails.name)
      .openPopup();
  };

  const handleBack = () => {
    navigate('/search', { state: { lat: state?.lat || DUMAGUETE_COORDINATES.lat, lon: state?.lon || DUMAGUETE_COORDINATES.lng } });
  };

  // Generate random description if none exists
  const getCafeDescription = () => {
    if (cafe?.description) return cafe.description;
    return RANDOM_DESCRIPTIONS[Math.floor(Math.random() * RANDOM_DESCRIPTIONS.length)];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cafe-view-error">
        {error}
        <button onClick={handleBack} style={{ marginTop: '1rem' }}>Back to Search</button>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="cafe-view-error">
        Cafe not found
        <button onClick={handleBack} style={{ marginTop: '1rem' }}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="cafe-view-container">
      <button onClick={handleBack} style={{ marginBottom: '1rem' }}>Back to Search</button>
      <div className="cafe-view-content">
        <div className="cafe-image-container">
          {googlePhotos.length > 0 ? (
            <img src={googlePhotos[0]} alt={cafe.name} className="cafe-image" />
          ) : (
            <div className="placeholder-image">No Image Available</div>
          )}
          {googlePhotos.length > 1 && (
            <img src={googlePhotos[1]} alt={`${cafe.name} secondary view`} className="cafe-image" />
          )}
        </div>
        <div className="cafe-details">
          <h1 className="cafe-name">{cafe.name}</h1>
          <p className="cafe-description">{getCafeDescription()}</p>
          <div className="cafe-tags">
            {cafe.amenities.map((amenity, index) => (
              <span key={index} className="cafe-tag">{amenity}</span>
            ))}
          </div>
          <div className="cafe-rating">
            {'★'.repeat(Math.floor(cafe.rating))}
            {'☆'.repeat(5 - Math.floor(cafe.rating))}
          </div>
          <div className="cafe-reviews">
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{review.author_name}</span>
                      <span className="review-rating">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
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
        </div>
      </div>
      <div className="cafe-map-container">
        <div ref={mapRef} className="cafe-map"></div>
      </div>
      <div className="cafe-address">
        <div className="address-icon">📍</div>
        <div className="address-text">{cafe.address}</div>
      </div>
    </div>
  );
};

export default CafeView;
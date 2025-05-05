import React, { useEffect, useState, useRef } from 'react';
  import { useParams, useNavigate, useLocation } from 'react-router-dom';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import './cafeView.css';
  import '../body/loading.css';
  import {Tooltip, IconButton} from "@mui/material";
  import { FavoriteBorder, Favorite } from '@mui/icons-material';
  import { db } from '../../firebase';
  import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
  import {User} from "firebase/auth";
  import { fetchGoogleReviews } from './fetchGoogleReviews';
  import { parseGoogleReviews } from './parseGoogleReview';
  import { Review } from './review';

  const DUMAGUETE_COORDINATES = { lat: 9.3076, lng: 123.3080 };
  const PLACEHOLDER_PHOTO = 'https://picsum.photos/400/300?grayscale';

  interface CafeDetails {
    place_id: string;
    name: string;
    address: string;
    rating: number;
    photos: string[];
    amenities: string[];
    lat: number;
    lon: number;
  }

  interface CafeViewProps {
    user: User | null;
  }

  const CafeView: React.FC<CafeViewProps> = ({ user }) => {
    const { placeId } = useParams<{ placeId: string }>();
    const { state } = useLocation();
    const [cafe, setCafe] = useState<CafeDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [photoLoading, setPhotoLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [googlePhotos, setGooglePhotos] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [description, setDescription] = useState<string>('');
    const [isFavorited, setIsFavorited] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<L.Map | null>(null);
    const navigate = useNavigate();

    const RANDOM_DESCRIPTIONS: Array<string> = [
      'A cozy spot perfect for coffee lovers, offering a warm ambiance and friendly service.',
      'A vibrant cafe with a modern vibe, ideal for work or catching up with friends.',
      'A charming hideaway serving delicious brews and a relaxing atmosphere.',
      'A trendy cafe known for its artisanal drinks and welcoming environment.',
      'A quaint coffee shop with a focus on quality and community.',
    ];

    useEffect(() => {
      if (user && cafe && cafe.place_id) {
        const favoriteRef = doc(db, "users", user.uid, "favorites", cafe.place_id);
        getDoc(favoriteRef).then((favSnap) => {
          setIsFavorited(favSnap.exists());
        }).catch((err) => {
          console.error("Error checking favorite status:", err);
          setIsFavorited(false);
        });
      }
    }, [user, cafe]);

    const handleToggleFavorite = async () => {
      if (!cafe || !user) return alert('User not logged in.');

      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState);

      const favoriteRef = doc(db, "users", user.uid, "favorites", cafe.place_id);

      try {
        if (newFavoritedState) {
          await setDoc(favoriteRef, {
            name: cafe.name,
            address: cafe.address,
            placeId: cafe.place_id,
            timestamp: new Date(),
          });
          console.log("Cafe added to favorites");
        } else {
          await deleteDoc(favoriteRef);
          console.log("Cafe removed from favorites");
        }
      } catch (error) {
        console.error("Error updating favorites:", error);
      }
    };

    useEffect(() => {
      if (!placeId) {
        setError('No Place ID provided');
        return;
      }

      const fetchReviews = async () => {
        try {
          console.log('Fetching reviews for Place ID:', placeId, 'Cafe Name:', cafe?.name);
          const response = await fetchGoogleReviews(placeId, cafe?.name);
          const parsedReviews = parseGoogleReviews(response);
          setReviews(parsedReviews);
          setError(null);
        } catch (err) {
          console.error('Failed to load reviews:', err);
          setReviews([]);
          setError('Failed to load reviews. Please try again later.');
        }
      };

      fetchReviews();
    }, [placeId, cafe?.name]);

    useEffect(() => {
      if (!placeId || typeof placeId !== 'string' || placeId.trim() === '') {
        setError('Invalid cafe ID provided. Please try another cafe.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setPhotoLoading(true);

      const fallbackCafe: CafeDetails = {
        place_id: placeId,
        name: state?.cafeDetails?.name || 'Unknown Cafe',
        address: state?.cafeDetails?.address || 'Unknown Address',
        rating: state?.cafeDetails?.rating || 0,
        photos: state?.cafeDetails?.photos || [PLACEHOLDER_PHOTO],
        amenities: state?.cafeDetails?.amenities || ['Coffee'],
        lat: state?.lat || DUMAGUETE_COORDINATES.lat,
        lon: state?.lon || DUMAGUETE_COORDINATES.lng,
      };

      setCafe(fallbackCafe);
      setGooglePhotos(fallbackCafe.photos);
      setDescription(RANDOM_DESCRIPTIONS[Math.floor(Math.random() * RANDOM_DESCRIPTIONS.length)]);
      setPhotoLoading(false);
      setLoading(false);

      setTimeout(() => initializeMap(fallbackCafe), 100);
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
            <div className="cafe-header">
              <h1 className="cafe-name">{cafe.name}</h1>
              <Tooltip title="Add to Favorites">
              <IconButton
                  onClick={handleToggleFavorite}
                  sx={{
                    borderRadius: 0,
                    width: 10,
                    height: 10,
                    color: isFavorited ? "#cd3234" : "#cd3234",
                  }}
              >
                {isFavorited ? <Favorite sx={{ color: "#cd3234", fontSize: "30px",  }} /> : <FavoriteBorder sx={{color: "#cd3234", fontSize: "30px",  }}/>}
              </IconButton>
            </Tooltip>

            </div>
            <p className="cafe-description">{description}</p>

            <div className="cafe-reviews">
              <h2 style={{ color: "#6e4e33" }}>Reviews</h2>
              {error && <p className="text-red-500">{error}</p>}
              {photoLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <span className="review-author">{review.authorName}</span>
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
                <p className="no-reviews">{error ? '' : 'No reviews available'}</p>
              )}
            </div>
            <button className="back-button" onClick={handleBack}>Back to Search</button>
          </div>
        </div>
      </div>
    );
  };

  export default CafeView;
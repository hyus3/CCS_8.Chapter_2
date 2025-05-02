// src/components1/cafeSearch/cafeSearch.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AutosuggestSearch from '../body/AutosuggestSearch';
import { fetchCafesNearLocation, findGooglePlaceId } from '../body/GeopifyService';
import { CafeDetails } from '../body/Body2.script';
import './cafeSearch.css';

const DUMAGUETE_COORDINATES = { lat: 9.3076, lng: 123.3080 };

const CafeSearch: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cafes, setCafes] = useState<CafeDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCafes = () => {
    setLoading(true);
    setError(null);
    const lat = state?.lat || DUMAGUETE_COORDINATES.lat;
    const lon = state?.lon || DUMAGUETE_COORDINATES.lng;
    fetchCafesNearLocation(
      lat,
      lon,
      (fetchedCafes) => {
        setCafes(fetchedCafes);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading cafes:', error);
        setError('Failed to load cafes. Please try again later.');
        setCafes([]);
        setLoading(false);
      }
    );
  };

  const handleCafeClick = (cafe: CafeDetails) => {
    if (!cafe.place_id || typeof cafe.place_id !== 'string' || cafe.place_id.trim() === '') {
      console.warn('Invalid place_id for cafe:', { name: cafe.name, place_id: cafe.place_id });
      return;
    }
    const maxRetries = 2;
    let attempt = 0;

    const tryFindGooglePlaceId = () => {
      findGooglePlaceId(
        cafe.name,
        cafe.address,
        (googlePlaceId) => {
          const placeId = googlePlaceId || cafe.place_id;
          navigate(`/cafe/${placeId}`, {
            state: {
              lat: cafe.lat || DUMAGUETE_COORDINATES.lat,
              lon: cafe.lon || DUMAGUETE_COORDINATES.lng,
              source: 'search',
              cafeDetails: {
                name: cafe.name,
                address: cafe.address,
                rating: cafe.rating,
                photos: cafe.photos || ['https://via.placeholder.com/400x300?text=No+Image'],
                amenities: cafe.amenities || [],
              },
            },
          });
        },
        (error) => {
          console.warn(`Attempt ${attempt + 1} failed to find Google Place ID: ${error}`);
          if (attempt < maxRetries) {
            attempt++;
            setTimeout(tryFindGooglePlaceId, 1000);
          } else {
            console.error('Final attempt failed to find Google Place ID:', error);
            navigate(`/cafe/${cafe.place_id}`, {
              state: {
                lat: cafe.lat || DUMAGUETE_COORDINATES.lat,
                lon: cafe.lon || DUMAGUETE_COORDINATES.lng,
                source: 'search',
                cafeDetails: {
                  name: cafe.name,
                  address: cafe.address,
                  rating: cafe.rating,
                  photos: cafe.photos || ['https://via.placeholder.com/400x300?text=No+Image'],
                  amenities: cafe.amenities || [],
                },
              },
            });
          }
        }
      );
    };

    tryFindGooglePlaceId();
  };

  useEffect(() => {
    loadCafes();
  }, [state]);

  return (
    <div className="cafeSearch-container">
      <AutosuggestSearch placeholder="Search for coffee shops in Dumaguete" />
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="no-results">{error}</div>}
      <div className="card-grid">
        {cafes.length > 0 ? (
          cafes.map((cafe) => (
            <div key={cafe.place_id} className="card" onClick={() => handleCafeClick(cafe)}>
              <div
                className="card-image"
                style={{
                  backgroundImage: `url(${cafe.photos?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'})`,
                }}
              ></div>
              <div className="card-footer">
                <div className="card-title">{cafe.name}</div>
                <div className="card-location">{cafe.address}</div>
                {cafe.rating && (
                  <div className="card-location">
                    Rating: {'★'.repeat(Math.floor(cafe.rating))}{'☆'.repeat(5 - Math.floor(cafe.rating))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : !loading && !error ? (
          <div className="no-results">No cafes found</div>
        ) : null}
      </div>
    </div>
  );
};

export default CafeSearch;
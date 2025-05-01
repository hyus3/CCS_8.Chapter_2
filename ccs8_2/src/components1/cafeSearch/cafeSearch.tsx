// src/components1/cafeSearch/cafeSearch.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCafesNearLocation } from '../body/GeopifyService';
import './cafeSearch.css';
import { CafeDetails } from '../body/Body2.script';

const CafeSearch: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<CafeDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.lat || !state?.lon) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchCafes = async () => {
      setLoading(true);
      fetchCafesNearLocation(
        state.lat,
        state.lon,
        (cafes) => {
          setResults(cafes);
          setLoading(false);
        },
        () => {
          setResults([]);
          setLoading(false);
        }
      );
    };

    fetchCafes();
  }, [state?.lat, state?.lon]);

  return (
    <div className="cafeSearch-container">
      <h2>Cafes Near Your Location</h2>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="card-grid">
          {results.length > 0 ? (
            results.map((cafe) => (
              <div 
                className="card" 
                key={cafe.place_id}
                onClick={() => navigate(`/cafe/${cafe.place_id}`, { state: { lat: state.lat, lon: state.lon } })}
              >
                <div 
                  className="card-image" 
                  style={cafe.photos[0] ? {
                    backgroundImage: `url(${cafe.photos[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : undefined}
                />
                <div className="card-footer">
                  <div className="card-title">{cafe.name}</div>
                  <div className="card-location">{cafe.address}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No cafes found. Try another search.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CafeSearch;
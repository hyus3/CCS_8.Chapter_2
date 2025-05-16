// src/components1/cafeSearch/cafeSearch.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AutosuggestSearch from '../body/AutosuggestSearch';
import { fetchCafesByQuery } from '../services/GooglePlacesService';
import { CafeDetails } from '../body/Body2.script';
import './cafeSearch.css';
import {Tooltip} from "@mui/material";
import BreadcrumbsComponent from "../navbar/BreadcrumbsComponent";

const DUMAGUETE_COORDINATES = { lat: 9.3076, lng: 123.3080 };

const CafeSearch: React.FC = () => {
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const [cafes, setCafes] = useState<CafeDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extract query from state or URL as a fallback
  const queryParams = new URLSearchParams(search);
  const urlQuery = queryParams.get('query');
  const stateQuery = state?.query;
  const finalQuery = stateQuery || urlQuery || 'Coffee shops in Dumaguete';

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: `Search` },
  ];

  const loadCafes = () => {
    setLoading(true);
    setError(null);
    const lat = state?.lat || DUMAGUETE_COORDINATES.lat;
    const lon = state?.lon || DUMAGUETE_COORDINATES.lng;
    console.log(`[CafeSearch] Loading cafes with query: "${finalQuery}", lat: ${lat}, lon: ${lon}`);
    fetchCafesByQuery(
      finalQuery,
      lat,
      lon,
      (fetchedCafes) => {
        console.log('[CafeSearch] Fetched cafes:', fetchedCafes);
        // Transform rating to number, defaulting to 0 if null to match Body2.script type
        const transformedCafes = fetchedCafes.map(cafe => ({
          ...cafe,
          rating: cafe.rating || 0,
        }));
        setCafes(transformedCafes as CafeDetails[]);
        setLoading(false);
      },
      () => {
        console.error('[CafeSearch] Error loading cafes');
        setError('Failed to load cafes. Please try again later.');
        setCafes([]);
        setLoading(false);
      }
    );
  };

  const handleCafeClick = (cafe: CafeDetails) => {
    if (!cafe.place_id || typeof cafe.place_id !== 'string' || cafe.place_id.trim() === '') {
      console.warn('[CafeSearch] Invalid place_id for cafe:', { name: cafe.name, place_id: cafe.place_id });
      return;
    }
    navigate(`/cafe/${cafe.place_id}`, {
      state: {
        lat: cafe.lat || DUMAGUETE_COORDINATES.lat,
        lon: cafe.lon || DUMAGUETE_COORDINATES.lng,
        source: 'search',
        cafeDetails: {
          name: cafe.name,
          address: cafe.address,
          rating: cafe.rating,
          photos: cafe.photos.length > 0 ? cafe.photos : ['https://via.placeholder.com/400x300?text=No+Image'],
          amenities: cafe.amenities || [],
        },
      },
    });
  };

  useEffect(() => {
    console.log('[CafeSearch] Component mounted with state:', state);
    console.log('[CafeSearch] state.query:', state?.query);
    console.log('[CafeSearch] URL query:', urlQuery);
    console.log('[CafeSearch] Final query:', finalQuery);
    loadCafes();
  }, [state, search]);

  return (
    <div className="cafeSearch-container">
      <BreadcrumbsComponent items={breadcrumbItems} />
      <Tooltip title="Searchbar">
        <AutosuggestSearch placeholder="Search for coffee shops in Dumaguete" />
      </Tooltip>
      {(finalQuery || true) && (
        <div className="search-results-label">
          {finalQuery ? `Search results for "${finalQuery}"` : 'Coffee shops in Dumaguete'}
        </div>
      )}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="no-results">{error}</div>}
      <div className="card-grid">
        {cafes.length > 0 ? (
          cafes.map((cafe) => (
            <div key={cafe.place_id} className="card" onClick={() => handleCafeClick(cafe)}>
              <div className="card-image">
                <img
                    src={cafe.photos[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={cafe.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                    style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="card-footer">
                <div className="text-content">
                  <div className="card-title">{cafe.name}</div>
                  <div className="card-location">{cafe.address}</div>
                  {cafe.rating && (
                    <div className="rating">
                     {'★'.repeat(Math.floor(cafe.rating))}{'☆'.repeat(5 - Math.floor(cafe.rating))}
                    </div>
                  )}
                </div>
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
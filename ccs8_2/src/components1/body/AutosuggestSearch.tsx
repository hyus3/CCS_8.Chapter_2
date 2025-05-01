// src/components1/body/AutosuggestSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { fetchPlaceSuggestions } from './GeopifyService';

interface AutosuggestSearchProps {
  placeholder?: string;
}

export const AutosuggestSearch: React.FC<AutosuggestSearchProps> = ({ 
  placeholder = "Search for coffee shops in Dumaguete" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string, place_id: string, lat: number, lon: number }>>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const debouncedSearch = useRef(
    debounce((query: string) => {
      if (query.trim() === '') {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      fetchPlaceSuggestions(
        query,
        (results) => {
          setSearchResults(results);
          setShowDropdown(results.length > 0);
          setIsLoading(false);
        },
        () => {
          setSearchResults([]);
          setShowDropdown(false);
          setIsLoading(false);
        }
      );
    }, 300)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '' || searchResults.length === 0) return;
    
    const result = searchResults[0];
    navigate('/search', { state: { lat: result.lat, lon: result.lon } });
    setShowDropdown(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSelectResult = (placeId: string) => {
    const selectedResult = searchResults.find(result => result.place_id === placeId);
    if (selectedResult) {
      navigate('/search', { state: { lat: selectedResult.lat, lon: selectedResult.lon } });
      setSearchQuery(selectedResult.name);
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
        />
        <button type="submit" className="search-button">
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            <span className="search-icon">🔍</span>
          )}
        </button>
      </form>
      
      {showDropdown && searchResults.length > 0 && (
        <div className="search-results" ref={dropdownRef}>
          {searchResults.map((result) => (
            <div 
              key={result.place_id}
              className="search-result-item"
              onClick={() => handleSelectResult(result.place_id)}
              role="option"
            >
              {result.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutosuggestSearch;
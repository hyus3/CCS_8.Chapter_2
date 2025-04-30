import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import debounce from 'lodash/debounce';
import { searchCafesByTextOSM } from './Body2.osm.script';
import { CafeDetails } from './Body2.script';

interface AutosuggestSearchProps {
  onCafeSelect: (placeId: string) => void;
  placeholder?: string;
}

export const AutosuggestSearch: React.FC<AutosuggestSearchProps> = ({ 
  onCafeSelect, 
  placeholder = "Search for coffee shops in Dumaguete" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string, place_id: string }>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Create debounced search function
  const debouncedSearch = useRef(
    debounce((query: string) => {
      if (query.trim() === '') {
        setSearchResults([]);
        return;
      }

      searchCafesByTextOSM(
        query,
        // Success callback
        (results) => {
          setSearchResults(results);
          setShowDropdown(results.length > 0);
          setFocusedIndex(-1);
        },
        // Error callback
        (error) => {
          console.error(error);
          setSearchResults([]);
          setShowDropdown(false);
        }
      );
    }, 300) // 300ms debounce
  ).current;

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') return;
    
    // If an item is focused in the dropdown, select it
    if (focusedIndex >= 0 && focusedIndex < searchResults.length) {
      handleSelectResult(searchResults[focusedIndex].place_id);
    } else if (searchResults.length > 0) {
      // Otherwise select the first result
      handleSelectResult(searchResults[0].place_id);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If dropdown is not visible, don't handle keyboard navigation
    if (!showDropdown || searchResults.length === 0) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => prev > 0 ? prev - 1 : 0);
    }
    // Escape key
    else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Handle selecting a result
  const handleSelectResult = (placeId: string) => {
    const selectedResult = searchResults.find(result => result.place_id === placeId);
    if (selectedResult) {
      setSearchQuery(selectedResult.name);
      onCafeSelect(placeId);
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  // Handle click outside to close dropdown
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
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll to focused item
  useEffect(() => {
    if (focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  return (
    <div className="search-container">
      <form onSubmit={handleSearchSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="search-input"
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
        />
        <button type="submit" className="search-button">
          <span className="search-icon">🔍</span>
        </button>
      </form>
      
      {/* Search Results Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div className="search-results" ref={dropdownRef}>
          {searchResults.map((result, index) => (
            <div 
              key={result.place_id}
              className={`search-result-item ${focusedIndex === index ? 'active' : ''}`}
              onClick={() => handleSelectResult(result.place_id)}
              onMouseEnter={() => setFocusedIndex(index)}
              role="option"
              aria-selected={focusedIndex === index}
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
// src/components1/body/Body2.tsx
import React, { useState, useEffect } from 'react';
import './Body2.css';
import './EnhancedComponents.css';
import { fetchTopCafes, CafeDetails, getFallbackSliderItems } from '../services/GooglePlacesService';
import AutosuggestSearch from './AutosuggestSearch';
import EnhancedImageSlider from './EnhancedImageSlider';

function Body2() {
  const [sliderItems, setSliderItems] = useState<CafeDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const tags = ['Coffee', 'Brunch', 'Pastries', 'Study Spot', 'Date Spot', 'Work-Friendly'];

  useEffect(() => {
    loadTopCafes();
  }, []);

  const loadTopCafes = () => {
    setIsLoading(true);
    fetchTopCafes(
      (cafes) => {
        setSliderItems(cafes);
        setIsLoading(false);
      },
      () => {
        setSliderItems(getFallbackSliderItems());
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <div className="hero">
        <h1 className="hero-title">Cafe Compass</h1>
        <p className="hero-subtitle">Discover the best cafes in Dumaguete City</p>
        <AutosuggestSearch placeholder="Search for coffee shops in Dumaguete" />
        <div className="tags-container">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="video-container">
        <div className="video-wrapper">
          <div className="video-placeholder">Video Content Goes Here</div>
        </div>
      </div>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      <EnhancedImageSlider 
        sliderItems={sliderItems} 
        title="Top Cafes in Dumaguete"
      />
    </>
  );
}

export default Body2;
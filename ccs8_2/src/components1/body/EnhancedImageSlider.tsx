// src/components1/body/EnhancedImageSlider.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CafeDetails } from '../services/GooglePlacesService';

interface EnhancedImageSliderProps {
  sliderItems: CafeDetails[];
  title?: string;
  onImageClick?: (placeId: string, lat: number, lon: number) => void;
}

const EnhancedImageSlider: React.FC<EnhancedImageSliderProps> = ({
  sliderItems,
  title = "Top Cafes in Dumaguete",
  onImageClick,
}) => {
  const [activeSlide, setActiveSlide] = useState(Math.min(2, sliderItems.length - 1));
  const navigate = useNavigate();

  useEffect(() => {
    setActiveSlide(Math.min(2, sliderItems.length - 1));
  }, [sliderItems]);

  const getSlideClass = (index: number) => {
    if (index === activeSlide) return 'slider-item center';
    if (index === activeSlide - 1) return 'slider-item left';
    if (index === activeSlide + 1) return 'slider-item right';
    if (index < activeSlide - 1) return 'slider-item left-hidden';
    return 'slider-item right-hidden';
  };

  const handleImageClick = (item: CafeDetails, index: number) => {
    setActiveSlide(index);
    if (!item.place_id || typeof item.place_id !== 'string' || item.place_id.trim() === '') {
      console.warn('Invalid place_id for cafe:', {
        name: item.name,
        place_id: item.place_id,
        reason: !item.place_id ? 'Missing place_id' : 'Non-string or empty place_id',
      });
      return;
    }
    const lat = item.lat || 9.3076;
    const lon = item.lon || 123.3080;
    if (onImageClick) {
      onImageClick(item.place_id, lat, lon);
    } else {
      navigate('/search', { state: { lat, lon } });
    }
  };

  return (
    <div className="slider-container">
      <div className="slider-title">{title}</div>
      <div className="slider-wrapper">
        {sliderItems.map((item, index) => (
          <div
            key={item.place_id || `cafe-${index}`}
            className={getSlideClass(index)}
            onMouseEnter={() => setActiveSlide(index)}
            onClick={() => handleImageClick(item, index)}
            style={{ transitionDuration: '.9s', cursor: item.place_id ? 'pointer' : 'default' }}
          >
            <img
              src={item.photos[0]}
              alt={item.name}
              className="slider-image"
            />
            <div className="slider-caption">
              <div>{item.name}</div>
              <div className="text-sm">{item.address}</div>
              {item.rating && (
                <div className="text-sm">Rating: {item.rating}/5</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedImageSlider;
import React, { useState, useEffect, useRef } from 'react';
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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isSwiping = useRef<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const handleImageClick = (item: CafeDetails, index: number, e: React.MouseEvent) => {
    if (isSwiping.current) {
      e.preventDefault();
      return;
    }
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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = false;
    // Optional: Add debug log
    // console.log('Touch started at:', touchStartX.current);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
    isSwiping.current = true;
    e.preventDefault(); // Prevent page scrolling during swipe
    // Optional: Add debug log
    // console.log('Touch moving, current X:', touchEndX.current);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null || !isSwiping.current) {
      touchStartX.current = null;
      touchEndX.current = null;
      isSwiping.current = false;
      return;
    }

    const deltaX = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe

    // Optional: Add debug log
    // console.log('Swipe detected, deltaX:', deltaX);

    if (deltaX > minSwipeDistance && activeSlide > 0) {
      // Swipe right: go to previous slide
      setActiveSlide((prev) => prev - 1);
    } else if (deltaX < -minSwipeDistance && activeSlide < sliderItems.length - 1) {
      // Swipe left: go to next slide
      setActiveSlide((prev) => prev + 1);
    }

    // Reset touch coordinates
    touchStartX.current = null;
    touchEndX.current = null;
    isSwiping.current = false;
  };

  return (
    <div className="slider-container" role="region" aria-label="Top Cafes Carousel">
      <div className="slider-title">{title}</div>
      <div
        className="slider-wrapper"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {sliderItems.map((item, index) => (
          <div
            key={item.place_id || `cafe-${index}`}
            className={getSlideClass(index)}
            onMouseEnter={() => setActiveSlide(index)}
            onClick={(e) => handleImageClick(item, index, e)}
            style={{ transitionDuration: '.9s', cursor: item.place_id ? 'pointer' : 'default' }}
            role="button"
            aria-label={`View details for ${item.name}`}
          >
            <img
              src={item.photos[0]}
              alt={item.name}
              className="slider-image"
            />
            <div className="slider-caption">
              <div style={{ background: "transparent", fontSize: "0.8rem" }}>{item.name}</div>
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
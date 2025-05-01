import React, { useState, useEffect } from 'react';
import { CafeDetails } from './Body2.script';

interface EnhancedImageSliderProps {
  sliderItems: CafeDetails[];
  onCafeSelect: (cafe: CafeDetails) => void;
  title?: string;
}

const EnhancedImageSlider: React.FC<EnhancedImageSliderProps> = ({
  sliderItems,
  onCafeSelect,
  title = "Top Cafes in Dumaguete"
}) => {
  const [activeSlide, setActiveSlide] = useState(Math.min(2, sliderItems.length - 1));

  useEffect(() => {
    // Set active slide to middle or beginning
    setActiveSlide(Math.min(2, sliderItems.length - 1));
  }, [sliderItems]);

  // Get slide class based on position relative to active slide
  const getSlideClass = (index: number) => {
    if (index === activeSlide) return 'slider-item center';
    if (index === activeSlide - 1) return 'slider-item left';
    if (index === activeSlide + 1) return 'slider-item right';
    if (index < activeSlide - 1) return 'slider-item left-hidden';
    return 'slider-item right-hidden';
  };

  return (
    <div className="slider-container">
      <div className="slider-title">{title}</div>
      <div className="slider-wrapper">
        {sliderItems.map((item, index) => (
          <div
            key={item.place_id}
            className={getSlideClass(index)}
            onMouseEnter={() => setActiveSlide(index)}
            onClick={() => {
              setActiveSlide(index);
              setTimeout(() => onCafeSelect(item), 300);
            }}
            style={{ transitionDuration: '.9s' }}
          >
            <img 
              src={item.photos[0]} 
              alt={item.name} 
              className="slider-image"
            />
            <div className="slider-caption">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedImageSlider;
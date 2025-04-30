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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentCafe, setCurrentCafe] = useState<CafeDetails | null>(null);

  useEffect(() => {
    // Set active slide to middle or beginning
    setActiveSlide(Math.min(2, sliderItems.length - 1));
  }, [sliderItems]);

  // Handle slide hover
  const handleSlideHover = (index: number) => {
    setActiveSlide(index);
  };

  // Handle slide click
  const handleSlideClick = (cafe: CafeDetails, index: number) => {
    setActiveSlide(index);
    
    // Animate to center first, then perform action
    setTimeout(() => {
      setCurrentCafe(cafe);
      onCafeSelect(cafe);
    }, 300);
  };

  // Handle main image click to open lightbox
  const handleMainImageClick = () => {
    //if (sliderItems.length === 0) return;
    
   // setCurrentCafe(sliderItems[activeSlide]);
    //setLightboxIndex(0);
   // setLightboxOpen(true);
  };

  // Determine slide class based on its position relative to active slide
  const getSlideClass = (index: number) => {
    if (index === activeSlide) return 'slider-item center';
    if (index === activeSlide - 1) return 'slider-item left';
    if (index === activeSlide + 1) return 'slider-item right';
    if (index < activeSlide - 1) return 'slider-item left-hidden';
    if (index > activeSlide + 1) return 'slider-item right-hidden';
    return 'slider-item';
  };

  // Navigate to previous image in lightbox
  const handlePrevImage = () => {
    if (!currentCafe || currentCafe.photos.length <= 1) return;
    
    setLightboxIndex(prev => 
      prev > 0 ? prev - 1 : currentCafe.photos.length - 1
    );
  };

  // Navigate to next image in lightbox
  const handleNextImage = () => {
    if (!currentCafe || currentCafe.photos.length <= 1) return;
    
    setLightboxIndex(prev => 
      prev < currentCafe.photos.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <>
      {/* Image Slider */}
      <div className="slider-container">
        <div className="slider-title">{title}</div>
        <div className="slider-wrapper">
          {sliderItems.map((item, index) => (
            <div
              key={item.place_id}
              className={getSlideClass(index)}
              onMouseEnter={() => handleSlideHover(index)}
              onClick={() => handleSlideClick(item, index)}
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
        
        {/* Center image click area for lightbox */}
        {sliderItems.length > 0 && activeSlide >= 0 && (
          <div 
            className="slider-main-click-area"
            onClick={handleMainImageClick}
          />
        )}
      </div>
    </>
  );
};

export default EnhancedImageSlider;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Body2.css';
import './EnhancedComponents.css';
import { fetchTopCafes, CafeDetails, getFallbackSliderItems } from '../services/GooglePlacesService';
import AutosuggestSearch from './AutosuggestSearch';
import EnhancedImageSlider from './EnhancedImageSlider';
import { Button } from "@mui/material";

function Body2() {
    const [sliderItems, setSliderItems] = useState<CafeDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const navigate = useNavigate();
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

    const handleTagClick = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    const handleImageClick = (placeId: string, lat: number, lon: number, cafe: CafeDetails) => {
        if (!placeId || typeof placeId !== 'string' || placeId.trim() === '') {
            console.warn('Cannot navigate: Invalid placeId', {
                placeId,
                reason: !placeId ? 'Missing placeId' : 'Non-string or empty placeId',
            });
            return;
        }
        navigate(`/cafe/${placeId}`, {
            state: {
                lat: lat || 9.3076,
                lon: lon || 123.3080,
                source: 'slider',
                cafeDetails: {
                    name: cafe.name,
                    address: cafe.address,
                    rating: cafe.rating,
                    photos: cafe.photos,
                    amenities: cafe.amenities,
                },
            },
        });
    };

    return (
        <>
            <div className="hero">
                <h1 className="hero-title">Cafe Compass</h1>
                <p className="hero-subtitle">Discover the best cafes in Dumaguete City</p>
                <AutosuggestSearch placeholder="Search for coffee shops in Dumaguete" />
                <div className="tags-and-button-container">
                    <div className="tags-container">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    {selectedTags.length > 0 && (
                        <Button
                            onClick={() => navigate("/mapview", { state: { tags: selectedTags } })}
                            sx={{
                                backgroundColor: '#cd3234',
                                color: '#ffffff',
                                '&:hover': { backgroundColor: '#b02b2d' },
                                borderRadius: '20px',
                                padding: { xs: '0.3rem 1.5rem', md: '0.3rem 2rem' },
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                textTransform: 'none',
                                ml: { xs: '2vw', md: '4vw' },
                                alignSelf: 'center',
                            }}
                        >
                            Explore Map
                        </Button>
                    )}
                </div>
            </div>

            <div className="video-container">
                <div className="video-wrapper">
                    <iframe
                    className="video"
                    src="https://www.youtube.com/embed/5xAIzOlvfdE?autoplay=1&mute=1&loop=1&playlist=5xAIzOlvfdE"
                    title="Cafe Compass Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
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
                onImageClick={(placeId, lat, lon) => {
                    const cafe = sliderItems.find((item) => item.place_id === placeId);
                    if (cafe) handleImageClick(placeId, lat, lon, cafe);
                }}
            />
        </>
    );
}

export default Body2;
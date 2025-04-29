import React, { useState, useEffect, useRef } from 'react';
import { Box } from "@mui/material";
import './Body2.css';

function Body2() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredCafes, setFilteredCafes] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const tags = ['Coffee', 'Brunch', 'Pastries', 'Study Spot', 'Date Spot', 'Work-Friendly'];
    const [activeSlide, setActiveSlide] = useState(2); // Middle slide is active by default
    
    // Dumaguete coffee shops database
    const dumagueteCafes = [
        "Hemingway Cafe",
        "Kava Modern Filipino Restaurant",
        "Mulat Cafe",
        "Tuesday Cafe",
        "Overdose Coffee",
        "Foundation Coffee Shop",
        "The Artsy Corner Cafe",
        "Bean Bless Café",
        "Cafe Antonio",
        "Cafe Mamia",
        "Coffee Break Cafe",
        "Gabby's Bistro",
        "Le Chalet Cafe",
        "Sans Rival Cakes and Pastries",
        "Qyosko Cafe",
        "Books & Brews",
        "Coffee Notes",
        "Mountain Brew Coffee",
        "Why Not Cafe",
        "The Rollin' Pin"
    ];
    
    // Top cafes for the slider
    const sliderItems = [
        { id: 0, title: 'Hemingway Cafe', image: '/api/placeholder/200/150', description: 'Classic ambiance with great coffee' },
        { id: 1, title: 'Kava', image: '/api/placeholder/200/150', description: 'Modern Filipino cuisine and coffee' },
        { id: 2, title: 'Mulat Cafe', image: '/api/placeholder/200/150', description: 'Artisanal coffee and pastries' },
        { id: 3, title: 'Tuesday Cafe', image: '/api/placeholder/200/150', description: 'Cozy spot with signature drinks' },
        { id: 4, title: 'Overdose Coffee', image: '/api/placeholder/200/150', description: 'Strong coffee for true enthusiasts' }
    ];
  
    // Filter cafes based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCafes([]);
            return;
        }
        
        const filtered = dumagueteCafes.filter(cafe => 
            cafe.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCafes(filtered);
        setShowResults(true);
    }, [searchQuery]);
    
    // Handle click outside search results to close them
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim() !== '') {
            setShowResults(true);
        }
    };
  
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        setShowResults(false);
    };
    
    const handleSelectCafe = (cafe: string) => {
        setSearchQuery(cafe);
        setShowResults(false);
        console.log('Selected cafe:', cafe);
    };

    const handleSlideHover = (index: number) => {
        setActiveSlide(index);
    };

    // Determine slide class based on its position relative to active slide
    const getSlideClass = (index: number) => {
        if (index === activeSlide) return 'slider-item active';
        if (index === activeSlide - 1) return 'slider-item left';
        if (index === activeSlide + 1) return 'slider-item right';
        return 'slider-item';
    };
    
    return (
        <>
            {/* Hero Section */}
            <div className="hero">
                <h1 className="hero-title">Dumaguete Cafe Compass</h1>
                <p className="hero-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing</p>
                
                <div className="search-container" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search for coffee shops in Dumaguete"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                        onFocus={() => setShowResults(searchQuery.trim() !== '')}
                    />
                    <button type="submit" className="search-button">
                        <span className="search-icon">🔍</span>
                    </button>
                </form>
                
                {showResults && filteredCafes.length > 0 && (
                    <div className="search-results">
                        {filteredCafes.map((cafe, index) => (
                            <div 
                                key={index} 
                                className="search-result-item"
                                onClick={() => handleSelectCafe(cafe)}
                            >
                                {cafe}
                            </div>
                        ))}
                    </div>
                )}
            </div>
                
                <div className="tags-container">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Video Container */}
            <div className="video-container">
                <div className="video-wrapper">
                    <div className="video-placeholder">
                        Video Content Goes Here
                    </div>
                </div>
            </div>

            {/* Image Slider */}
            <div className="slider-container">
                <div className="slider-wrapper">
                    {sliderItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={getSlideClass(index)}
                            onMouseEnter={() => handleSlideHover(index)}
                        >
                            <div className="slider-caption">{item.title}</div>
                            <div 
                                className="slider-image"
                                style={{ 
                                    backgroundColor: index === activeSlide ? '#666' : '#aaa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {index === activeSlide && (
                                    <Box sx={{ 
                                        width: '80%', 
                                        height: '80%', 
                                        backgroundColor: '#444',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        padding: '8px',
                                        textAlign: 'center',
                                        fontSize: '0.9rem'
                                    }}>
                                        {item.description}
                                    </Box>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Body2;
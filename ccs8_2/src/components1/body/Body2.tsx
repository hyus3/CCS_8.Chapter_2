import React, { useState, useEffect, useRef } from 'react';
import { Box, Modal, Typography, Rating, Chip } from "@mui/material";
import './Body2.css';
import './Body2.modal.css';
import './EnhancedComponents.css'; // Import the new CSS
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  CafeDetails,
  getFallbackSliderItems
} from './Body2.script';

// Import our new components
import AutosuggestSearch from './AutosuggestSearch';
import EnhancedImageSlider from './EnhancedImageSlider';

// Import our new Geoapify service
import { 
  fetchTopCafes,
  fetchCafeDetails
} from './GeopifyService'

function Body2() {
    // Store the map instance
    const mapRef = useRef<L.Map | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const [selectedCafe, setSelectedCafe] = useState<CafeDetails | null>(null);
    const [showCafeModal, setShowCafeModal] = useState(false);
    const [sliderItems, setSliderItems] = useState<CafeDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const tags = ['Coffee', 'Brunch', 'Pastries', 'Study Spot', 'Date Spot', 'Work-Friendly'];

    // Load top-rated cafes for the slider when component mounts
    useEffect(() => {
        loadTopCafes();
    }, []);

    // Load top cafes
    const loadTopCafes = () => {
        setIsLoading(true);
        fetchTopCafes(
            // Success callback
            (cafes) => {
                setSliderItems(cafes);
                setIsLoading(false);
            },
            // Error callback
            (error) => {
                console.error(error);
                // If API fails, use placeholder data
                setSliderItems(getFallbackSliderItems());
                setIsLoading(false);
            }
        );
    };
    
    // Load detailed information for a cafe
    const loadCafeDetails = (placeId: string) => {
        setIsLoading(true);
        fetchCafeDetails(
            placeId,
            // Success callback
            (cafeDetails) => {
                setSelectedCafe(cafeDetails);
                setShowCafeModal(true);
                setIsLoading(false);
            },
            // Error callback
            (error) => {
                console.error(error);
                setIsLoading(false);
            }
        );
    };

    // Handle selecting a cafe for details modal
    const handleCafeSelect = (cafe: CafeDetails) => {
        setSelectedCafe(cafe);
        setShowCafeModal(true);
    };
    
    // Close modal
    const handleCloseModal = () => {
        setShowCafeModal(false);
    };
    
    return (
        <>
            {/* Hero Section */}
            <div className="hero">
                <h1 className="hero-title">Dumaguete Cafe Compass</h1>
                <p className="hero-subtitle">Discover the best cafes in Dumaguete City</p>
                
                {/* Enhanced Autosuggest Search Component */}
                <AutosuggestSearch 
                    onCafeSelect={(placeId) => loadCafeDetails(placeId)}
                    placeholder="Search for coffee shops in Dumaguete"
                />
                
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

            {/* Loading Indicator */}
            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner">Loading...</div>
                </div>
            )}

            {/* Enhanced Image Slider */}
            <EnhancedImageSlider 
                sliderItems={sliderItems} 
                onCafeSelect={handleCafeSelect}
                title="Top Cafes in Dumaguete"
            />
            
            {/* Cafe Details Modal */}
            <Modal
                open={showCafeModal}
                onClose={handleCloseModal}
                aria-labelledby="cafe-details-modal"
                className="cafe-modal"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {xs: '90%', sm: '80%', md: '60%'},
                    maxWidth: '700px',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 4,
                    maxHeight: '90vh',
                    overflow: 'auto'
                }}>
                    {selectedCafe && (
                        <>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {selectedCafe.name}
                            </Typography>
                            
                            <Box display="flex" alignItems="center" mb={1}>
                                <Rating 
                                    value={selectedCafe.rating} 
                                    precision={0.5} 
                                    readOnly 
                                />
                                <Typography ml={1} variant="body2">
                                    {selectedCafe.rating} / 5
                                </Typography>
                            </Box>
                            
                            <Typography variant="body1" gutterBottom>
                                {selectedCafe.address}
                            </Typography>
                            
                            {selectedCafe.phoneNumber && (
                                <Typography variant="body2" gutterBottom>
                                    {selectedCafe.phoneNumber}
                                </Typography>
                            )}
                            
                            {selectedCafe.website && (
                                <Typography variant="body2" gutterBottom>
                                    <a href={selectedCafe.website} target="_blank" rel="noopener noreferrer">
                                        Visit Website
                                    </a>
                                </Typography>
                            )}
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                                {selectedCafe.amenities.map((amenity, index) => (
                                    <Chip 
                                        key={index} 
                                        label={amenity} 
                                        size="small" 
                                        variant="outlined" 
                                    />
                                ))}
                                
                                {selectedCafe.openNow !== undefined && (
                                    <Chip 
                                        label={selectedCafe.openNow ? "Open Now" : "Closed"} 
                                        color={selectedCafe.openNow ? "success" : "error"}
                                        size="small"
                                    />
                                )}
                                
                                {selectedCafe.priceLevel !== undefined && (
                                    <Chip 
                                        label={'$'.repeat(selectedCafe.priceLevel || 1)} 
                                        size="small" 
                                    />
                                )}
                            </Box>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                mt: 3,
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                {selectedCafe.photos.map((photo, index) => (
                                    <Box 
                                        key={index} 
                                        component="img" 
                                        src={photo}
                                        alt={`${selectedCafe.name} photo ${index + 1}`}
                                        sx={{ 
                                            width: '100%', 
                                            maxWidth: '200px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: 1
                                        }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default Body2;
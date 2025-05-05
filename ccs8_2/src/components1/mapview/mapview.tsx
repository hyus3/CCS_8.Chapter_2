import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCafesByTags, CafeDetails } from '../services/GooglePlacesServices2';

const DUMAGUETE_CENTER = { lat: 9.3076, lng: 123.3080 };
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

const CafeCarousel: React.FC<{
    cafes: CafeDetails[];
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    navigate: (path: string, options?: { state?: any }) => void;
}> = ({ cafes, setCurrentIndex, navigate }) => {
    const [currentIndex, setLocalIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState<string>('');

    const handleNext = () => {
        setLocalIndex((prev) => {
            const newIndex = (prev + 1) % cafes.length;
            setCurrentIndex(newIndex);
            return newIndex;
        });
    };

    const handlePrev = () => {
        setLocalIndex((prev) => {
            const newIndex = (prev - 1 + cafes.length) % cafes.length;
            setCurrentIndex(newIndex);
            return newIndex;
        });
    };

    // Update image source when currentIndex changes
    useEffect(() => {
        const cafe = cafes[currentIndex];
        if (cafe && cafe.photos && cafe.photos.length > 0) {
            setImageSrc(cafe.photos[0]);
        } else {
            setImageSrc(PLACEHOLDER_IMAGE);
        }
    }, [currentIndex, cafes]);

    // Handle card click to navigate to CafeView
    const handleCardClick = (cafe: CafeDetails) => {
        if (!cafe.place_id || typeof cafe.place_id !== 'string' || cafe.place_id.trim() === '') {
            console.warn('Cannot navigate: Invalid placeId', {
                placeId: cafe.place_id,
                reason: !cafe.place_id ? 'Missing placeId' : 'Non-string or empty placeId',
            });
            return;
        }
        navigate(`/cafe/${cafe.place_id}`, {
            state: {
                lat: cafe.lat || DUMAGUETE_CENTER.lat,
                lon: cafe.lng || DUMAGUETE_CENTER.lng,
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

    if (cafes.length === 0) {
        return <Typography sx={{ fontFamily: 'Inter, sans-serif', color: '#2d2d2d' }}>
            No cafes found for selected tags.
        </Typography>;
    }

    const cafe = cafes[currentIndex];

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '100vw', height: { xs: '300px', md: '350px' } }}>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                onClick={() => handleCardClick(cafe)}
            >
                <img
                    src={imageSrc}
                    alt={cafe.name}
                    onError={() => setImageSrc(PLACEHOLDER_IMAGE)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: { xs: '8px', md: '12px' },
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        color: '#ffffff',
                        textShadow: { xs: '0 0 4px rgba(0,0,0,0.7)', md: '0 0 6px rgba(0,0,0,0.7)' },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: { xs: '16px', md: '20px' },
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                        }}
                    >
                        {cafe.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '12px', md: '14px' },
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        {cafe.address}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '12px', md: '14px' },
                            fontFamily: 'Inter, sans-serif',
                            color: '#cd3234', // Highlight rating
                        }}
                    >
                        Rating: {cafe.rating || 'N/A'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '12px', md: '14px' },
                            fontFamily: 'Inter, sans-serif',
                        }}
                    >
                        Amenities: {cafe.amenities.join(', ') || 'None'}
                    </Typography>
                </Box>
            </Box>
            <Button
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#cd3234',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#b02b2d' },
                    borderRadius: '50%',
                    minWidth: { xs: '36px', md: '40px' },
                    width: { xs: '36px', md: '40px' },
                    height: { xs: '36px', md: '40px' },
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
            >
                <ArrowBack sx={{ fontSize: { xs: '20px', md: '24px' } }} />
            </Button>
            <Button
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#cd3234',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#b02b2d' },
                    borderRadius: '50%',
                    minWidth: { xs: '36px', md: '40px' },
                    width: { xs: '36px', md: '40px' },
                    height: { xs: '36px', md: '40px' },
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
            >
                <ArrowForward sx={{ fontSize: { xs: '20px', md: '24px' } }} />
            </Button>
            <Typography
                sx={{
                    textAlign: 'center',
                    mt: '8px',
                    fontSize: { xs: '14px', md: '16px' },
                    fontFamily: 'Inter, sans-serif',
                    color: '#2d2d2d',
                }}
            >
                {currentIndex + 1} of {cafes.length}
            </Typography>
        </Box>
    );
};

function MapView() {
    const location = useLocation();
    const navigate = useNavigate();
    const tags = (location.state as { tags?: string[] })?.tags || [];
    const mapRef = useRef<HTMLDivElement>(null);
    const [cafes, setCafes] = useState<CafeDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scriptRef = useRef<HTMLScriptElement | null>(null);

    useEffect(() => {
        if (!API_KEY) {
            console.error('Google Maps API key is missing');
            setIsLoading(false);
            return;
        }

        // Dynamically load Google Maps API
        const loadGoogleMaps = () => {
            if (window.google && window.google.maps) {
                initializeMap();
                return;
            }

            scriptRef.current = document.createElement('script');
            scriptRef.current.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
            scriptRef.current.async = true;
            scriptRef.current.defer = true;
            document.body.appendChild(scriptRef.current);

            // Define global callback
            (window as any).initMap = () => {
                initializeMap();
            };
        };

        const initializeMap = () => {
            if (!mapRef.current) {
                console.error('Map container missing');
                setIsLoading(false);
                return;
            }

            // Initialize Google Map with locked interaction
            const googleMap = new google.maps.Map(mapRef.current, {
                center: DUMAGUETE_CENTER,
                zoom: 15,
                mapTypeId: 'roadmap',
                disableDefaultUI: true, // Disable all default UI controls
                draggable: false, // Prevent dragging/panning
                scrollwheel: false, // Disable zoom on scroll
                gestureHandling: 'none', // Disable all gestures
                keyboardShortcuts: false, // Disable keyboard controls
            });
            setMap(googleMap);

            // Fetch cafes based on tags
            fetchCafesByTags(tags, googleMap)
                .then((fetchedCafes) => {
                    setCafes(fetchedCafes);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching cafes:', error);
                    setIsLoading(false);
                });
        };

        loadGoogleMaps();

        // Cleanup on unmount
        return () => {
            if (scriptRef.current && document.body.contains(scriptRef.current)) {
                document.body.removeChild(scriptRef.current);
            }
            (window as any).initMap = undefined;
            setMap(null);
            if (marker) {
                marker.setMap(null);
                setMarker(null);
            }
        };
    }, [tags]);

    // Update marker when currentIndex or cafes change
    useEffect(() => {
        if (!map || !cafes.length) return;

        // Clear existing marker
        if (marker) {
            marker.setMap(null);
            setMarker(null);
        }

        // Add marker for current cafe
        const cafe = cafes[currentIndex];
        if (cafe) {
            const newMarker = new google.maps.Marker({
                position: { lat: cafe.lat, lng: cafe.lng },
                map,
                title: cafe.name,
            });

            // Info window for marker click
            const infoWindow = new google.maps.InfoWindow({
                content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif;">
            <h3 style="margin: 0 0 8px; color: #2d2d2d;">${cafe.name}</h3>
            <p style="margin: 4px 0;">${cafe.address}</p>
            <p style="margin: 4px 0; color: #cd3234;">Rating: ${cafe.rating || 'N/A'}</p>
            <p style="margin: 4px 0;">Amenities: ${cafe.amenities.join(', ') || 'None'}</p>
          </div>
        `,
            });

            newMarker.addListener('click', () => {
                infoWindow.open(map, newMarker);
            });

            setMarker(newMarker);

            // Pan map to cafe location
            map.panTo({ lat: cafe.lat, lng: cafe.lng });
        }
    }, [currentIndex, cafes, map]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                height: '100%',
                width: '100%',
                backgroundColor: '#eeeae4', // Light beige background
            }}
        >
            {/* Map Container */}
            <Box
                sx={{
                    flex: { xs: 'none', md: 2 }, // Reduced flex to make map smaller
                    height: { xs: '40vh', md: '500px' }, // Smaller fixed height
                    width: '100%',
                }}
            >
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </Box>

            {/* Sidebar with Carousel */}
            <Box
                sx={{
                    flex: { xs: 'none', md: 1 },
                    width: { xs: '100vw', md: '100%' },
                    backgroundColor: '#ffffff', // White sidebar for contrast
                    overflowY: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        fontSize: { xs: '20px', md: '24px' },
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        color: '#2d2d2d',
                    }}
                >
                    Cafes in Dumaguete
                </Typography>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                        <CircularProgress sx={{ color: '#cd3234' }} />
                    </Box>
                ) : (
                    <CafeCarousel cafes={cafes} setCurrentIndex={setCurrentIndex} navigate={navigate} />
                )}
            </Box>
        </Box>
    );
}

export default MapView;
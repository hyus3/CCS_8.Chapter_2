import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchCafesByTags, CafeDetails } from '../services/GooglePlacesServices2';
import '../coffeeprofiles/CoffeeProfiles.css'

const DUMAGUETE_CENTER = { lat: 9.3076, lng: 123.3080 };
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

const CafeCarousel: React.FC<{
    cafes: CafeDetails[];
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    navigate: (path: string, options?: { state?: any }) => void;
}> = ({ cafes, setCurrentIndex, navigate }) => {
    const [currentIndex, setLocalIndex] = useState(0);

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
        return (
            <Typography sx={{ fontFamily: 'Inter, sans-serif', color: '#2d2d2d' }}>
                No cafes found.
            </Typography>
        );
    }

    const prevIndex = (currentIndex - 1 + cafes.length) % cafes.length;
    const nextIndex = (currentIndex + 1) % cafes.length;
    const displayedCafes = [cafes[prevIndex], cafes[currentIndex], cafes[nextIndex]];

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '80vw',
                height: { xs: '200px', sm: '300px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                justifySelf: 'center',
            }}
        >
            {displayedCafes.map((cafe, index) => {
                const isMain = index === 1;
                const imageSrc = cafe.photos && cafe.photos.length > 0 ? cafe.photos[0] : PLACEHOLDER_IMAGE;

                return (
                    <Box
                        key={cafe.place_id}
                        sx={{
                            width: isMain ? { xs: '60%', md: '40%' } : { xs: '20%', md: '25%' },
                            height: isMain ? '80%' : '60%',
                            mx: 1,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transform: isMain ? 'scale(1)' : 'scale(0.9)',
                            transition: 'transform 0.3s ease',
                            opacity: isMain ? 1 : 0.7,
                        }}
                        onClick={() => handleCardClick(cafe)}
                    >
                        <img
                            src={imageSrc}
                            alt={cafe.name}
                            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
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
                                    fontSize: isMain ? { xs: '16px', md: '20px' } : { xs: '12px', md: '16px' },
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600,
                                }}
                            >
                                {cafe.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: isMain ? { xs: '12px', md: '14px' } : { xs: '10px', md: '12px' },
                                    fontFamily: 'Inter, sans-serif',
                                    color: '#cd3234',
                                }}
                            >
                                Rating: {cafe.rating || 'N/A'}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: isMain ? { xs: '12px', md: '14px' } : { xs: '10px', md: '12px' },
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                Amenities: {cafe.amenities.join(', ') || 'None'}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
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
        </Box>
    );
};

function AllCafesView() {
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement>(null);
    const [cafes, setCafes] = useState<CafeDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scriptRef = useRef<HTMLScriptElement | null>(null);

    useEffect(() => {
        console.log('AllCafesView mounted, API_KEY:', API_KEY);
        if (!API_KEY) {
            console.error('Google Maps API key is missing');
            setIsLoading(false);
            return;
        }

        const loadGoogleMaps = () => {
            if (window.google && window.google.maps) {
                console.log('Google Maps API already loaded');
                initializeMap();
                return;
            }

            scriptRef.current = document.createElement('script');
            scriptRef.current.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
            scriptRef.current.async = true;
            scriptRef.current.defer = true;
            scriptRef.current.onerror = () => {
                console.error('Failed to load Google Maps script');
                setIsLoading(false);
            };
            document.body.appendChild(scriptRef.current);

            (window as any).initMap = () => {
                console.log('initMap callback triggered');
                initializeMap();
            };
        };

        const initializeMap = () => {
            if (!mapRef.current) {
                console.error('Map container missing');
                setIsLoading(false);
                return;
            }
            if (!window.google || !window.google.maps) {
                console.error('Google Maps API not loaded');
                setIsLoading(false);
                return;
            }

            console.log('Initializing map');
            const googleMap = new google.maps.Map(mapRef.current, {
                center: DUMAGUETE_CENTER,
                zoom: 15,
                mapTypeId: 'roadmap',
                disableDefaultUI: true,
                draggable: false,
                scrollwheel: false,
                gestureHandling: 'none',
                keyboardShortcuts: false,
            });
            setMap(googleMap);

            console.log('Fetching cafes');
            fetchCafesByTags([], googleMap)
                .then((fetchedCafes) => {
                    console.log('Cafes fetched:', fetchedCafes);
                    setCafes(fetchedCafes);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching cafes:', error);
                    setIsLoading(false);
                });
        };

        loadGoogleMaps();

        return () => {
            console.log('Cleaning up AllCafesView');
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
    }, []);

    useEffect(() => {
        if (!map || !cafes.length) return;

        if (marker) {
            marker.setMap(null);
            setMarker(null);
        }

        const cafe = cafes[currentIndex];
        if (cafe) {
            console.log('Setting marker for cafe:', cafe.name);
            const newMarker = new google.maps.Marker({
                position: { lat: cafe.lat, lng: cafe.lng },
                map,
                title: cafe.name,
            });

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
            map.panTo({ lat: cafe.lat, lng: cafe.lng });
        }
    }, [currentIndex, cafes, map]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column' },
                height: '100%',
                width: '100%',
                position: 'relative',
                backgroundColor: '#eeeae4',
                marginBottom : '300px',
            }}
        >
            <Box
                sx={{
                    margin: '0 auto',
                    maxWidth: '1200px',
                    padding: '60px 1rem',
                    width: '100%'
                }}>
                <Typography variant='h5' sx={{color: '#cd3234', fontWeight: 'bold'}}>Explore</Typography>
                <Typography variant='h3' sx={{color: '#000000', fontWeight: 'semi-bold'}}>Cafes near you</Typography>
            </Box>
            <Box
                sx={{
                    flex: { xs: 'none', md: 2 },
                    minHeight: { xs: '60vh' }, // Adjusted for testing
                    width: '100%',
                }}
            >
                <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '60vh' }} />
            </Box>
            <Box
                sx={{
                    flex: { xs: 'none', md: 1 },
                    width: { xs: '100vw', md: '100%' },
                    position: 'absolute',
                    top: '100%',
                    justifyContent: 'center'
                }}
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center',}}>
                        <CircularProgress sx={{ color: '#cd3234' }} />
                    </Box>
                ) : (
                    <CafeCarousel cafes={cafes} setCurrentIndex={setCurrentIndex} navigate={navigate} />
                )}
            </Box>
        </Box>
    );
}

export default AllCafesView;
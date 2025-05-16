import { Typography, Avatar, Box, Container, Card, CardContent, CardMedia } from "@mui/material";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from '../../firebase'; // Assuming you have Firebase initialized
import { collection, query, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import BreadcrumbsComponent from "../navbar/BreadcrumbsComponent";
import { fetchCafeDetailsById, CafeDetails as ServiceCafeDetails } from '../services/GooglePlacesService';

type ProfileProps = {
    user: User | null;
};

type CafeDetails = {
    place_id: string;
    name: string;
    address: string;
    rating: number | null;
    photos: string[];
    lat?: number;
    lon?: number;
    amenities?: string[];
};

const DUMAGUETE_COORDINATES = { lat: 9.3076, lng: 123.3080 };

function Profile({ user }: ProfileProps) {
    const [freshUser, setFreshUser] = useState<User | null>(user);
    const [photoUrl, setPhotoUrl] = useState<string>("");
    const [favoriteCafes, setFavoriteCafes] = useState<CafeDetails[]>([]);
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Profile' },
    ];

    // Function to fetch favorite cafes from Firestore and their details from Places API
    const fetchFavoriteCafes = async () => {
        if (user) {
            const userFavoritesRef = collection(db, "users", user.uid, "favorites");
            const q = query(userFavoritesRef);
            const querySnapshot = await getDocs(q);
            const cafeData: CafeDetails[] = [];

            // Fetch details for each cafe using fetchCafeDetailsById
            for (const doc of querySnapshot.docs) {
                const cafe = doc.data();
                const placeId = cafe.placeId;
                if (placeId) {
                    const details = await fetchCafeDetailsById(placeId);
                    if (details) {
                        cafeData.push({
                            place_id: details.place_id,
                            name: details.name,
                            address: details.address,
                            rating: details.rating,
                            photos: details.photos,
                            lat: details.lat,
                            lon: details.lon,
                            amenities: details.amenities,
                        });
                    } else {
                        console.warn(`[Profile] Failed to fetch details for place_id: ${placeId}`);
                    }
                }
            }

            setFavoriteCafes(cafeData);
        }
    };

    // High-res photo function for user profile
    const getHighResPhoto = (url: string | null | undefined, size: number = 400): string => {
        if (!url) return "";
        return url.replace(/=s\d+-c$/, `=s${size}-c`);
    };

    // Handle cafe card click to navigate to cafe view
    const handleCafeClick = (cafe: CafeDetails) => {
        if (!cafe.place_id || typeof cafe.place_id !== 'string' || cafe.place_id.trim() === '') {
            console.warn('[Profile] Invalid place_id for cafe:', { name: cafe.name, place_id: cafe.place_id });
            return;
        }
        navigate(`/cafe/${cafe.place_id}`, {
            state: {
                lat: cafe.lat || DUMAGUETE_COORDINATES.lat,
                lon: cafe.lon || DUMAGUETE_COORDINATES.lng,
                source: 'profile',
                cafeDetails: {
                    name: cafe.name,
                    address: cafe.address,
                    rating: cafe.rating,
                    photos: cafe.photos.length > 0 ? cafe.photos : ['https://via.placeholder.com/400x300?text=No+Image'],
                    amenities: cafe.amenities || [],
                },
            },
        });
    };

    // Effect to reload user data and fetch favorite cafes
    useEffect(() => {
        const refreshUser = async () => {
            if (user) {
                await user.reload(); // Fetch updated info
                const updatedUser = { ...user };
                setFreshUser(updatedUser);
                setPhotoUrl(getHighResPhoto(updatedUser.photoURL)); // Refresh image

                // Fetch favorite cafes
                fetchFavoriteCafes();
            }
        };
        refreshUser();
    }, [user?.photoURL]);

    if (!freshUser) {
        return (
            <Container
                sx={{
                    maxWidth: '1400px !important',
                    minHeight: '100vh',
                    bgcolor: '#eeeae4',
                    p: { xs: 2, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontFamily: 'Helvetica',
                }}
            >
                <BreadcrumbsComponent items={breadcrumbItems} />
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        p: 2,
                        backgroundColor: 'transparent',
                        border: '1px solid #110203',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        color: '#666',
                        fontFamily: 'Helvetica',
                        fontWeight: 500,
                        maxWidth: 600,
                        mx: 'auto',
                        mt: 4,
                    }}
                >
                    Please log in to view your profile.
                </Typography>
            </Container>
        );
    }

    const fullName = freshUser.displayName || "Anonymous User";

    return (
        <Container
            sx={{
                maxWidth: '1400px !important',
                minHeight: '100vh',
                bgcolor: '#eeeae4',
                p: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "Helvetica",
            }}
        >
            <BreadcrumbsComponent items={breadcrumbItems} />
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 4,
                        gap: 2,
                    }}
                >
                    <Avatar
                        src={photoUrl || "https://via.placeholder.com/150?text=No+Image"}
                        sx={{
                            width: { xs: 120, sm: 160, md: 180 },
                            height: { xs: 120, sm: 160, md: 180 },
                            border: '4px solid #fff',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                            fontWeight: 700,
                            color: '#6e4e33',
                            textAlign: 'center',
                        }}
                    >
                        {fullName}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(auto-fill, minmax(280px, 1fr))',
                            md: 'repeat(auto-fill, minmax(300px, 1fr))',
                        },
                        gap: { xs: 2, sm: 3 },
                        width: '100%',
                        maxWidth: '1200px',
                    }}
                >
                    {favoriteCafes.length > 0 ? (
                        favoriteCafes.map((cafe) => (
                            <Card
                                key={cafe.place_id}
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid #110203',
                                    backgroundColor: "transparent",
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                                onClick={() => handleCafeClick(cafe)}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        height: { xs: 120, sm: 140, md: 150 },
                                        objectFit: 'cover',
                                    }}
                                    image={cafe.photos.length > 0 ? cafe.photos[0] : "https://via.placeholder.com/400x300?text=No+Image"}
                                    alt={cafe.name}
                                    onError={(e) => console.error(`[Profile] Image failed to load for ${cafe.name}:`, cafe.photos[0])}
                                />
                                <CardContent
                                    sx={{
                                        p: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontSize: { xs: '1rem', sm: '1.3rem' },
                                            fontWeight: 600,
                                            color: '#6e4e33',
                                            mb: 1,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {cafe.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: { xs: '0.7rem', sm: '0.9rem' },
                                            color: '#4a3b2e',
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {cafe.address}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Box
                            sx={{
                                gridColumn: '1 / -1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: 200,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: 'center',
                                    backgroundColor: 'transparent',
                                    color: '#666',
                                    fontFamily: "Helvetica",
                                    fontWeight: 500,
                                    maxWidth: 500,
                                }}
                            >
                                You have no favorite cafes yet.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
}

export default Profile;
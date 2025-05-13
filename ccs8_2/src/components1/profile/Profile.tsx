import { Typography, Avatar, Box, Container, Card, CardContent, CardMedia } from "@mui/material";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from '../../firebase'; // Assuming you have Firebase initialized
import { collection, query, getDocs } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

type ProfileProps = {
    user: User | null;
};

type CafeDetails = {
    place_id: string;
    name: string;
    address: string;
    rating: number;
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

    // Function to fetch favorite cafes from Firestore
    const fetchFavoriteCafes = async () => {
        if (user) {
            const userFavoritesRef = collection(db, "users", user.uid, "favorites");
            const q = query(userFavoritesRef);

            const querySnapshot = await getDocs(q);
            const cafeData: CafeDetails[] = [];

            querySnapshot.forEach((doc) => {
                const cafe = doc.data();
                cafeData.push({
                    place_id: cafe.placeId,
                    name: cafe.name,
                    address: cafe.address,
                    rating: cafe.rating || 0,
                    photos: cafe.photos || [],
                    lat: cafe.lat,
                    lon: cafe.lon,
                    amenities: cafe.amenities || [],
                });
            });

            setFavoriteCafes(cafeData);
        }
    };

    // High-res photo function
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
                    fontFamily: "Helvetica",
                    fontWeight: 500,
                    maxWidth: 600,
                    mx: 'auto',
                    mt: 4,
                }}
            >
                Please log in to view your profile.
            </Typography>
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
                alignItems: 'center',
                fontFamily: "Helvetica",
            }}
        >
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
                    src={photoUrl || "broken-image.jpg"}
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
                            {cafe.photos.length > 0 ? (
                                <CardMedia
                                    component="img"
                                    sx={{
                                        height: { xs: 120, sm: 140, md: 150 },
                                        objectFit: 'cover',
                                    }}
                                    image={cafe.photos[0]}
                                    alt={cafe.name}
                                />
                            ) : (
                                <CardMedia
                                    component="img"
                                    sx={{
                                        height: { xs: 140, sm: 160, md: 180 },
                                        objectFit: 'cover',
                                    }}
                                    image="broken-image.jpg"
                                    alt="Default Image"
                                />
                            )}
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
                            gridColumn: '1 / -1', // span entire row
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200, // adjust based on how much space you want
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
        </Container>
    );
}

export default Profile;
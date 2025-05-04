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
        return <Typography variant="h6">Please log in to view your profile.</Typography>;
    }

    const fullName = freshUser.displayName || "Anonymous User";

    return (
        <Container sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            mt: 4,
            justifyContent: "center",
            minHeight: "60vh"
        }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: { xs: "100%", sm: "20vw" }, mb: 4 }}>
                <Avatar
                    src={photoUrl || "broken-image.jpg"}
                    sx={{ width: 200, height: 200, mb: 2 }}
                />
                <Typography variant="h5">{fullName}</Typography>
            </Box>

            {/* Display Favorite Cafes in Cards */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                gap: 3,
                width: "100%",
                justifyItems: "center",
            }}>
                {favoriteCafes.length > 0 ? (
                    favoriteCafes.map((cafe) => (
                        <Card
                            key={cafe.place_id}
                            sx={{
                                maxWidth: 345,
                                borderRadius: 10,
                                width: "100%",
                                height: "auto", // Adjust height to auto for better responsiveness
                                boxShadow: 3,
                            }}
                            onClick={() => handleCafeClick(cafe)}
                        >
                            {cafe.photos.length > 0 ? (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={cafe.photos[0]}
                                    alt={cafe.name}
                                />
                            ) : (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="broken-image.jpg"
                                    alt="Default Image"
                                />
                            )}

                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {cafe.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {cafe.address}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="h6">You have no favorite cafes yet.</Typography>
                )}
            </Box>
        </Container>
    );
}

export default Profile;

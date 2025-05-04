import { Typography, Avatar, Box, Container } from "@mui/material";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

type ProfileProps = {
    user: User | null;
};

function getHighResPhoto(url: string | null | undefined, size: number = 400) {
    if (!url) return "";
    return url.replace(/=s\d+-c$/, `=s${size}-c`);
}

function Profile({ user }: ProfileProps) {
    const [freshUser, setFreshUser] = useState<User | null>(user);
    const [photoUrl, setPhotoUrl] = useState<string>("");

    useEffect(() => {
        const refreshUser = async () => {
            if (user) {
                await user.reload(); // Fetch updated info
                const updatedUser = { ...user };
                setFreshUser(updatedUser);
                setPhotoUrl(getHighResPhoto(updatedUser.photoURL)); // Refresh image
            }
        };
        refreshUser();
    }, [user?.photoURL]); // Re-run when user or photoURL changes

    if (!freshUser) {
        return <Typography variant="h6">Please log in to view your profile.</Typography>;
    }

    const fullName = freshUser.displayName || "Anonymous User";

    return (
        <Container>
            <Box display="flex" flexDirection="column" alignItems="flex-start" mt={6}>
                <Avatar
                    src={photoUrl || "/default-avatar.png"}
                    alt={fullName}
                    sx={{ width: 200, height: 200, mb: 2 }}
                />
                <Typography variant="h5">{fullName}</Typography>
            </Box>
        </Container>
    );
}

export default Profile;

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

    useEffect(() => {
        const refreshUser = async () => {
            if (user) {
                await user.reload(); // Force Firebase to fetch updated user data
                setFreshUser({ ...user }); // Set a new reference to trigger re-render
            }
        };
        refreshUser();
    }, [user]);

    if (!freshUser) {
        return <Typography variant="h6">Please log in to view your profile.</Typography>;
    }

    const highResPhoto = getHighResPhoto(freshUser.photoURL);
    const fullName = freshUser.displayName || "Anonymous User";

    return (
        <Container>
            <Box display="flex" flexDirection="column" alignItems="flex-start" mt={6}>
                <Avatar
                    src={highResPhoto || "/default-avatar.png"}
                    alt={fullName}
                    sx={{ width: 200, height: 200, mb: 2 }}
                />
                <Typography variant="h5">{fullName}</Typography>
            </Box>
        </Container>
    );
}

export default Profile;

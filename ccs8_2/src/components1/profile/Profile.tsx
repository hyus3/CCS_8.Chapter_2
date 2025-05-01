import { Typography, Avatar, Box, Container } from "@mui/material";
import { User } from "firebase/auth";

type ProfileProps = {
    user: User | null;
};

function getHighResPhoto(url: string | null | undefined, size: number = 400) {
    if (!url) return "";
    return url.replace(/=s\d+-c$/, `=s${size}-c`);
}

function Profile({ user }: ProfileProps) {
    if (!user) {
        return <Typography variant="h6">Please log in to view your profile.</Typography>;
    }

    const highResPhoto = getHighResPhoto(user.photoURL);

    // Extract all but the last name
    const fullName = user.displayName ? user.displayName.split(" ").slice(0, -1).join(" ") : "";

    return (
        <Container>
            <Box display="flex" flexDirection="column" alignItems="flex-start" mt={6}>
                <Avatar src={highResPhoto} alt={fullName} sx={{ width: 200, height: 200, mb: 2 }} />
                <Typography variant="h5">{fullName}</Typography>
            </Box>
        </Container>
    );
}

export default Profile;

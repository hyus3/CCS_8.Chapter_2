import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

type ProfileIconProps = {
    loggedIn: boolean;
    photoURL?: string | null;
};

function ProfileIcon({ loggedIn, photoURL }: ProfileIconProps) {
    const location = useLocation();
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (loggedIn && photoURL) {
            // Force update the image by appending a unique query parameter to bust cache
            setAvatarUrl(photoURL + `?t=${new Date().getTime()}`);
        } else {
            setAvatarUrl(undefined); // Default if not logged in
        }
    }, [location.pathname, loggedIn, photoURL]);

    const showPhoto = loggedIn && avatarUrl;

    return (
        <Avatar
            src={showPhoto ? avatarUrl : undefined}
            alt={showPhoto ? "User profile photo" : "Default user icon"}
            sx={{
                width: 40,
                height: 40,
                bgcolor: !showPhoto ? "grey.400" : "transparent",
            }}
        >
            {!showPhoto && <PersonIcon />}
        </Avatar>
    );
}

export default ProfileIcon;

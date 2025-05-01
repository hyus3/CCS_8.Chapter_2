import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

type ProfileIconProps = {
    loggedIn: boolean;
    photoURL?: string | null;
};

function ProfileIcon({ loggedIn, photoURL }: ProfileIconProps) {
    const showPhoto = loggedIn && photoURL;

    return (
        <Avatar
            src={showPhoto ? photoURL ?? undefined : undefined}
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

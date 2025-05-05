import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function ProfileIcon() {
    return (
        <Avatar
            src="/broken-image.jpg"
            alt="Profile"
            sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                border: "2px solid #cd3234",
                backgroundColor: '#ffffff',
                '&:hover': { borderColor: '#b02b2d' },
                transition: 'border-color 0.2s ease',
            }}
        >
            <PersonIcon sx={{ color: '#cd3234', fontSize: { xs: '24px', sm: '28px' } }} />
        </Avatar>
    );
}

export default ProfileIcon;
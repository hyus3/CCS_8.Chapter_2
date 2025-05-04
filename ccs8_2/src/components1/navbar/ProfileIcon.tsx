import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


function ProfileIcon() {
    return (
        <Avatar
            src="/broken-image.jpg"
            alt=""
            sx={{
                width: 50,
                height: 50,
                border: "2px solid #6e4e33",
            }}
        />
    );
}

export default ProfileIcon;

import NavBtn from "./NavBtn";
import {Box, Button, Menu, MenuItem, Tooltip} from "@mui/material";
import ProfileIcon from "./ProfileIcon";
import Hamburger from "./Hamburger";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type props = {
    loggedIn: boolean;
    setLoggedin: (value: boolean) => void;
    userPhoto?: string | null;
};

function NavBar(prop: props) {
    const btns = ["Home", "About Us", "Coffee Profiles", "Contact Us", "FAQs" ];
    const path = ["", "aboutus", "coffeeprofiles", "contactus", "faq"];
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLoginClick = () => {
        handleMenuClose();
        navigate("/login"); // login.tsx is routed here per your earlier config
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate("/profile");
    };

    const handleLogoutClick = () => {
        navigate(path[0])
        handleMenuClose();
        prop.setLoggedin(false);// updates login state
    };

    return (
        <Box
            sx={{
                maxWidth: "1200px",
                margin: "0 auto",
                direction: "row",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "10vh",
                my: 5,
            }}
        >
            <Box
                sx={{
                    display: { xs: "flex", md: "flex", lg: "none" },
                    justifyContent: "left",
                    width: "10vw",
                }}
            >
            <Tooltip title="Menu">
                <Hamburger path={path}/>
            </Tooltip>
            </Box>

            <Box
                sx={{
                    direction: "row",
                    width: "75%",
                    display: { xs: "none", md: "none", lg: "flex" },
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {btns.map((btn, index) => (
                    <NavBtn
                        key={index}
                        name={btn}
                        path={"/" + path[index]}
                        onClick={() => {}}
                    />
                ))}
            </Box>

            <Box
                sx={{
                    width: { xs: "auto", sm: "auto" },
                    height: { xs: "10vw", sm: "5vw" },
                    display: "flex",
                }}
            >
                <Tooltip title="Profile">
                    <Button onClick={handleMenuOpen}>
                        <ProfileIcon/>
                    </Button>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {!prop.loggedIn ? (
                        <MenuItem onClick={handleLoginClick}>Login</MenuItem>
                    ) : (
                        [
                            <MenuItem key="profile" onClick={handleProfileClick}>Profile</MenuItem>,
                            <MenuItem key="logout" onClick={handleLogoutClick}>Logout</MenuItem>
                        ]
                    )}
                </Menu>

            </Box>
        </Box>
    );
}

export default NavBar;

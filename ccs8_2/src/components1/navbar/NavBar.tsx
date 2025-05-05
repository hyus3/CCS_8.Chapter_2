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
    const btns = ["home", "about us", "faq", "coffee profiles"];
    const path = ["", "aboutus", "faq", "coffeeprofiles"];
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
                direction: "row",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "10vh",
                mx: 10,
                my: 5
            }}
        >
            <Box
                sx={{
                    display: { xs: "flex", sm: "none" },
                    justifyContent: "center",
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
                    width: "50%",
                    display: { xs: "none", sm: "flex" },
                    justifyContent: "space-between",
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
                    width: { xs: "10vw", sm: "5vw" },
                    height: { xs: "10vw", sm: "5vw" },
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

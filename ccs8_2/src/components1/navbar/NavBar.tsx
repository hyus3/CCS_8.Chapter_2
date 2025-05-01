import NavBtn from "./NavBtn";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import ProfileIcon from "./ProfileIcon";
import Hamburger from "./Hamburger";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type props = {
    path: string[];
    loggedIn: boolean;
    setLoggedin: (value: boolean) => void;
    userPhoto?: string | null;
};

function NavBar(prop: props) {
    const btns = ["home", "about us", "faq"];
    const path = prop.path;
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
        navigate(prop.path[0])
        handleMenuClose();
        prop.setLoggedin(false);// updates login state
    };

    return (
        <Box
            sx={{
                direction: "row",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                height: "10vh",
            }}
        >
            <Box
                sx={{
                    display: { xs: "flex", sm: "none" },
                    justifyContent: "center",
                    width: "10vw",
                }}
            >
                <Hamburger path={prop.path}/>
            </Box>

            <Box
                sx={{
                    direction: "row",
                    width: "40%",
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
                <Button onClick={handleMenuOpen}>
                    <ProfileIcon loggedIn={prop.loggedIn} photoURL={prop.userPhoto} />
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    {!prop.loggedIn ? (
                        <MenuItem onClick={handleLoginClick}>Login</MenuItem>
                    ) : (
                        <>
                            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                        </>
                    )}
                </Menu>
            </Box>
        </Box>
    );
}

export default NavBar;

import NavBtn from "./NavBtn";
import { Box, Button, Menu, MenuItem, Tooltip } from "@mui/material";
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
        navigate("/login");
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate("/profile");
    };

    const handleLogoutClick = () => {
        navigate(path[0]);
        handleMenuClose();
        prop.setLoggedin(false);
    };

    return (
        <Box
            sx={{
                direction: "row",
                display: "flex",
                flexDirection: "row",
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
                    <Hamburger path={path} />
                </Tooltip>
            </Box>

            <Box
                sx={{
                    direction: "row",
                    width: "50%",
                    display: { xs: "none", sm: "flex" },
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
                    width: { xs: "10vw", sm: "5vw" },
                    height: { xs: "10vw", sm: "5vw" },
                }}
            >
                <Tooltip title="Profile">
                    <Button
                        onClick={handleMenuOpen}
                        sx={{
                            padding: 0,
                            minWidth: 'auto',
                            '&:hover': { backgroundColor: 'transparent' },
                        }}
                    >
                        <ProfileIcon />
                    </Button>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                        },
                    }}
                >
                    {!prop.loggedIn ? (
                        <MenuItem
                            onClick={handleLoginClick}
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                color: '#2d2d2d',
                                '&:hover': { backgroundColor: '#fce8e9', color: '#cd3234' },
                                padding: '8px 16px',
                            }}
                        >
                            Login
                        </MenuItem>
                    ) : (
                        [
                            <MenuItem
                                key="profile"
                                onClick={handleProfileClick}
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    color: '#2d2d2d',
                                    '&:hover': { backgroundColor: '#fce8e9', color: '#cd3234' },
                                    padding: '8px 16px',
                                }}
                            >
                                Profile
                            </MenuItem>,
                            <MenuItem
                                key="logout"
                                onClick={handleLogoutClick}
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    color: '#2d2d2d',
                                    '&:hover': { backgroundColor: '#fce8e9', color: '#cd3234' },
                                    padding: '8px 16px',
                                }}
                            >
                                Logout
                            </MenuItem>,
                        ]
                    )}
                </Menu>
            </Box>
        </Box>
    );
}

export default NavBar;
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
    const btns = ["home", "about us", "contact us", "faq", "coffee profiles"];
    const path = ["", "aboutus", "contactus", "faq", "coffeeprofiles"];
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
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: "80px",
                mx: { xs: 2, sm: 4, md: 8 },
                my: 3,
                backgroundColor: '#eeeae4', // Light beige background
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <Box
                sx={{
                    display: { xs: "flex", sm: "none" },
                    justifyContent: "center",
                    width: "48px",
                }}
            >
                <Tooltip title="Menu">
                    <Hamburger path={path} />
                </Tooltip>
            </Box>

            <Box
                sx={{
                    flexDirection: "row",
                    width: "70%",
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
                    width: { xs: "48px", sm: "56px" },
                    height: { xs: "48px", sm: "56px" },
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
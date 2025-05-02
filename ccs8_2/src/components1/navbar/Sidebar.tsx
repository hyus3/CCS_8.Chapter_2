import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";

type SidebarProps = {
    toggleDrawer: boolean;
    setToggleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    path: string[];
};

function Sidebar({ toggleDrawer, setToggleDrawer, path }: SidebarProps) {
    const navigate = useNavigate();
    const btns = ["Home", "About Us", "FAQ"];

    const handleItemClick = (index: number) => {
        // Navigate to the selected route
        navigate(path[index]);
        // Close the drawer
        setToggleDrawer(false);
    };

    return (
        <Drawer anchor="left" open={toggleDrawer} onClose={() => setToggleDrawer(false)}>
            <List>
                {btns.map((btn, index) => (
                    <ListItem
                        key={index}
                        component="button"
                        onClick={() => handleItemClick(index)} // Use the function to close the drawer and navigate
                        sx={{
                            border: 'none',  // Remove any border
                            padding: '10px 20px', // Optional: adjust padding if needed
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.08)', // Optional: hover effect
                            },
                        }}
                    >
                        <ListItemText primary={btn} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;

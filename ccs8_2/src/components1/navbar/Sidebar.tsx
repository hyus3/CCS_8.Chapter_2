import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";

type SidebarProps = {
    toggleDrawer: boolean;
    setToggleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    path: string[];
};

function Sidebar({ toggleDrawer, setToggleDrawer, path }: SidebarProps) {
    const navigate = useNavigate();
    const btns = ["Home", "About Us", "Coffee Profiles", "Contact Us", "FAQs"];

    const handleItemClick = (index: number) => {
        navigate(path[index]);
        setToggleDrawer(false);
    };

    return (
        <Drawer
            anchor="left"
            open={toggleDrawer}
            onClose={() => setToggleDrawer(false)}
            PaperProps={{
                sx: {
                    backgroundColor: '#eeeae4', // White background for contrast
                    width: '200px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
            }}
        >
            <List>
                {btns.map((btn, index) => (
                    <ListItem
                        key={index}
                        component="button"
                        onClick={() => handleItemClick(index)}
                        sx={{
                            bgcolor: "#eeeae4",
                            border: 'none',
                            padding: '12px 24px',
                            '&:hover': {
                                // Subtle red tint from #cd3234
                                color: '#cd3234', // Highlight color
                            },
                            transition: 'background-color 0.2s ease, color 0.2s ease',
                        }}
                    >
                        <ListItemText
                            primary={btn}
                            primaryTypographyProps={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '16px',
                                color: '#2d2d2d',
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;
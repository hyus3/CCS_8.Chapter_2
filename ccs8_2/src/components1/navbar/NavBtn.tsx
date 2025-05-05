import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

type prop = {
    name: string;
    path: string;
    onClick?: () => void;
};

function NavBtn(props: prop) {
    const navigate = useNavigate();

    return (
        <Button
            variant="contained"
            sx={{
                margin: "0 auto",
                fontSize: "14px",
                borderRadius: 7.5,
                boxShadow: "none",
                height: "75%",
                minWidth: "160px",
                maxWidth: "160px", 
                alignSelf: "center",
                backgroundColor: "#cd3234",
                textTransform: "none",
                "&:hover": { backgroundColor: "#9E2A26"}
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                height: '40px',
                padding: { xs: '8px 16px', md: '8px 24px' },
                backgroundColor: '#cd3234',
                '&:hover': { backgroundColor: '#b02b2d' },
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: { xs: '14px', md: '16px' },
                color: '#ffffff',
                transition: 'background-color 0.2s ease',
            }}
            onClick={() => {
                navigate(props.path);
                if (props.onClick) props.onClick();
            }}
        >
            {props.name}
        </Button>
    );
}

export default NavBtn;
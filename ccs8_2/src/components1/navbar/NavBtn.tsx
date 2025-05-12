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
                minWidth: "150px",
                maxWidth: "200px",
                borderRadius: '18px',
                boxShadow: '0',
                height: '40px',
                padding: { xs: '8px 16px', md: '8px 24px' },
                backgroundColor: '#eeeae4',
                '&:hover': { backgroundColor: '#cd3234', color: '#ffffff' },
                fontFamily: 'Inter, sans-serif',
                fontWeight: 'bold',
                fontSize: { xs: '12px', md: '14px' },
                color: '#cd3234',
                transition: 'background-color 0.3s ease',
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
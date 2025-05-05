import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

type prop = {
    name:string,
    path:string,
    onClick?: () => void
}
function NavBtn(props: prop) {
    const navigate = useNavigate()
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
            }}
            onClick={() => navigate(props.path)}
        >
            {props.name}
        </Button>
    )
}

export default NavBtn
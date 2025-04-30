import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

type prop = {
    name:string,
    path:string
}
function NavBtn(props: prop) {
    const navigate = useNavigate()
    return (
        <Button
            variant="contained"
            sx={{
                borderRadius: 7.5,
                boxShadow: "none",
                height: "75%",
                alignSelf: "center",
            }}
            onClick={() => navigate(props.path)}
        >
            {props.name}
        </Button>
    )
}

export default NavBtn
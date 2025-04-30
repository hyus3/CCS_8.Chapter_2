import MenuIcon from '@mui/icons-material/Menu';
import {Button} from "@mui/material";
import {useState} from "react";

function Hamburger() {
    const [toggleDrawer, setToggleDrawer] = useState(false)

    return (
        <>
            <Button onClick={() => setToggleDrawer(toggleDrawer => !toggleDrawer)}>
                <MenuIcon />
            </Button>

        </>
    )
}

export default Hamburger
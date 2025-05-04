import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import { useState } from 'react';
import Sidebar from './Sidebar'; // Import Sidebar component

type prop = {
    path:string[]
}
function Hamburger(props: prop) {
    const [toggleDrawer, setToggleDrawer] = useState(false);

    return (
        <>
            <Button onClick={() => setToggleDrawer(!toggleDrawer)}>
                <MenuIcon sx={{ color: "#6e4e33" }}/>
            </Button>
            <Sidebar toggleDrawer={toggleDrawer} setToggleDrawer={setToggleDrawer} path={props.path} />
        </>
    );
}

export default Hamburger;

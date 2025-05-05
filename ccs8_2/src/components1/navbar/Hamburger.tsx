import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';
import { useState } from 'react';
import Sidebar from './Sidebar';

type prop = {
    path: string[];
};

function Hamburger(props: prop) {
    const [toggleDrawer, setToggleDrawer] = useState(false);

    return (
        <>
            <Button
                onClick={() => setToggleDrawer(!toggleDrawer)}
                sx={{
                    padding: 0,
                    minWidth: '40px',
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: '#fce8e9' },
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <MenuIcon sx={{ color: '#cd3234', fontSize: '28px' }} />
            </Button>
            <Sidebar toggleDrawer={toggleDrawer} setToggleDrawer={setToggleDrawer} path={props.path} />
        </>
    );
}

export default Hamburger;
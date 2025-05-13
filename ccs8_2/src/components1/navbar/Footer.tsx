import {Box, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            minHeight: '10vh',
            mx: 'auto' ,
            bottom: 0,
            width: '80vw',
            justifyContent: 'space-around',
            alignSelf: 'center',

        }}>
            <Typography variant='h6' sx={{
                fontWeight: '400',
                fontSize: '1.25rem',
                '&:hover': { color: '#cd3234', fontWeight: '600' }
            }}
                        onClick={() => navigate('/contactus')}>Contact Us</Typography>
            <Typography variant='h6' sx={{
                fontWeight: '400',
                fontSize: '1.25rem',
                '&:hover': { color: '#cd3234', fontWeight: '600' }
            }}
                        onClick={() => navigate('/aboutus')}>About Us</Typography>
        </Box>
    )
}

export default Footer
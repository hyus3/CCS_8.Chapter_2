import {Box, Typography} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: {xs: 'column', sm: 'row'},
            gap: {xs: '10px', sm: 'auto'},
            minHeight: '10vh',
            mx: 'auto' ,
            bottom: 0,
            width: '80vw',
            justifyContent: 'space-evenly',
            alignSelf: 'center',
            alignItems: 'center',
        }}>
            <Typography variant='h6' sx={{
                fontWeight: '400',
                fontSize: '1rem',
                color: '#eeeae4',
                '&:hover': { textDecoration: 'underline' }
            }}
                        onClick={() => navigate('/contactus')}>Contact Us</Typography>
            <Typography variant='h6' sx={{
                fontWeight: '400',
                fontSize: '1rem',
                color: '#eeeae4',
                '&:hover': { textDecoration: 'underline' }
            }}
                        onClick={() => navigate('/aboutus')}>About Us</Typography>
            <Typography variant='h6' sx={{
                fontWeight: '400',
                fontSize: '1rem',
                color: '#eeeae4',
                '&:hover': { textDecoration: 'underline' }
            }}
                        onClick={() => navigate('/sitemap')}>Sitemap</Typography>
        </Box>
    )
}

export default Footer
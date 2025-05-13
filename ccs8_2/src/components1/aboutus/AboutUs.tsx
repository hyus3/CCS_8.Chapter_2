import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';

function AboutUs() {
    return (
        <Box
            sx={{
                padding: "60px 1rem",
                maxWidth: "1200px",
                fontFamily: 'Helvetica',
                margin: '0 auto',
            }}
        >
            {/* Header Section */}
            <Box mb={2}>
                <h2 style={{
                    fontSize: "1.5rem",
                    color: "#cd3234",
                    marginBottom: "0",
                }}>
                    About Us
                </h2>

                <p style={{
                    marginBottom: "0",
                    marginTop: "0",
                    fontSize: "3rem",
                }}>
                    Meet the team.
                </p>
            </Box>
        <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }} // Stack vertically on mobile, horizontally on larger screens
            justifyContent="center" 
            alignItems="stretch"
            alignContent="center"
            sx={{
                paddingTop: "3rem",
                gap: '20px', // Space between the people
                maxHeight: '100vh', // Ensures that content takes full height
                marginTop: '0',
                flexWrap: 'wrap',
            }}
        >
            {/* Person 1 */}
            <Paper sx={{ padding: '20px', width: '80%', textAlign: 'center', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: 'transparent', border: '1px solid #110203',}}>
            <a 
                href="https://www.facebook.com/danielrz01" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                {/* Avatar for picture */}
                <Avatar
                    alt="Daniel Arellano Profile"
                    src="https://drive.google.com/thumbnail?id=1QQE6o2h3dU_-RUvUqmuv7RJ-bjLdgYPa"
                    sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto 10px',
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6e4e33' }}> Daniel Roz Arellano </Typography>
            </a>
            <Typography variant="body1">This is Daniel. He leads the team and handles the challenging parts of the website.</Typography>
            </Paper>

            {/* Person 2 */}
            <Paper sx={{ padding: '20px', width: '80%', textAlign: 'center', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: 'transparent', border: '1px solid #110203', }}>
            <a 
                href="https://www.linkedin.com/in/krishnan-mahinay-7130562b1/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                {/* Avatar for picture */}
                <Avatar
                    alt="Krishnan Mahinay Profile"
                    src="https://media.licdn.com/dms/image/v2/D4E03AQF625sEHpyn2Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1707285286734?e=1752105600&v=beta&t=kjT4QLvn3Ibj3Mfnw2pY_FW1YM8xFozOmmp2PRaV-Hw" // Image source
                    sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto 10px',
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6e4e33' }}> Krishnan Mahinay </Typography>
            </a>
            <Typography variant="body1">This is Krishnan. He also works on the challenging parts of the site and keeps everything on track.</Typography>
            </Paper>

            {/* Person 3 */}
            <Paper sx={{ padding: '20px', width: '80%', textAlign: 'center', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: 'transparent', border: '1px solid #110203',}}>
            <a 
                href="https://www.linkedin.com/in/gayselle-gianni-corsame-73319035b/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                {/* Avatar for picture */}
                <Avatar
                    alt="Person 3"
                    src="https://media.licdn.com/dms/image/v2/D5603AQHV-Pp3IglDkw/profile-displayphoto-shrink_400_400/B56Zamshu.GkAg-/0/1746553413563?e=1752105600&v=beta&t=WsqD3wuis-1u2D_LioD0bQJWEhyro_GkU44G8g12RPs" // Image source
                    sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto 10px',
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6e4e33' }}> Gayselle Gianni Corsame </Typography>
            </a>
            <Typography variant="body1">This is Gayselle. She focuses on the creative and structural part of the project—and handles the written documentation.</Typography>
            </Paper>
        </Box>
        </Box>
    );
}

export default AboutUs;

import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';

function AboutUs() {
    return (
        <Box
            sx={{
                padding: "40px 1rem",
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
            justifyContent="space-around"
            alignItems="stretch"
            sx={{
                paddingTop: "3rem",
                gap: '20px', // Space between the people
                maxHeight: '100vh', // Ensures that content takes full height
                marginTop: '0',
            }}
        >
            {/* Person 1 */}
            <Paper sx={{ padding: '20px', minWidth: { sm: '10%', lg: '30%'}, textAlign: 'center', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: 'transparent', border: '1px solid #110203',}}>
                {/* Avatar for picture */}
                <Avatar
                    alt="Person 1"
                    src="/broken-image.jpg" // Image source
                    sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto 10px', // Centering the Avatar and adding space below
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6e4e33' }}>Person 1</Typography>
                <Typography variant="body1">This is Person 1. They are the leader of our project.</Typography>
            </Paper>

            {/* Person 2 */}
            <Paper sx={{ padding: '20px', minWidth: { sm: '10%', lg: '30%' }, textAlign: 'center', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: 'transparent', border: '1px solid #110203', }}>
                {/* Avatar for picture */}
                <Avatar
                    alt="Person 2"
                    src="/broken-image.jpg" // Image source
                    sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto 10px',
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6e4e33' }}>Person 2</Typography>
                <Typography variant="body1">This is Person 2. They manage operations and coordination.</Typography>
            </Paper>

            {/* Person 3 */}
            <Paper sx={{ padding: '20px', minWidth: { sm: '10%', lg: '30%' }, textAlign: 'center', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: 'transparent', border: '1px solid #110203',}}>
                {/* Avatar for picture */}
                <Avatar
                    alt="Person 3"
                    src="/broken-image.jpg" // Image source
                    sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto 10px',
                    }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6e4e33' }}>Person 3</Typography>
                <Typography variant="body1">This is Person 3. They are the creative genius behind our project.</Typography>
            </Paper>
        </Box>
        </Box>
    );
}

export default AboutUs;

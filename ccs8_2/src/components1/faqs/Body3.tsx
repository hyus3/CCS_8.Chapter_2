import {Box} from "@mui/material";
import {useTheme} from "@mui/material";

function Body3() {
    const theme = useTheme()
    return (
        <Box sx={{bgcolor: "primary.light", height: "100vh", width: "100%"}}>
            <p>Body 3</p>
        </Box>
    )
}

export default Body3
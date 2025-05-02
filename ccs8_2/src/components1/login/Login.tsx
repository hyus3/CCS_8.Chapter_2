import { Button, Box, Typography } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google"; // Google logo icon

type LoginProps = {
    onLogin: (user: User | null) => void;
};

function Login({ onLogin }: LoginProps) {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            onLogin(result.user);
            navigate("/"); // redirect to homepage
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{
                backgroundColor: "#f5f5f5", // Soft background color
                textAlign: "center",
                padding: 3
            }}
        >
            {/* Title */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
                Log in to Coffee Compass
            </Typography>

            {/* Login Button */}
            <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                    width: "100%",
                    maxWidth: 400, // Max width to ensure it doesn't stretch too much
                    height: 60, // Make the button bigger
                    borderColor: "#4285F4",
                    color: "#4285F4",
                    borderWidth: 2,
                    "&:hover": {
                        borderColor: "#4285F4",
                        backgroundColor: "#4285F4",
                        color: "white"
                    }
                }}
                startIcon={<GoogleIcon />} // Add Google logo
            >
                Log in with Google
            </Button>
        </Box>
    );
}

export default Login;

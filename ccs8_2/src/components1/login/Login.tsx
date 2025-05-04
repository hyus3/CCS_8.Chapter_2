import { useState } from "react";
import {
    Button,
    Box,
    Typography,
    TextField,
    Divider,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    User
} from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";


type LoginProps = {
    onLogin: (user: User | null) => void;
};

function Login({ onLogin }: LoginProps) {
    const navigate = useNavigate();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            onLogin(result.user);
            navigate("/");
        } catch (err) {
            console.error("Google login failed", err);
            setError("Google login failed.");
        }
    };

    const handleEmailAuth = async () => {
        try {
            let userCredential;
            if (mode === "login") {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (auth.currentUser && name) {
                    await updateProfile(auth.currentUser, { displayName: name });
                }
            }
            onLogin(userCredential.user);
            navigate("/");
        } catch (err) {
            console.error(`${mode === "login" ? "Login" : "Signup"} failed`, err);
            setError("Authentication failed. Please check your credentials.");
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ textAlign: "center", padding: 3 }}
        >
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
                {mode === "login" ? "Log in to Coffee Compass" : "Sign up for Coffee Compass"}
            </Typography>

            <Box
                component="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailAuth();
                }}
                sx={{ width: "100%", maxWidth: 400 }}
            >
                {mode === "signup" && (
                    <TextField
                        label="Name"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                )}
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="outlined" type="submit" fullWidth
                    sx={{
                        width: "100%",
                        maxWidth: 400,
                        height: 60,
                        borderColor: "#cd3234",
                        color: "#cd3234",
                        borderWidth: 2,
                        mb: 2,
                        "&:hover": {
                            borderColor: "#6e4e33",
                            backgroundColor: "#6e4e33",
                            color: "#fff"
                        }
                    }}
                >
                    {mode === "login" ? "Log in with Email" : "Sign up with Email"}
                </Button>
                {error && (
                    <Typography color="error" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
            </Box>

            <Divider sx={{ width: "100%", maxWidth: 400, my: 2 }}>
                <Typography variant="caption">or</Typography>
            </Divider>

            <Button
                variant="outlined"
                onClick={handleGoogleLogin}
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    height: 60,
                    borderColor: "#cd3234",
                    color: "#cd3234",
                    borderWidth: 2,
                    mb: 2,
                    "&:hover": {
                        borderColor: "#6e4e33",
                        backgroundColor: "#6e4e33",
                        color: "#fff"
                    }
                }}
                startIcon={<GoogleIcon />}
            >
                Continue with Google
            </Button>

            {/* Toggle between Login and Signup */}
            <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={(_, newMode) => newMode && setMode(newMode)}
                sx={{ mb: 2 }}
            >
                <ToggleButton
                    value="login"
                    sx={{
                        fontSize: "0.75rem",
                        px: 2,
                        py: 0.5,
                        height: 30,
                        minWidth: 80,
                        borderColor: "#cd3234",
                        color: "#cd3234",
                        "&.Mui-selected": {
                            backgroundColor: "#cd3234",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#6e4e33"
                            }
                        },
                        "&:hover": {
                            backgroundColor: "#6e4e33",
                            color: "#fff"
                        }
                    }}
                >
                    Log In
                </ToggleButton>
                <ToggleButton
                    value="signup"
                    sx={{
                        fontSize: "0.75rem",
                        px: 2,
                        py: 0.5,
                        height: 30,
                        minWidth: 80,
                        borderColor: "#cd3234",
                        color: "#cd3234",
                        "&.Mui-selected": {
                            backgroundColor: "#cd3234",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#6e4e33"
                            }
                        },
                        "&:hover": {
                            backgroundColor: "#6e4e33",
                            color: "#fff"
                        }
                    }}
                >
                    Sign Up
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

export default Login;

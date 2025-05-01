import NavBar from "./components1/navbar/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { User } from "firebase/auth"; // Import User type
import 'firebase/firestore';
import 'firebase/auth';
import Body2 from "./components1/body/Body2";
import React, { useState } from "react";
import Login from "./components1/login/Login";
import AboutUs from "./components1/aboutus/AboutUs";
import FaqPage from "./components1/faqs/FaqPage";
import Profile from "./components1/profile/Profile";

function App() {
    const path = ["", "aboutus", "faq", "login", "profile"];
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = (loggedInUser: User | null) => {
        setUser(loggedInUser);
        setLoggedIn(true);  // Update loggedIn state when user logs in
    };

    const logout = () => {
        setUser(null);
        setLoggedIn(false);  // Update loggedIn state when user logs out
    };

    return (
        <Router>
            <header>
                <NavBar path={path} loggedIn={loggedIn} setLoggedin={logout} userPhoto={user?.photoURL} />
            </header>
            <Routes>
                <Route path={path[0]} element={<Body2 />} />
                <Route path={path[1]} element={<AboutUs />} />
                <Route path={path[2]} element={<FaqPage />} />
                <Route path={path[3]} element={<Login onLogin={handleLogin} />} />
                <Route path={path[4]} element={<Profile user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;

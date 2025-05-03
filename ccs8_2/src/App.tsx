import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { User, onAuthStateChanged, getAuth, signOut } from "firebase/auth";

import NavBar from "./components1/navbar/NavBar";
import Body2 from "./components1/body/Body2";
import Login from "./components1/login/Login";
import AboutUs from "./components1/aboutus/AboutUs";
import FaqPage from "./components1/faqs/FaqPage";
import Profile from "./components1/profile/Profile";
import CafeSearch from "./components1/cafeSearch/cafeSearch";
import CafeView from "./components1/cafeView/cafeView";
import ContactUs from "./components1/contactus/ContactUs";
import CoffeeProfiles from "./components1/coffeeprofiles/CoffeeProfiles";

function App() {
    const path = ["", "aboutus", "faq", "login", "profile", "contactus", "coffeeprofiles"];
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoggedIn(!!currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = (loggedInUser: User | null) => {
        setUser(loggedInUser);
        setLoggedIn(true);
    };

    const logout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                setUser(null);
                setLoggedIn(false);
            })
            .catch((error) => {
                console.error("Error during sign out:", error);
            });
    };

    return (
        <Router>
            <header>
                <NavBar
                    path={path}
                    loggedIn={loggedIn}
                    setLoggedin={logout}
                    userPhoto={user?.photoURL}
                />
            </header>
            <Routes>
                <Route path={path[0]} element={<Body2 />} />
                <Route path={path[1]} element={<AboutUs />} />
                <Route path={path[2]} element={<FaqPage />} />
                <Route path={path[5]} element={<ContactUs />} />
                <Route path={path[6]} element={<CoffeeProfiles />} />
                <Route path={path[3]} element={<Login onLogin={handleLogin} />} />
                <Route path={path[4]} element={<Profile user={user} />} />
                <Route path="/search" element={<CafeSearch />} />
                <Route path="/cafe/:placeId" element={<CafeView />} />
            </Routes>
        </Router>
    );
}

export default App;

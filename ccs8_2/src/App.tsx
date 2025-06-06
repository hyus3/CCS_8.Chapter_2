import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { User, onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import "./App.css";

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
import MapView from "./components1/mapview/mapview";
import AllCafesView from "./components1/explore/allcafeview";
import Footer from "./components1/navbar/Footer";
import Sitemap from "./components1/sitemap/Sitemap";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();

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

    const isLoginPage = location.pathname === "/login";

    return (
        <>
            {!isLoginPage && (
                <header>
                    <NavBar
                        loggedIn={loggedIn}
                        setLoggedin={logout}
                        userPhoto={user?.photoURL}
                    />
                </header>
            )}
            <Routes>
                <Route path="/" element={<Body2 />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/coffeeprofiles" element={<CoffeeProfiles />} />
                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/search" element={<CafeSearch />} />
                <Route path="/cafe/:placeId" element={<CafeView user={user} />} />
                <Route path="/mapview" element={<MapView />} />
                <Route path="/explore" element={<AllCafesView />} />
                <Route path="/sitemap" element={<Sitemap />} />
            </Routes>
            {!isLoginPage && (
                <footer className={'footer'}>
                    <Footer />
                </footer>
            )}
        </>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
// App.tsx
import NavBar from "./components1/navbar/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Body2 from "./components1/body/Body2";
import React, { useState } from "react";
import Login from "./components1/login/Login";
import FaqPage from "./components1/faqs/FaqPage";
import Profile from "./components1/profile/Profile";
import { User } from "firebase/auth";
import AboutUs from "./components1/aboutus/AboutUs";

function App() {
    const path = ["", "aboutus", "faq", "profile", "login"];
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = (loggedInUser: User | null) => {
        setUser(loggedInUser);
    };
    const logout = () => {
        setUser(null);
    };

    return (
        <Router>
            <header>
                <NavBar
                    path={path}
                    loggedIn={!!user}
                    setLoggedin={logout}
                    userPhoto={user?.photoURL}
                />

            </header>
            <Routes>
                <Route path={`${path[0]}`} element={<Body2 />} />
                <Route path={`${path[1]}`} element={<AboutUs />} />
                <Route path={`${path[2]}`} element={<FaqPage />} />
                <Route path={`${path[3]}`} element={<Profile user={user} />} />
                <Route path={`${path[4]}`} element={<Login onLogin={handleLogin}/>} />
            </Routes>
        </Router>
    );
}

export default App;

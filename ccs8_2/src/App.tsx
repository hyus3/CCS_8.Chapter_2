import NavBar from "./components1/navbar/NavBar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
<<<<<<< Updated upstream
import Body2 from "./components1/body/Body2";
import CoffeeProfiles from "./components1/coffeeprofiles/CoffeeProfiles";
import ContactUs from "./components1/contactus/ContactUs";
import FaqPage from "./components1/faqs/FaqPage";
=======
import { initializeApp } from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData} from "react-firebase-hooks/firestore";
import Body2 from "./components1/body/Body2";
import Body3 from "./components1/faqs/Body3";
import React, {useState} from "react";
import Login from "./components1/login/Login";
import firebase from "firebase/compat";
>>>>>>> Stashed changes

firebase.initializeApp({

})

const auth = firebase.auth
const firestore = firebase.firestore()

function App() {
<<<<<<< Updated upstream
    const path = ["", "contact", "aboutus", "faq", "coffeeprofiles", "contactus"]
=======
    const path = ["", "contact", "aboutus", "faq"]
    const [loggedIn, setLoggedIn] = useState(false)
    const logout = () => setLoggedIn(loggedIn => !loggedIn)

>>>>>>> Stashed changes
  return (
      <Router>
          <header><NavBar path={path} loggedIn={!loggedIn} setLoggedin={logout}/></header>
          <Routes>
              <Route path={`${path[0]}`} element={<Body2 />} />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <Route path={`${path[3]}`} element={<FaqPage />} />
              <Route path={`${path[2]}`} element={<Body1 />} />
              <Route path={`${path[4]}`} element={<CoffeeProfiles />} />
              <Route path={`${path[5]}`} element={<ContactUs />} />
=======
              <Route path={`${path[1]}`} element={<Body3 />} />
>>>>>>> Stashed changes
=======
              <Route path={`${path[1]}`} element={<Body3 />} />
              <Route path={`${path[2]}`} element={<Login loggedin={loggedIn} setLoggedin={logout}/>} />
>>>>>>> Stashed changes
          </Routes>
      </Router>
  );
}

export default App;

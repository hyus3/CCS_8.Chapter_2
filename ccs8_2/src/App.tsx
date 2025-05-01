import NavBar from "./components1/navbar/NavBar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
//import { initializeApp } from 'firebase/App';
import 'firebase/firestore'
import 'firebase/auth'
import Body2 from "./components1/body/Body2";
import CoffeeProfiles from "./components1/coffeeprofiles/CoffeeProfiles";
import ContactUs from "./components1/contactus/ContactUs";
import FaqPage from "./components1/faqs/FaqPage";
import CafeSearch from "./components1/cafeSearch/cafeSearch";
import Body3 from "./components1/faqs/FaqPage";
import React, {useState} from "react";
import Login from "./components1/login/Login";

/*
firebase.initializeApp({

})

const auth = firebase.auth
const firestore = firebase.firestore()
*/
function App() {
    const path = ["", "contact", "aboutus", "faq"]
    const [loggedIn, setLoggedIn] = useState(false)
    const logout = () => setLoggedIn(loggedIn => !loggedIn)

  return (
      <Router>
          <header><NavBar path={path} loggedIn={!loggedIn} setLoggedin={logout}/></header>
          <Routes>
            <Route path={`${path[1]}`} element={<CafeSearch />} />
              <Route path={`${path[0]}`} element={<Body2 />} />
              <Route path={`${path[1]}`} element={<Body3 />} />
              <Route path={`${path[2]}`} element={<Login loggedin={loggedIn} setLoggedin={logout}/>} />
          </Routes>
      </Router>
  );
}

export default App;

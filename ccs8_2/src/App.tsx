import NavBar from "./components1/navbar/NavBar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'firebase/firestore'
import 'firebase/auth'
import Body2 from "./components1/body/Body2";
import React, {useState} from "react";
import Login from "./components1/login/Login";
import firebase from "firebase/compat";
import AboutUs from "./components1/aboutus/AboutUs";
import FaqPage from "./components1/faqs/FaqPage";

firebase.initializeApp({

})

const auth = firebase.auth
const firestore = firebase.firestore()

function App() {
    const path = ["", "aboutus", "faq"]
    const [loggedIn, setLoggedIn] = useState(false)
    const logout = () => setLoggedIn(loggedIn => !loggedIn)

  return (
      <Router>
          <header><NavBar path={path} loggedIn={!loggedIn} setLoggedin={logout}/></header>
          <Routes>
              <Route path={`${path[0]}`} element={<Body2 />} />
              <Route path={`${path[1]}`} element={<AboutUs/>} />
              <Route path={`${path[2]}`} element={<FaqPage/>} />
          </Routes>
      </Router>
  );
}

export default App;

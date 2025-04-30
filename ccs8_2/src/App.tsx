import NavBar from "./components1/navbar/NavBar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
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

firebase.initializeApp({

})

const auth = firebase.auth
const firestore = firebase.firestore()

function App() {
    const path = ["", "contact", "aboutus", "faq"]
    const [loggedIn, setLoggedIn] = useState(false)
    const logout = () => setLoggedIn(loggedIn => !loggedIn)

  return (
      <Router>
          <header><NavBar path={path} loggedIn={!loggedIn} setLoggedin={logout}/></header>
          <Routes>
              <Route path={`${path[0]}`} element={<Body2 />} />
              <Route path={`${path[1]}`} element={<Body3 />} />
              <Route path={`${path[2]}`} element={<Login loggedin={loggedIn} setLoggedin={logout}/>} />
          </Routes>
      </Router>
  );
}

export default App;

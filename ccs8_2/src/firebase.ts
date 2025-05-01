// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDirHowSjl5Jz-k-Qv-t2r8vcDU7Plm0jA",
    authDomain: "dumaguete-coffee-compass.firebaseapp.com",
    projectId: "dumaguete-coffee-compass",
    storageBucket: "dumaguete-coffee-compass.firebasestorage.app",
    messagingSenderId: "976092662235",
    appId: "1:976092662235:web:3935039f8542e609fe3ffe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Initialize Firebase
export {auth, provider};
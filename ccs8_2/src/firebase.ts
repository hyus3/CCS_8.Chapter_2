import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Required import
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDirHowSjl5Jz-k-Qv-t2r8vcDU7Plm0jA",
    authDomain: "dumaguete-coffee-compass.firebaseapp.com",
    projectId: "dumaguete-coffee-compass",
    storageBucket: "dumaguete-coffee-compass.firebasestorage.app",
    messagingSenderId: "976092662235",
    appId: "1:976092662235:web:3935039f8542e609fe3ffe",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // ✅ Now works

export { db, auth, provider };

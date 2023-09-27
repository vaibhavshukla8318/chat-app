import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEmMfoZKYFMVC7-pC5PwllFnZYRcbqvlU",
    authDomain: "react-chat-app-f4eac.firebaseapp.com",
    projectId: "react-chat-app-f4eac",
    storageBucket: "react-chat-app-f4eac.appspot.com",
    messagingSenderId: "206336169889",
    appId: "1:206336169889:web:47e81701751c0d0973dde0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

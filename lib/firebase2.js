// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUZV82N2B4RAFfrttAAUiv78d01dRM1e4",
    authDomain: "qmsreport-93562.firebaseapp.com",
    projectId: "qmsreport-93562",
    storageBucket: "qmsreport-93562.appspot.com",
    messagingSenderId: "761363350875",
    appId: "1:761363350875:web:e34f81298b3955b3f8867e"
  };

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig,"secondary");
export const database = getFirestore(firebaseApp);
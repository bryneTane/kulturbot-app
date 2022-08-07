// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh3AKmDjYO5yqyPsLNHLL_AaembQtoYLc",
  authDomain: "kultur-2099a.firebaseapp.com",
  projectId: "kultur-2099a",
  storageBucket: "kultur-2099a.appspot.com",
  messagingSenderId: "705315085081",
  appId: "1:705315085081:web:24e8ee784493fdd4c98388",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { db };

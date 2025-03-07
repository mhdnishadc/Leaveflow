// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXZC53LXdaQOT5JkvODtldWy1WGXghLQI",
  authDomain: "leaveflowauth.firebaseapp.com",
  projectId: "leaveflowauth",
  storageBucket: "leaveflowauth.firebasestorage.app",
  messagingSenderId: "19931580291",
  appId: "1:19931580291:web:cb44ffaf9b1c2fbb43d8b6",
  measurementId: "G-NF7PCCM9E6"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
// const analytics = getAnalytics(app);
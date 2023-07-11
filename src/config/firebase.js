import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyB-7gPP4afB0K2PnAgPuhWUAzvG9Ra25Nw",
  authDomain: "fir-7334a.firebaseapp.com",
  projectId: "fir-7334a",
  storageBucket: "fir-7334a.appspot.com",
  messagingSenderId: "840571943863",
  appId: "1:840571943863:web:a4f83443e58db129e54632"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);



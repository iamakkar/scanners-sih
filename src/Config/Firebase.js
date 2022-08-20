import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./FirebaseConfig";
import { getStorage } from "firebase/storage";


  
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const db = getFirestore(app);

export const auth = getAuth(app);

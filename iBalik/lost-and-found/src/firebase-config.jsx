
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCUnvGSQYJGEcRdLqNZ7GnuCSMInces8qM",
  authDomain: "lost-and-found-managemen-fefcb.firebaseapp.com",
  databaseURL: "https://lost-and-found-managemen-fefcb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lost-and-found-managemen-fefcb",
  storageBucket: "lost-and-found-managemen-fefcb.firebasestorage.app",
  messagingSenderId: "439255398539",
  appId: "1:439255398539:web:e8c94ecff36d4b5099bc8e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
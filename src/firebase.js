import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2euL-F0D81gVmEr_-LpZ0dwuNkRUOcK8",
  authDomain: "timur-952c9.firebaseapp.com",
  projectId: "timur-952c9",
  storageBucket: "timur-952c9.firebasestorage.app",
  messagingSenderId: "835035503045",
  appId: "1:835035503045:web:5845fcaa2247dd6c1913ac",
  measurementId: "G-0HBY5QBDQV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

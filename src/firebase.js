import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyAAoc0cTY6bVDC_GbOzU8Md49Pdcj3arsQ", // TAMANG API KEY NA
  authDomain: "lrt-decor-inventory.firebaseapp.com",
  projectId: "lrt-decor-inventory",
  storageBucket: "lrt-decor-inventory.firebasestorage.app",
  messagingSenderId: "1066138988051",
  appId: "1:1066138988051:web:6e9bb9be43b4fdeed5d9e6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); 
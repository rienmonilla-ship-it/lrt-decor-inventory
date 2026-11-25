import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; 
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyAAoc0cTY6bVDC_GbOzU8Md49Pdcj3arsQ",
  authDomain: "lrt-decor-inventory.firebaseapp.com",
  projectId: "lrt-decor-inventory",
  storageBucket: "lrt-decor-inventory.firebasestorage.app",
  messagingSenderId: "1066138988051",
  appId: "1:1066138988051:web:6e9bb9be43b4fdeed5d9e6"
};

const app = initializeApp(firebaseConfig);

// Initialize App Check gamit ang Enterprise Provider
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LcTaTEuAAAAAIHkX8bxf5sj02mBwOgjsngsQX_i'), 
  isTokenAutoRefreshEnabled: true
});

export const db = getFirestore(app);
export const auth = getAuth(app);
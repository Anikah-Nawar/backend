import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
        apiKey: "AIzaSyCbyZFQSYr3E_0CM46eMQCMm7pEelkADrE",
        authDomain: "dashboard-ec3dc.firebaseapp.com",
        projectId: "dashboard-ec3dc",
        storageBucket: "dashboard-ec3dc.firebasestorage.app",
        messagingSenderId: "684313425979",
        appId: "1:684313425979:web:1e95f01ccf86d1f681c41e"
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
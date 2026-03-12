
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ---------- 1) Firebase config - make sure this matches the config in login.html EXACTLY ----------
const firebaseConfig = {
        apiKey: "AIzaSyCbyZFQSYr3E_0CM46eMQCMm7pEelkADrE",
        authDomain: "dashboard-ec3dc.firebaseapp.com",
        projectId: "dashboard-ec3dc",
        storageBucket: "dashboard-ec3dc.firebasestorage.app",
        messagingSenderId: "684313425979",
        appId: "1:684313425979:web:1e95f01ccf86d1f681c41e"
};
// -----------------------------------------------------------------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Wait for DOM ready to ensure elements exist
window.addEventListener('DOMContentLoaded', () => {
  console.log('[dashboard] DOMContentLoaded');

  const logoutBtn = document.getElementById('logout-btn');
  const userEmail = document.getElementById('user-email');

  if (!logoutBtn) {
    console.error('[dashboard] logout-btn not found in DOM. Check that dashboard.html has <button id="logout-btn">Logout</button>');
    return;
  }
  if (!userEmail) {
    console.warn('[dashboard] user-email element not found (optional).');
  }

  // Protect the page and display user info
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('[dashboard] user is signed in:', user.email, user.uid);
      if (userEmail) userEmail.textContent = `Logged in as: ${user.email}`;
      // attach handler here (ensures auth is ready and user is present)
      attachLogoutHandler();
    } else {
      console.log('[dashboard] no user signed in — redirecting to index.html');
      // not signed in -> redirect
      window.location.href = 'index.html';
    }
  });

  function attachLogoutHandler() {
    // remove existing listeners (defensive)
    logoutBtn.replaceWith(logoutBtn.cloneNode(true));
    const newLogoutBtn = document.getElementById('logout-btn');

    newLogoutBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      console.log('[dashboard] logout clicked — attempting signOut()');

      try {
        await signOut(auth);
        console.log('[dashboard] signOut successful, redirecting to index.html');
        // Optionally clear local UI state then redirect
        window.location.href = 'index.html';
      } catch (err) {
        // show friendly error and log details
        console.error('[dashboard] signOut error:', err);
        alert('Error signing out: ' + (err && err.message ? err.message : String(err)));
      }
    });
  }
});
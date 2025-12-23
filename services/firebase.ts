
// Use Firebase v8 compat syntax to resolve "no exported member" errors.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

// Check if the config is still using placeholders
export const isFirebaseConfigured = 
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" && 
  firebaseConfig.apiKey.trim() !== "";

let authInstance: any;
let googleProviderInstance: any;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  authInstance = firebase.auth();
  googleProviderInstance = new firebase.auth.GoogleAuthProvider();
  googleProviderInstance.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.warn("Firebase failed to initialize. Falling back to Demo Mode functionality.");
}

export const auth = authInstance;
export const googleProvider = googleProviderInstance;

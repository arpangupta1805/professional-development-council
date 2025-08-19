// filepath: c:\pdc_offiicial\pdc-own\firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXMpuDU9-W3nMDSVjNtbj4-thx7se7xAU",
  authDomain: "insiit-325a2.firebaseapp.com",
  projectId: "insiit-325a2",
  storageBucket: "insiit-325a2.firebasestorage.app",
  messagingSenderId: "228932280435",
  appId: "1:228932280435:web:9d65ec4f89a4e7556b8a06",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
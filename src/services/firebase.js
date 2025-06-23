import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDEG-URR45zDK4jI3-ASNGTe2YnVMD1ukA",
    authDomain: "costs-51a14.firebaseapp.com",
    databaseURL: "https://costs-51a14-default-rtdb.firebaseio.com",
    projectId: "costs-51a14",
    storageBucket: "costs-51a14.firebasestorage.app",
    messagingSenderId: "289927056490",
    appId: "1:289927056490:web:195f2f18f6f05a5c8f0e13"
  };
  

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db }
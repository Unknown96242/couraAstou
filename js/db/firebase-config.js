import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, serverTimestamp, writeBatch, doc 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBuoWN7QWhuo0xfc8iEmfmvNp8saxuYeuo",
    authDomain: "couraastou-5b80e.firebaseapp.com",
    projectId: "couraastou-5b80e",
    storageBucket: "couraastou-5b80e.firebasestorage.app",
    messagingSenderId: "698131826517",
    appId: "1:698131826517:web:2969253a0ee6bc268151dc",
    measurementId: "G-5EQ0NDKSEK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { 
    db, collection, addDoc, serverTimestamp, writeBatch, doc 
};
// Import des bons modules (version modulaire Firebase v9+)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBuoWN7QWhuo0xfc8iEmfmvNp8saxuYeuo",
    authDomain: "couraastou-5b80e.firebaseapp.com",
    projectId: "couraastou-5b80e",
    storageBucket: "couraastou-5b80e.firebasestorage.app",
    messagingSenderId: "698131826517",
    appId: "1:698131826517:web:2969253a0ee6bc268151dc",
    measurementId: "G-5EQ0NDKSEK"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Correction ici (pas app.firestore())

// Récupérer et afficher les produits
async function displayProducts() {
  const productsContainer = document.getElementById('products-container');
  
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    productsContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      
      productsContainer.innerHTML += `
        <div class="product-card">
          <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
          <h3>${product.name}</h3>
          <p>Prix: ${product.price.toFixed(2)} €</p>
          <p>${product.description || ''}</p>
        </div>
      `;
    });

  } catch (error) {
    console.error("Erreur:", error);
    productsContainer.innerHTML = '<p>Erreur de chargement des produits</p>';
  }
}

// Appel initial
displayProducts();
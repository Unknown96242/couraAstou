import { 
    db, collection, addDoc, serverTimestamp, writeBatch, doc 
} from './db/firebase-config.js';
import { getFirestore, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

async function displayProducts() {
  const productsContainer = document.getElementById('products-container');
  
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    productsContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      
      

      productsContainer.innerHTML += `
        <div class="col mb-3 mb-sm-4 ">
            <div class="card h-100 shadow-sm">
                <img loading="lazy" class="card-img-top img-fluid" src=${product.images[0]['url']} alt="Produit">
                <div class="card-body p-3 p-sm-4">
                    <div class="text-center">
                        <h5 class="fw-bolder mb-2">${product.name}</h5>
                        <div class="d-flex justify-content-center small text-warning mb-2">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                        </div>
                        <div>${product.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-top-0 p-3 p-sm-4">
                    <a href="#" class="btn btn-outline-dark w-100">Ajouter</a>
                </div>
            </div>
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
// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBuoWN7QWhuo0xfc8iEmfmvNp8saxuYeuo",
    authDomain: "couraastou-5b80e.firebaseapp.com",
    projectId: "couraastou-5b80e",
    storageBucket: "couraastou-5b80e.firebasestorage.app",
    messagingSenderId: "698131826517",
    appId: "1:698131826517:web:2969253a0ee6bc268151dc",
    measurementId: "G-5EQ0NDKSEK"
};

// Initialisation Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Gestion du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fonctions du panier
function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        updateCart();
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    if (document.getElementById('cartModal').classList.contains('show')) {
        displayCart();
    }
}

function updateCartCounter() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-counter').forEach(el => {
        el.textContent = count;
    });
}

function displayCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="text-center py-4"><i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i><p class="text-muted">Votre panier est vide</p></div>';
        cartTotalEl.textContent = '0.00';
        return;
    }
    
    cartItemsEl.innerHTML = cart.map(item => `
        <div class=" mb-3">
            <div class="row g-0 align-items-center">
                <div class="col-md-2 text-center">
                    <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                </div>
                <div class="col-md-5">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text text-muted">${item.price.toFixed(2)} €</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center justify-content-center">
                        <button class="btn btn-outline-secondary quantity-control minus" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" value="${item.quantity}" 
                               class="form-control quantity-input mx-2" 
                               data-id="${item.id}" min="1">
                        <button class="btn btn-outline-secondary quantity-control plus" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <h5>${(item.price * item.quantity).toFixed(2)} €</h5>
                    <button class="btn btn-outline-danger btn-sm remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = total.toFixed(2);
}

// Chargement des produits
function loadProducts() {
    db.collection("products").get().then((querySnapshot) => {
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            productsContainer.innerHTML += `
                <div class=" col-md-4 mb-4">
                    <div class=" product-card h-100">
                        <img src="${product.images[0]?.url || 'https://via.placeholder.com/300'}" 
                             class="card-img-top product-img" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">${product.price.toFixed(2)} €</h5>
                                <button class="btn btn-primary add-to-cart" 
                                        data-id="${doc.id}"
                                        data-name="${product.name}"
                                        data-price="${product.price}"
                                        data-image="${product.images[0]?.url || 'https://via.placeholder.com/300'}">
                                    <i class="fas fa-cart-plus"></i> Ajouter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Ajout des événements après le chargement des produits
        setupEventListeners();
    });
}

// Gestion des événements
function setupEventListeners() {
    // Bouton panier
    document.getElementById('cartButton').addEventListener('click', () => {
        displayCart();
        new bootstrap.Modal('#cartModal').show();
    });
    
    // Bouton passer commande
    document.getElementById('checkoutButton').addEventListener('click', () => {
        alert('Fonctionnalité de paiement à implémenter');
    });
    
    // Gestion des clics sur les boutons "Ajouter au panier"
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };
            addToCart(product);
            
            // Animation feedback
            const icon = button.querySelector('i');
            icon.classList.remove('fa-cart-plus');
            icon.classList.add('fa-check');
            setTimeout(() => {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-cart-plus');
            }, 1000);
        }
        
        // Suppression d'article
        if (e.target.closest('.remove-item')) {
            const productId = e.target.closest('button').dataset.id;
            removeFromCart(productId);
        }
        
        // Modification quantité
        if (e.target.closest('.quantity-control')) {
            const button = e.target.closest('button');
            const productId = button.dataset.id;
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            let newQuantity = parseInt(input.value);
            
            if (button.classList.contains('plus')) {
                newQuantity++;
            } else {
                newQuantity--;
            }
            
            updateQuantity(productId, newQuantity);
            input.value = newQuantity;
        }
        
        // Changement direct de quantité
        if (e.target.classList.contains('quantity-input')) {
            const input = e.target;
            const productId = input.dataset.id;
            const newQuantity = parseInt(input.value) || 1;
            updateQuantity(productId, newQuantity);
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    loadProducts();
});
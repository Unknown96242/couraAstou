const cartLink = document.getElementById('cart-link');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartButton = document.getElementById('close-cart');

// Ouvrir le panier
cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartOverlay.classList.add('active');
});

// Fermer le panier
closeCartButton.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
});

// Fermer le panier en cliquant en dehors
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        cartOverlay.classList.remove('active');
    }
});
// Configuration de l'Observer
const lazyBgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bgUrl = entry.target.getAttribute('data-bg');
            entry.target.style.backgroundImage = bgUrl;
            
            // Option : Effet de fondu progressif
            entry.target.style.opacity = '0';
            let opacity = 0;
            const fadeIn = setInterval(() => {
                opacity += 0.05;
                entry.target.style.opacity = opacity;
                if (opacity >= 1) clearInterval(fadeIn);
            }, 20);
            
            lazyBgObserver.unobserve(entry.target);
        }
    });
}, { 
    rootMargin: '200px', // Déclenchement 200px avant l'élément
    threshold: 0.1 
});

// Application à tous les éléments
document.querySelectorAll('.lazy-bg').forEach(el => {
    lazyBgObserver.observe(el);
});
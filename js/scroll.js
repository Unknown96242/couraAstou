
// Animation au scroll
document.addEventListener('DOMContentLoaded', function() {
    // Configuration de l'observateur
    const observerOptions = {
        threshold: 0.07,
        rootMargin: '0px 0px -100px 0px'
    };
  
    // Fonction de callback pour l'observateur
    const animationCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Arrête d'observer après l'animation
            }
        });
    };
  
    // Création de l'observateur
    const observer = new IntersectionObserver(animationCallback, observerOptions);
  
    // Ciblage des éléments à animer
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Application des délais progressifs
    animatedElements.forEach((element, index) => {
        element.style.setProperty('--delay-index', index);
        observer.observe(element);
    });
  
    // Fallback pour les anciens navigateurs
    if (!('IntersectionObserver' in window)) {
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        document.head.appendChild(script);
        
        // Fallback : afficher tout sans animation si l'API n'est pas supportée
        script.onload = function() {
            animatedElements.forEach(el => el.classList.add('visible'));
        };
    }
  });
  
    
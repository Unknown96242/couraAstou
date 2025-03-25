let swiperCards = new Swiper(".card__content", {
    loop: true,
    spaceBetween: 32,
    grabCursor: true,
  
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
  
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  
    breakpoints:{
      600: {
        slidesPerView: 2,
      },
      968: {
        slidesPerView: 3,
      },
    },
  });



// Sélection des éléments
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('.video');
const playButton = document.querySelector('.play-button');
const playOverlay = document.querySelector('.play-overlay');
const videoThumbnail = document.querySelector('.video-thumbnail');

// Fonction pour lancer la vidéo
playButton.addEventListener('click', () => {
  // Affiche la vidéo
  video.style.display = 'block';
  
  // Cache l'image de fond et le bouton Play
  videoThumbnail.style.display = 'none';
  playOverlay.style.display = 'none';
  
  // Lance la vidéo (nécessite l'API YouTube)
  const videoSrc = video.src;
  video.src = videoSrc + "&autoplay=1"; // Ajoute le paramètre autoplay
});
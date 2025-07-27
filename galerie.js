// ORKA SERVICES - Script Galerie
// Gestion de la galerie, lightbox et filtres

let currentImageIndex = 0;
let galleryImages = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryFilters();
    initializeLightbox();
    initializeGalleryAnimations();
    collectGalleryImages();
});

// === GESTION DES FILTRES DE GALERIE ===
function initializeGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filters .filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');

            // Obtenir la catégorie sélectionnée
            const selectedCategory = this.getAttribute('data-category');

            // Filtrer les éléments de la galerie
            filterGalleryItems(selectedCategory, galleryItems);
        });
    });
}

function filterGalleryItems(category, galleryItems) {
    galleryItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            // Afficher l'élément avec animation
            item.style.display = 'block';
            item.classList.remove('hidden');
            
            // Animation d'apparition avec délai
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, index * 50);
        } else {
            // Masquer l'élément avec animation
            item.classList.add('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            
            // Masquer complètement après l'animation
            setTimeout(() => {
                if (item.classList.contains('hidden')) {
                    item.style.display = 'none';
                }
            }, 300);
        }
    });

    // Recollect visible images for lightbox navigation
    setTimeout(() => {
        collectGalleryImages();
    }, 350);
}

// === GESTION DU LIGHTBOX ===
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');

    // Fermer le lightbox
    closeLightbox.addEventListener('click', closeLightboxModal);
    
    // Fermer en cliquant sur l'arrière-plan
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxModal();
        }
    });

    // Navigation avec les boutons
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightboxModal();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        }
    });
}

function openLightbox(imageSrc, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');

    // Trouver l'index de l'image actuelle
    currentImageIndex = galleryImages.findIndex(img => img.src === imageSrc);

    // Mettre à jour le contenu du lightbox
    lightboxImage.src = imageSrc;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;

    // Afficher le lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animation d'entrée
    lightboxImage.style.opacity = '0';
    setTimeout(() => {
        lightboxImage.style.opacity = '1';
    }, 100);
}

function closeLightboxModal() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    if (galleryImages.length === 0) return;

    currentImageIndex += direction;
    
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }

    const currentImage = galleryImages[currentImageIndex];
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');

    // Animation de transition
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImage.src = currentImage.src;
        lightboxTitle.textContent = currentImage.title;
        lightboxDescription.textContent = currentImage.description;
        lightboxImage.style.opacity = '1';
    }, 200);
}

function collectGalleryImages() {
    galleryImages = [];
    const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
    
    visibleItems.forEach(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-overlay h3').textContent;
        const description = item.querySelector('.gallery-overlay p').textContent;
        
        galleryImages.push({
            src: img.src,
            title: title,
            description: description
        });
    });
}

// === ANIMATIONS DE LA GALERIE ===
function initializeGalleryAnimations() {
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observer les éléments de la galerie
    document.querySelectorAll('.gallery-item, .testimonial').forEach(el => {
        observer.observe(el);
    });

    // Animation des boutons de visualisation
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// === LAZY LOADING POUR LA GALERIE ===
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('.gallery-image img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// === MASONRY LAYOUT (optionnel) ===
function initializeMasonry() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    // Fonction pour ajuster la hauteur des éléments
    function adjustGridItems() {
        const items = grid.querySelectorAll('.gallery-item:not(.hidden)');
        items.forEach(item => {
            const content = item.querySelector('.gallery-image');
            const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
            const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
            const rowSpan = Math.ceil((content.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
            item.style.gridRowEnd = `span ${rowSpan}`;
        });
    }

    // Ajuster au chargement des images
    const images = grid.querySelectorAll('img');
    let loadedImages = 0;

    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    adjustGridItems();
                }
            });
        }
    });

    if (loadedImages === images.length) {
        adjustGridItems();
    }

    // Réajuster lors du redimensionnement
    window.addEventListener('resize', adjustGridItems);
}

// === PARTAGE SOCIAL ===
function shareImage(imageSrc, title) {
    if (navigator.share) {
        navigator.share({
            title: `ORKA SERVICES - ${title}`,
            text: `Découvrez cette belle réalisation de ORKA SERVICES`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API de partage
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(`Découvrez cette belle réalisation de ORKA SERVICES: ${title} - ${window.location.href}`)}`;
        window.open(shareUrl, '_blank');
    }
}

// === TÉLÉCHARGEMENT D'IMAGE (optionnel) ===
function downloadImage(imageSrc, filename) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = filename || 'orka-services-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// === GESTION DES ERREURS ===
document.querySelectorAll('.gallery-image img').forEach(img => {
    img.addEventListener('error', function() {
        this.parentElement.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

// === AUTO-PLAY SLIDESHOW (optionnel) ===
let slideshowInterval;

function startSlideshow() {
    if (galleryImages.length <= 1) return;
    
    slideshowInterval = setInterval(() => {
        navigateLightbox(1);
    }, 3000);
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// Démarrer/arrêter le slideshow avec la barre d'espace
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && document.getElementById('lightbox').classList.contains('active')) {
        e.preventDefault();
        if (slideshowInterval) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    }
});

// Initialiser le lazy loading
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    // initializeMasonry(); // Décommentez si vous voulez un layout masonry
});


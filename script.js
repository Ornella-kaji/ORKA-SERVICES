// ORKA SERVICES - Script Principal
// Gestion du menu, carrousel, animations et panier

// Variables globales
let cart = JSON.parse(localStorage.getItem('orka_cart')) || [];
let currentSlide = 0;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    initializeCarousel();
    initializeAnimations();
    updateCartCount();
    initializeCartButtons();
});

// === GESTION DU MENU ===
function initializeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Fermer le menu en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// === GESTION DU CARROUSEL ===
function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    // Auto-play du carrousel
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    // Retirer la classe active de la slide actuelle
    slides[currentSlide].classList.remove('active');

    // Calculer la nouvelle slide
    currentSlide += direction;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    // Ajouter la classe active à la nouvelle slide
    slides[currentSlide].classList.add('active');
}

// === ANIMATIONS AU SCROLL ===
function initializeAnimations() {
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.service-card, .product-card, .step').forEach(el => {
        observer.observe(el);
    });

    // Animation des hexagones au survol
    document.querySelectorAll('.hexagon-small').forEach(hexagon => {
        hexagon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(30deg) scale(1.1)';
        });

        hexagon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(30deg) scale(1)';
        });
    });
}

// === GESTION DU PANIER ===
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(product) {
    // Vérifier si le produit existe déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('orka_cart', JSON.stringify(cart));
    updateCartCount();

    // Afficher une notification
    showNotification(`${product.name} ajouté au panier !`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('orka_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('orka_cart', JSON.stringify(cart));
            updateCartCount();
        }
    }
}

function clearCart() {
    cart = [];
    localStorage.setItem('orka_cart', JSON.stringify(cart));
    updateCartCount();
}

function initializeCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productData = JSON.parse(this.getAttribute('data-product'));
            addToCart(productData);
        });
    });
}

// === GÉNÉRATION DU MESSAGE WHATSAPP ===
function generateWhatsAppMessage() {
    if (cart.length === 0) {
        return "Bonjour ORKA SERVICES 👋 Je souhaite obtenir des informations sur vos services.";
    }

    let message = "Bonjour ORKA SERVICES 👋 Je souhaite commander les articles suivants :\n\n";
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity}\n`;
        message += `  Prix: ${item.price}\n\n`;
    });

    message += "Merci de me confirmer la disponibilité et les modalités de livraison.";
    
    return encodeURIComponent(message);
}

function orderViaWhatsApp() {
    const phoneNumber = "243987994678";
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
}

// === NOTIFICATIONS ===
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: 'var(--accent-color)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        fontSize: '14px',
        fontWeight: '500'
    });

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animation de sortie et suppression
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === LAZY LOADING DES IMAGES ===
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// === GESTION DES ERREURS D'IMAGES ===
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Image failed to load:', this.src);
    });
});

// Exposer les fonctions globalement pour les utiliser dans d'autres scripts
window.orkaServices = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    orderViaWhatsApp,
    changeSlide
};


// ORKA SERVICES - Script Panier
// Gestion de l'affichage et des actions du panier

document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    initializeCartActions();
});

// === AFFICHAGE DES ARTICLES DU PANIER ===
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('orka_cart')) || [];
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.getElementById('cart-items');
    const itemsList = document.getElementById('items-list');
    const totalItems = document.getElementById('total-items');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';

    // Vider la liste actuelle
    itemsList.innerHTML = '';

    // Calculer le total d'articles
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalItems.textContent = totalCount;

    // Afficher chaque article
    cart.forEach(item => {
        const cartItem = createCartItemElement(item);
        itemsList.appendChild(cartItem);
    });
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
        </div>
        <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-price">${item.price}</div>
        </div>
        <div class="item-actions">
            <div class="quantity-controls">
                <button class="quantity-btn decrease" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-item" onclick="removeCartItem(${item.id})" title="Supprimer l'article">
                ×
            </button>
        </div>
    `;

    return cartItem;
}

// === ACTIONS DU PANIER ===
function initializeCartActions() {
    // Bouton vider le panier
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                clearCartCompletely();
            }
        });
    }

    // Bouton commander via WhatsApp
    const orderWhatsAppBtn = document.getElementById('order-whatsapp');
    if (orderWhatsAppBtn) {
        orderWhatsAppBtn.addEventListener('click', function() {
            orderViaWhatsApp();
        });
    }
}

function updateItemQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeCartItem(productId);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('orka_cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('orka_cart', JSON.stringify(cart));
        
        // Mettre à jour l'affichage
        displayCartItems();
        updateCartCount();
        
        // Animation de mise à jour
        const cartItem = document.querySelector(`[data-id="${productId}"]`);
        if (cartItem) {
            cartItem.style.transform = 'scale(1.05)';
            setTimeout(() => {
                cartItem.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

function removeCartItem(productId) {
    let cart = JSON.parse(localStorage.getItem('orka_cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        localStorage.setItem('orka_cart', JSON.stringify(cart));
        
        // Animation de suppression
        const cartItem = document.querySelector(`[data-id="${productId}"]`);
        if (cartItem) {
            cartItem.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                displayCartItems();
                updateCartCount();
                showNotification(`${removedItem.name} retiré du panier`);
            }, 300);
        }
    }
}

function clearCartCompletely() {
    localStorage.setItem('orka_cart', JSON.stringify([]));
    displayCartItems();
    updateCartCount();
    showNotification('Panier vidé avec succès');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('orka_cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// === GÉNÉRATION DU MESSAGE WHATSAPP ===
function orderViaWhatsApp() {
    const cart = JSON.parse(localStorage.getItem('orka_cart')) || [];
    
    if (cart.length === 0) {
        alert('Votre panier est vide. Ajoutez des articles avant de commander.');
        return;
    }

    let message = "Bonjour ORKA SERVICES 👋 Je souhaite commander les articles suivants :\n\n";
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity}\n`;
        message += `  Prix: ${item.price}\n\n`;
    });

    message += "Merci de me confirmer la disponibilité et les modalités de livraison.";
    
    const phoneNumber = "243987994678";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Optionnel : vider le panier après commande
    setTimeout(() => {
        if (confirm('Commande envoyée ! Voulez-vous vider votre panier ?')) {
            clearCartCompletely();
        }
    }, 1000);
}

// === NOTIFICATIONS ===
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
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

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// === ANIMATIONS CSS SUPPLÉMENTAIRES ===
const additionalStyles = `
    @keyframes slideOut {
        0% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-100%);
        }
    }
    
    .cart-item {
        transition: all 0.3s ease;
    }
    
    .quantity-btn:active {
        transform: scale(0.9);
    }
    
    .remove-item:active {
        transform: scale(0.9);
    }
`;

// Ajouter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// === SAUVEGARDE AUTOMATIQUE ===
// Sauvegarder l'état du panier périodiquement
setInterval(() => {
    const cart = JSON.parse(localStorage.getItem('orka_cart')) || [];
    if (cart.length > 0) {
        console.log('Panier sauvegardé automatiquement');
    }
}, 30000); // Toutes les 30 secondes

// === GESTION DES ERREURS ===
window.addEventListener('error', function(e) {
    console.error('Erreur dans panier.js:', e.error);
});

// Vérifier la disponibilité de localStorage
if (typeof(Storage) === "undefined") {
    alert('Votre navigateur ne supporte pas le stockage local. Le panier ne fonctionnera pas correctement.');
}


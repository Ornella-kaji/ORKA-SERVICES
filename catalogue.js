// ORKA SERVICES - Script Catalogue
// Gestion du filtrage des produits

document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeProductAnimations();
});

// === GESTION DES FILTRES ===
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');

            // Obtenir la catégorie sélectionnée
            const selectedCategory = this.getAttribute('data-category');

            // Filtrer les produits
            filterProducts(selectedCategory, productCards);
        });
    });
}

function filterProducts(category, productCards) {
    productCards.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            // Afficher le produit avec animation
            card.style.display = 'block';
            card.classList.remove('hidden');
            
            // Animation d'apparition
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            // Masquer le produit avec animation
            card.classList.add('hidden');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            // Masquer complètement après l'animation
            setTimeout(() => {
                if (card.classList.contains('hidden')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });

    // Mettre à jour le compteur de produits
    updateProductCount(category, productCards);
}

function updateProductCount(category, productCards) {
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        if (category === 'all' || productCategory === category) {
            visibleCount++;
        }
    });

    // Afficher le nombre de produits (optionnel)
    const countElement = document.getElementById('product-count');
    if (countElement) {
        countElement.textContent = `${visibleCount} produit${visibleCount > 1 ? 's' : ''}`;
    }
}

// === ANIMATIONS DES PRODUITS ===
function initializeProductAnimations() {
    const productCards = document.querySelectorAll('.product-card');

    // Animation au scroll
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

    productCards.forEach(card => {
        observer.observe(card);
    });

    // Animation des boutons d'ajout au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Effet de particules (optionnel)
            createParticleEffect(e.target);
        });
    });
}

// === EFFET DE PARTICULES ===
function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${centerX}px;
            top: ${centerY}px;
        `;

        document.body.appendChild(particle);

        // Animation des particules
        const angle = (i * 60) * Math.PI / 180;
        const distance = 50 + Math.random() * 30;
        const duration = 600 + Math.random() * 400;

        particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// === RECHERCHE DE PRODUITS ===
function initializeSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const productName = card.querySelector('.product-info h3').textContent.toLowerCase();
            const productDescription = card.querySelector('.product-description').textContent.toLowerCase();

            if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
    });
}

// === TRI DES PRODUITS ===
function sortProducts(sortBy) {
    const productsGrid = document.getElementById('products-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    productCards.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return nameA.localeCompare(nameB);
            
            case 'price':
                // Extraction du prix (simplifié)
                const priceA = extractPrice(a.querySelector('.product-price').textContent);
                const priceB = extractPrice(b.querySelector('.product-price').textContent);
                return priceA - priceB;
            
            default:
                return 0;
        }
    });

    // Réorganiser les éléments dans le DOM
    productCards.forEach(card => {
        productsGrid.appendChild(card);
    });
}

function extractPrice(priceText) {
    const match = priceText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// === MODAL DE PRODUIT (optionnel) ===
function openProductModal(productData) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-image">
                <img src="${productData.image}" alt="${productData.name}">
            </div>
            <div class="modal-info">
                <h2>${productData.name}</h2>
                <p class="modal-price">${productData.price}</p>
                <p class="modal-description">${productData.description}</p>
                <button class="btn btn-primary add-to-cart-modal" data-product='${JSON.stringify(productData)}'>
                    Ajouter au panier
                </button>
            </div>
        </div>
    `;

    // Styles du modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;

    document.body.appendChild(modal);

    // Fermer le modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Bouton d'ajout au panier dans le modal
    modal.querySelector('.add-to-cart-modal').addEventListener('click', function() {
        const productData = JSON.parse(this.getAttribute('data-product'));
        window.orkaServices.addToCart(productData);
        modal.remove();
    });
}

// Initialiser la recherche si l'élément existe
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});


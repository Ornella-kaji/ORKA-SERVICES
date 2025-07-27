// ORKA SERVICES - Script Contact
// Gestion du formulaire de contact et validation

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
});

// === GESTION DU FORMULAIRE DE CONTACT ===
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    
    // Validation en temps réel
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Valider tous les champs
    if (!validateForm(form)) {
        showNotification('Veuillez corriger les erreurs dans le formulaire.', 'error');
        return;
    }
    
    // Afficher l'état de chargement
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Collecter les données du formulaire
    const formData = collectFormData(form);
    
    // Simuler l'envoi (en réalité, cela redirigerait vers WhatsApp)
    setTimeout(() => {
        sendViaWhatsApp(formData);
        
        // Réinitialiser le bouton
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        // Réinitialiser le formulaire
        form.reset();
        
        // Afficher le message de succès
        showSuccessMessage();
    }, 2000);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Supprimer les erreurs précédentes
    clearFieldError(field);
    
    // Validation des champs requis
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Ce champ est obligatoire.';
        isValid = false;
    }
    
    // Validations spécifiques
    if (value && fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Veuillez entrer une adresse email valide.';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'phone') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
            isValid = false;
        }
    }
    
    if (value && fieldName === 'name' && value.length < 2) {
        errorMessage = 'Le nom doit contenir au moins 2 caractères.';
        isValid = false;
    }
    
    if (value && fieldName === 'message' && value.length < 10) {
        errorMessage = 'Le message doit contenir au moins 10 caractères.';
        isValid = false;
    }
    
    // Afficher l'erreur si nécessaire
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Créer ou mettre à jour le message d'erreur
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function sendViaWhatsApp(formData) {
    let message = "Bonjour ORKA SERVICES 👋\n\n";
    message += "Nouvelle demande de contact :\n\n";
    message += `👤 Nom: ${formData.name}\n`;
    message += `📧 Email: ${formData.email}\n`;
    message += `📞 Téléphone: ${formData.phone}\n`;
    
    if (formData['event-type']) {
        message += `🎉 Type d'événement: ${formData['event-type']}\n`;
    }
    
    if (formData['event-date']) {
        message += `📅 Date prévue: ${formData['event-date']}\n`;
    }
    
    if (formData.guests) {
        message += `👥 Nombre d'invités: ${formData.guests}\n`;
    }
    
    if (formData.budget) {
        message += `💰 Budget: ${formData.budget}\n`;
    }
    
    message += `\n📝 Message:\n${formData.message}\n\n`;
    message += "Merci de me recontacter rapidement.";
    
    const phoneNumber = "243987994678";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <strong>Message envoyé avec succès !</strong><br>
        Votre demande a été transmise via WhatsApp. Nous vous recontacterons rapidement.
    `;
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
        }
    }, 5000);
    
    // Faire défiler vers le message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// === GESTION DES FAQ (optionnel) ===
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Animation de mise en évidence
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// === VALIDATION DU FORMULAIRE EN TEMPS RÉEL ===
function setupRealTimeValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validation lors de la saisie
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
        
        // Validation lors de la perte de focus
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// === FORMATAGE AUTOMATIQUE DU TÉLÉPHONE ===
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Supprimer tous les non-chiffres
        
        // Ajouter le préfixe +243 si nécessaire
        if (value.length > 0 && !value.startsWith('243')) {
            if (value.startsWith('0')) {
                value = '243' + value.substring(1);
            } else if (!value.startsWith('243')) {
                value = '243' + value;
            }
        }
        
        // Formater le numéro
        if (value.length >= 3) {
            value = '+' + value.substring(0, 3) + ' ' + value.substring(3);
        }
        
        this.value = value;
    });
}

// === SUGGESTIONS AUTOMATIQUES ===
function setupAutoSuggestions() {
    const eventTypeSelect = document.getElementById('event-type');
    const messageTextarea = document.getElementById('message');
    
    if (eventTypeSelect && messageTextarea) {
        eventTypeSelect.addEventListener('change', function() {
            const suggestions = {
                'mariage': 'Je planifie mon mariage et j\'aimerais connaître vos services pour la robe, la décoration et la vaisselle...',
                'anniversaire': 'J\'organise un anniversaire et je recherche des décorations élégantes et de la vaisselle...',
                'corporate': 'Nous organisons un événement d\'entreprise et avons besoin de services de décoration professionnelle...',
                'bapteme': 'Nous célébrons un baptême et souhaitons une décoration douce et élégante...',
                'reception': 'Nous organisons une réception et cherchons des services complets de décoration et vaisselle...'
            };
            
            if (suggestions[this.value] && !messageTextarea.value.trim()) {
                messageTextarea.value = suggestions[this.value];
                messageTextarea.focus();
            }
        });
    }
}

// === NOTIFICATIONS ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const colors = {
        'info': 'var(--accent-color)',
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107'
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: colors[type] || colors.info,
        color: type === 'warning' ? '#000' : 'white',
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
    }, 4000);
}

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', function() {
    setupRealTimeValidation();
    setupPhoneFormatting();
    setupAutoSuggestions();
});

// === GESTION DES ERREURS ===
window.addEventListener('error', function(e) {
    console.error('Erreur dans contact.js:', e.error);
});

// === ACCESSIBILITÉ ===
document.addEventListener('keydown', function(e) {
    // Navigation au clavier dans les FAQ
    if (e.target.classList.contains('faq-item') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
    }
});


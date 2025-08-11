// Main JavaScript for Cat Blog
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initAnimations();
    initLikeButtons();
    initFlashMessages();
    initFormValidation();
    initParallaxEffects();
    initCatPaws();
});

// Smooth animations on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.post-card, .form-container, .post-detail').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// Like button functionality
function initLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!button.dataset.postId) return;
            
            const postId = button.dataset.postId;
            const likeCount = button.querySelector('.like-count');
            
            // Add loading state
            button.disabled = true;
            button.innerHTML = '<span class="loading"></span>';
            
            fetch(`/post/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showFlashMessage(data.error, 'error');
                    return;
                }
                
                // Update button state
                if (data.liked) {
                    button.classList.add('liked');
                    button.innerHTML = `❤️ <span class="like-count">${data.count}</span>`;
                } else {
                    button.classList.remove('liked');
                    button.innerHTML = `🤍 <span class="like-count">${data.count}</span>`;
                }
                
                // Add heart animation
                const heart = document.createElement('div');
                heart.innerHTML = '❤️';
                heart.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    pointer-events: none;
                    animation: heartFloat 1s ease-out forwards;
                    z-index: 1000;
                `;
                button.appendChild(heart);
                
                setTimeout(() => heart.remove(), 1000);
            })
            .catch(error => {
                console.error('Error:', error);
                showFlashMessage('Something went wrong!', 'error');
            })
            .finally(() => {
                button.disabled = false;
            });
        });
    });
}

// Flash messages
function initFlashMessages() {
    // Auto-hide flash messages after 5 seconds
    setTimeout(() => {
        document.querySelectorAll('.flash-message').forEach(message => {
            message.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => message.remove(), 500);
        });
    }, 5000);
}

function showFlashMessage(message, type = 'info') {
    const flashContainer = document.querySelector('.flash-messages') || createFlashContainer();
    
    const flashMessage = document.createElement('div');
    flashMessage.className = `flash-message flash-${type}`;
    flashMessage.textContent = message;
    
    flashContainer.appendChild(flashMessage);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        flashMessage.style.animation = 'slideOutRight 0.5s ease-out forwards';
        setTimeout(() => flashMessage.remove(), 500);
    }, 5000);
}

function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    document.body.appendChild(container);
    return container;
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#f5576c';
                    field.style.boxShadow = '0 0 0 3px rgba(245, 87, 108, 0.1)';
                } else {
                    field.style.borderColor = '#e1e5e9';
                    field.style.boxShadow = 'none';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFlashMessage('Please fill in all required fields!', 'error');
            }
        });
    });
}

// Parallax effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Cat paw decorations
function initCatPaws() {
    const pawCount = 5;
    
    for (let i = 0; i < pawCount; i++) {
        createCatPaw();
    }
}

function createCatPaw() {
    const paw = document.createElement('div');
    paw.className = 'cat-paw';
    paw.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s;
        z-index: -1;
    `;
    
    document.body.appendChild(paw);
    
    // Remove and recreate paw after animation
    setTimeout(() => {
        paw.remove();
        setTimeout(createCatPaw, Math.random() * 5000);
    }, 10000);
}

// Image upload preview
function initImagePreview() {
    const imageInputs = document.querySelectorAll('input[type="file"]');
    
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('img');
                    preview.src = e.target.result;
                    preview.style.cssText = `
                        max-width: 200px;
                        max-height: 200px;
                        border-radius: 10px;
                        margin-top: 10px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    `;
                    
                    const container = input.parentElement;
                    const existingPreview = container.querySelector('img');
                    if (existingPreview) {
                        existingPreview.remove();
                    }
                    container.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

// Smooth scrolling for anchor links
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px) scale(1.5);
            opacity: 0;
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
    
    .post-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .post-card:hover {
        transform: translateY(-10px) scale(1.02);
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }
    
    .btn:hover::before {
        left: 100%;
    }
    
    .form-input:focus {
        transform: scale(1.02);
    }
    
    .like-btn {
        position: relative;
        overflow: hidden;
    }
    
    .like-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 107, 107, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    }
    
    .like-btn:active::before {
        width: 100px;
        height: 100px;
    }
`;

document.head.appendChild(style);

// Initialize image preview when DOM is loaded
document.addEventListener('DOMContentLoaded', initImagePreview);

// Add some fun cat-themed console messages
console.log('🐱 Welcome to the Cat Blog! 🐱');
console.log('Meow! The blog is ready to serve you with purr-fect content! 😸'); 
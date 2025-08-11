// Enhanced Cat Blog JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhanced components
    initAdvancedAnimations();
    initEnhancedLikeButtons();
    initMagicCursor();
    initParticleEffects();
    initFlashMessages();
    initFormValidation();
    initParallaxEffects();
    initCatPaws();
    initScrollEffects();
    initInteractiveCards();
    initTypingEffect();
    initMobileMenu();
});

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// Advanced animations with stagger effect
function initAdvancedAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotateX(0)';
                    entry.target.classList.add('animate-in');
                }, index * 100); // Stagger effect
            }
        });
    }, observerOptions);

    // Observe all cards and sections with enhanced effects
    document.querySelectorAll('.post-card, .form-container, .post-detail').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) rotateX(10deg)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
        
        // Add random delay for more organic feel
        el.style.transitionDelay = `${Math.random() * 0.3}s`;
    });
}

// Magic cursor effect
function initMagicCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'magic-cursor';
    document.body.appendChild(cursor);
    
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
    });
    
    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Interactive elements
    document.querySelectorAll('a, button, .post-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });
}

// Particle effects on interaction
function initParticleEffects() {
    function createParticle(x, y, color = '#667eea') {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleFloat 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
    
    // Create particles on button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('button, .btn, .like-btn')) {
            const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b'];
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    createParticle(
                        e.clientX + (Math.random() - 0.5) * 100,
                        e.clientY + (Math.random() - 0.5) * 100,
                        colors[Math.floor(Math.random() * colors.length)]
                    );
                }, i * 50);
            }
        }
    });
}

// Enhanced like button functionality
function initEnhancedLikeButtons() {
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
                
                // Enhanced heart animation with multiple hearts
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const heart = document.createElement('div');
                        heart.innerHTML = '❤️';
                        heart.style.cssText = `
                            position: absolute;
                            font-size: ${15 + Math.random() * 10}px;
                            pointer-events: none;
                            animation: heartFloat 2s ease-out forwards;
                            z-index: 1000;
                            left: ${Math.random() * 20 - 10}px;
                            top: ${Math.random() * 20 - 10}px;
                            filter: hue-rotate(${Math.random() * 60}deg);
                        `;
                        button.appendChild(heart);
                        
                        setTimeout(() => heart.remove(), 2000);
                    }, i * 200);
                }
                
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: radial-gradient(circle, rgba(255,107,107,0.4) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: rippleEffect 0.6s ease-out forwards;
                    pointer-events: none;
                    z-index: 1;
                `;
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
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

// Refined scroll effects
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.2; // Reduced parallax intensity
        
        // Subtle parallax background
        document.body.style.backgroundPositionY = `${rate}px`;
        
        // Gentle header opacity change
        const header = document.querySelector('.header');
        if (header) {
            const opacity = Math.min(0.12 + (scrolled / 1000) * 0.08, 0.2); // Very subtle change
            header.style.background = `rgba(255, 255, 255, ${opacity})`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Subtle card interactions (disabled tilt for better UX)
function initInteractiveCards() {
    // Disabled tilt effect as it was causing discomfort
    // Cards now use simple hover effects defined in CSS
}

// Typing effect for hero text
function initTypingEffect() {
    const heroText = document.querySelector('.hero h1');
    if (!heroText) return;
    
    const text = heroText.textContent;
    heroText.textContent = '';
    heroText.style.borderRight = '2px solid rgba(255,255,255,0.8)';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing
            setTimeout(() => {
                heroText.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing after a delay
    setTimeout(typeWriter, 500);
}

// Enhanced CSS animations via JavaScript
const enhancedAnimations = `
    .magic-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(102, 126, 234, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, background 0.2s ease;
        mix-blend-mode: difference;
    }
    
    .cursor-follower {
        position: fixed;
        width: 40px;
        height: 40px;
        background: rgba(240, 147, 251, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.2s ease;
        backdrop-filter: blur(5px);
    }
    
    .cursor-hover {
        transform: scale(1.5) !important;
        background: rgba(245, 87, 108, 0.8) !important;
    }
    
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(0);
        }
    }
    
    @keyframes rippleEffect {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    @keyframes heartFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translateY(-60px) scale(1.5) rotate(20deg);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .post-card {
        transform-style: preserve-3d;
        will-change: transform;
    }
    
    .form-container {
        will-change: transform;
    }
    
    /* Enhanced glassmorphism effects */
    .post-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
            rgba(255,255,255,0.1) 0%, 
            transparent 50%, 
            rgba(255,255,255,0.05) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 1;
    }
    
    .post-card:hover::after {
        opacity: 1;
    }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedAnimations;
document.head.appendChild(styleSheet);

// Add some fun cat-themed console messages
console.log('🐱 Welcome to the Enhanced Cat Blog! 🐱');
console.log('Meow! The blog is ready to serve you with purr-fect enhanced content! 😸');
console.log('✨ New features: Magic cursor, particle effects, enhanced animations! ✨'); 
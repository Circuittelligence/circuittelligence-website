// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeInteractions();
    initializeScrollEffects();
});

// Initialize GSAP Animations
function initializeAnimations() {
    // Hero section fade-in animation
    gsap.set('.logo-mark, .hero-tagline', { opacity: 0, y: 20 });
    
    gsap.timeline()
        .to('.logo-mark', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 })
        .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');

    // About section animation
    gsap.set('.about-content p', { opacity: 0, y: 30 });
    
    ScrollTrigger.create({
        trigger: '#about',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.about-content p', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }
    });

    // Platform nodes animation
    gsap.set('.platform-node', { opacity: 0, scale: 0.8 });
    
    ScrollTrigger.create({
        trigger: '#platform',
        start: 'top 70%',
        onEnter: () => {
            gsap.to('.platform-node', {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });
        }
    });

    // Experience items animation
    gsap.set('.experience-item', { opacity: 0, x: -50 });
    
    ScrollTrigger.create({
        trigger: '#experiences',
        start: 'top 70%',
        onEnter: () => {
            gsap.to('.experience-item', {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }
    });

    // Insights tiles animation
    gsap.set('.insight-tile', { opacity: 0, y: 40 });
    
    ScrollTrigger.create({
        trigger: '#insights',
        start: 'top 70%',
        onEnter: () => {
            gsap.to('.insight-tile', {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.15,
                ease: 'power2.out'
            });
        }
    });

    // Contact section animation
    gsap.set('.contact-content', { opacity: 0, y: 30 });
    
    ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.contact-content', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    });
}

// Initialize Interactive Elements
function initializeInteractions() {
    // Platform node interactions
    const platformNodes = document.querySelectorAll('.platform-node');
    const productOverlays = document.querySelectorAll('.product-overlay');
    
    platformNodes.forEach(node => {
        node.addEventListener('click', function() {
            const product = this.dataset.product;
            const overlay = document.getElementById(`${product}-overlay`);
            
            if (overlay) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        // Hover effects
        node.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.node-light'), {
                scale: 1.3,
                boxShadow: '0 0 30px var(--sky-blue)',
                duration: 0.3
            });
        });

        node.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.node-light'), {
                scale: 1,
                boxShadow: '0 0 20px var(--sky-blue)',
                duration: 0.3
            });
        });
    });

    // Close overlay functionality
    productOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        const learnMoreBtn = overlay.querySelector('.learn-more-btn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function() {
                // Placeholder for learn more functionality
                console.log('Learn more clicked for:', overlay.id);
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    });

    // Contact button interactions
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleContactAction(action);
        });
    });

    // Insight tile interactions
    const insightTiles = document.querySelectorAll('.insight-tile');
    insightTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            // Placeholder for article navigation
            console.log('Insight tile clicked:', this.querySelector('h3').textContent);
        });
    });

    // Escape key to close overlays
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            productOverlays.forEach(overlay => {
                overlay.classList.remove('active');
            });
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for background
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const yPos = progress * 50;
            gsap.set('body', {
                backgroundPosition: `center ${yPos}px`
            });
        }
    });

    // Pulse overlay intensity based on scroll
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const opacity = 0.7 - (progress * 0.4);
            gsap.set('.pulse-overlay', { opacity: Math.max(opacity, 0.3) });
        }
    });

    // Circuit dimming effect for footer
    ScrollTrigger.create({
        trigger: '#footer',
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const filter = `brightness(${1 - (progress * 0.6)})`;
            gsap.set('body', { filter });
        }
    });
}

// Handle Contact Actions
function handleContactAction(action) {
    switch(action) {
        case 'partner':
            // Placeholder for partner contact
            console.log('Partner contact initiated');
            window.open('mailto:partner@circuittelligence.com?subject=Partnership Inquiry', '_blank');
            break;
        case 'careers':
            // Placeholder for careers page
            console.log('Careers page requested');
            window.open('mailto:careers@circuittelligence.com?subject=Career Inquiry', '_blank');
            break;
        case 'press':
            // Placeholder for press contact
            console.log('Press contact initiated');
            window.open('mailto:press@circuittelligence.com?subject=Press Inquiry', '_blank');
            break;
        default:
            console.log('Unknown contact action:', action);
    }
}

// Smooth scrolling for internal links
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        gsap.to(window, {
            duration: 1,
            scrollTo: element,
            ease: 'power2.inOut'
        });
    }
}

// Performance optimization: Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for loading animations
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll('.platform-node, .experience-item, .insight-tile');
    elementsToObserve.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Resize handler for responsive adjustments
window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
}, 250));

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling for GSAP
if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded. Animations will be disabled.');
    // Fallback to CSS animations only
    document.body.classList.add('no-gsap');
}

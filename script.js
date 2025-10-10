// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeInteractions();
    initializeScrollEffects();
});

// Initialize Navigation
function initializeNavigation() {
    const navigation = document.getElementById('navigation');
    const heroSection = document.getElementById('hero');
    
    // Show navigation after scrolling past hero
    ScrollTrigger.create({
        trigger: heroSection,
        start: 'bottom top',
        end: 'bottom top',
        onEnter: () => navigation.classList.add('visible'),
        onLeaveBack: () => navigation.classList.remove('visible')
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: targetElement,
                    ease: 'power2.inOut'
                });
            }
        });
    });
}

// Initialize GSAP Animations
function initializeAnimations() {
    // Hero section fade-in animation
    gsap.set('.logo-mark, .hero-tagline', { opacity: 0, y: 20 });
    
    gsap.timeline()
        .to('.logo-mark', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 })
        .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');

    // Mission section animation
    gsap.set('.mission-content', { opacity: 0, y: 30 });
    
    ScrollTrigger.create({
        trigger: '#mission',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.mission-content', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    });

    // Mythos section animation
    gsap.set('.mythos-content', { opacity: 0, y: 30 });
    
    ScrollTrigger.create({
        trigger: '#mythos',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.mythos-content', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    });

    // Argonaut section animation
    gsap.set('.argonaut-visual, .argonaut-text', { opacity: 0, y: 40 });
    
    ScrollTrigger.create({
        trigger: '#argonaut',
        start: 'top 70%',
        onEnter: () => {
            gsap.timeline()
                .to('.argonaut-visual', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
                .to('.argonaut-text', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
        }
    });

    // Prism section animation
    gsap.set('.prism-content > *', { opacity: 0, y: 30 });
    
    ScrollTrigger.create({
        trigger: '#prism',
        start: 'top 70%',
        onEnter: () => {
            gsap.to('.prism-content > *', {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }
    });

    // Prism format animations
    gsap.set('.prism-format', { opacity: 0, scale: 0.8 });
    
    ScrollTrigger.create({
        trigger: '.prism-visual-grid',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.prism-format', {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            });
        }
    });

    // Content sections animations
    const contentSections = ['.efficiency-content', '.pricing-content', '.features-content'];
    
    contentSections.forEach(selector => {
        gsap.set(selector, { opacity: 0, y: 30 });
        
        ScrollTrigger.create({
            trigger: selector,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(selector, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Proof section animation
    gsap.set('.proof-content > h2, .proof-content > p', { opacity: 0, y: 30 });
    gsap.set('.metric-item', { opacity: 0, y: 40 });
    
    ScrollTrigger.create({
        trigger: '#proof',
        start: 'top 70%',
        onEnter: () => {
            gsap.timeline()
                .to('.proof-content > h2, .proof-content > p', {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: 'power2.out'
                })
                .to('.metric-item', {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.15,
                    ease: 'back.out(1.7)'
                }, '-=0.2');
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

    // Footer animation
    gsap.set('.footer-grid, .footer-legal', { opacity: 0, y: 20 });
    
    ScrollTrigger.create({
        trigger: '#footer',
        start: 'top 90%',
        onEnter: () => {
            gsap.to('.footer-grid, .footer-legal', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }
    });
}

// Initialize Interactive Elements
function initializeInteractions() {
    // Portal nodes hover effects
    const portalNodes = document.querySelectorAll('.portal-node');
    portalNodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.2,
                boxShadow: '0 0 30px var(--sky-blue)',
                duration: 0.3
            });
        });

        node.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                boxShadow: '0 0 20px var(--sky-blue)',
                duration: 0.3
            });
        });
    });

    // Prism format interactions
    const prismFormats = document.querySelectorAll('.prism-format');
    prismFormats.forEach(format => {
        format.addEventListener('click', function() {
            const formatType = this.classList.contains('instagram') ? 'Instagram' :
                              this.classList.contains('facebook') ? 'Facebook' : 'Other Platforms';
            console.log(`Prism format clicked: ${formatType}`);
            // Placeholder for format-specific functionality
        });
    });

    // Metric item interactions
    const metricItems = document.querySelectorAll('.metric-item');
    metricItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Contact button interactions
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleContactAction(action);
        });
    });

    // CTA button interaction
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            handleContactAction('argonaut');
        });
    }

    // Footer link interactions
    const footerLinks = document.querySelectorAll('.footer-column a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            console.log(`Footer link clicked: ${href}`);
            // Placeholder for footer link functionality
        });
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

    // Navigation active states based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 60%',
            end: 'bottom 40%',
            onEnter: () => updateActiveNavLink(section.id),
            onEnterBack: () => updateActiveNavLink(section.id)
        });
    });

    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
}

// Handle Contact Actions
function handleContactAction(action) {
    switch(action) {
        case 'contact':
            console.log('Contact us clicked');
            window.open('mailto:contact@circuittelligence.com?subject=General Inquiry', '_blank');
            break;
        case 'argonaut':
            console.log('Explore Argonaut clicked');
            // Scroll to Argonaut section or open Argonaut portal
            const argonautSection = document.getElementById('argonaut');
            if (argonautSection) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: argonautSection,
                    ease: 'power2.inOut'
                });
            }
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
    const elementsToObserve = document.querySelectorAll('.portal-node, .prism-format, .metric-item');
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

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key functionality
    if (e.key === 'Escape') {
        // Close any open modals or overlays
        console.log('ESC pressed - closing overlays');
    }
    
    // Arrow key navigation for sections
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        scrollToNextSection();
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        scrollToPreviousSection();
    }
});

function scrollToNextSection() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.pageYOffset;
    
    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop;
        if (sectionTop > currentScroll + 100) {
            smoothScrollTo(`#${sections[i].id}`);
            break;
        }
    }
}

function scrollToPreviousSection() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.pageYOffset;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const sectionTop = sections[i].offsetTop;
        if (sectionTop < currentScroll - 100) {
            smoothScrollTo(`#${sections[i].id}`);
            break;
        }
    }
}

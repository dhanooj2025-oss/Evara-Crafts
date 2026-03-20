document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-right, .reveal-image, .final-cta, .footer-animate, .timeline-trunk, .node-marker, .node-content, .final-bloom-node');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Consolidated Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('open');
        });

        // Close menu when clicking a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('open');
            });
        });
    }

    // Final CTA Parallax Effect
    const ctaSection = document.querySelector('.final-cta');
    const ctaBg = document.querySelector('.cta-parallax-bg');

    if (ctaSection && ctaBg) {
        window.addEventListener('scroll', () => {
            const sectionRect = ctaSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const distanceVisible = viewportHeight - sectionRect.top;
            const totalDistance = viewportHeight + sectionRect.height;
            const progress = Math.min(Math.max(distanceVisible / totalDistance, 0), 1);

            const scale = 1 + (progress * 0.06);
            ctaBg.style.transform = `scale(${scale})`;
        });
    }

    // Luxury CTA Button Logic (Proximity & Idle)
    const premiumButtons = document.querySelectorAll('.btn-premium-gold');
    let lastActivityTime = Date.now();
    let idlePulseInterval;

    const updateActivity = () => { lastActivityTime = Date.now(); };
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // 6. Cursor Proximity Effect
    window.addEventListener('mousemove', (e) => {
        premiumButtons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - btnX, 2) +
                Math.pow(e.clientY - btnY, 2)
            );

            if (distance < 120) {
                btn.classList.add('btn-aware');
                btn.classList.add('btn-aware-glow');

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                btn.style.setProperty('--x', `${x}px`);
                btn.style.setProperty('--y', `${y}px`);
            } else {
                btn.classList.remove('btn-aware');
                btn.classList.remove('btn-aware-glow');
            }
        });
    });

    // 4. Micro-Pulse Attention Loop (Idle)
    const startIdleTimer = () => {
        setInterval(() => {
            const now = Date.now();
            if (now - lastActivityTime >= 3000) { // Idle for 3s
                if (!idlePulseInterval) {
                    idlePulseInterval = setInterval(() => {
                        const idleNow = Date.now();
                        if (idleNow - lastActivityTime >= 3000) {
                            premiumButtons.forEach(btn => {
                                btn.classList.add('idle-pulse');
                                setTimeout(() => btn.classList.remove('idle-pulse'), 1200);
                            });
                        }
                    }, 8000); // Repeat every 8s
                }
            } else {
                if (idlePulseInterval) {
                    clearInterval(idlePulseInterval);
                    idlePulseInterval = null;
                }
            }
        }, 1000);
    };
    startIdleTimer();
});

// Lightbox Functionality
const lightbox = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');

function openLightbox(element) {
    const imgStyle = element.querySelector('.placeholder-img').style.backgroundImage;
    const title = element.querySelector('h4').innerText;
    const category = element.querySelector('.category').innerText;

    // Extract URL from style string: url("...")
    const url = imgStyle.slice(5, -2); // Remove url(" and ")

    lightboxImg.src = url;
    lightboxTitle.innerText = title;
    lightboxCategory.innerText = category;

    lightbox.style.display = 'flex';
    // Trigger reflow
    void lightbox.offsetWidth;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }, 300); // Wait for transition
}

// Close on outside click
window.onclick = function (event) {
    if (event.target == lightbox) {
        closeLightbox();
    }
}

// Testimonial Slider
let slideIndex = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');

function showSlides(n) {
    if (n >= slides.length) { slideIndex = 0 }
    if (n < 0) { slideIndex = slides.length - 1 }

    // Hide all
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.display = 'none'; // Ensure display none for animation reset
    });
    dots.forEach(dot => dot.classList.remove('active'));

    // Show active
    slides[slideIndex].style.display = 'flex'; // Changed from block to flex for editorial layout
    setTimeout(() => { // Small delay to allow display to apply before opacity/animation
        slides[slideIndex].classList.add('active');
    }, 10);

    if (dots.length > 0) {
        dots[slideIndex].classList.add('active');
    }
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Initialize if slides exist
if (slides.length > 0) {
    showSlides(slideIndex);
    // Optional: Auto-advance
    setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 6000);
}

// Clean Luxury: Ambient Dust Particles (Using Web Animations API for guaranteed rendering)
function initAmbientDust() {
    const dustContainer = document.getElementById('ambient-dust');
    if (!dustContainer) return;

    // Force container styles just in case CSS doesn't load/cache correctly
    dustContainer.style.position = 'absolute';
    dustContainer.style.top = '0';
    dustContainer.style.left = '0';
    dustContainer.style.width = '100%';
    dustContainer.style.height = '100%';
    dustContainer.style.overflow = 'hidden';
    dustContainer.style.pointerEvents = 'none';
    dustContainer.style.zIndex = '5'; // Placed securely above the background

    const particleCount = 600; // Increased density again to bring fireflies back everywhere

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');

        // Mix of small and slightly larger particles for depth
        const size = Math.random() * 4 + 2; // 2px to 6px
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = 'radial-gradient(circle, rgba(255,240,180,1) 0%, rgba(218,165,32,0.8) 50%, rgba(218,165,32,0) 100%)';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = `0 0 ${size * 2}px rgba(218, 165, 32, 0.8)`;

        // Spread particles freely across the entire section width again
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.zIndex = '10';

        dustContainer.appendChild(particle);

        // Native JS Animation for absolute float guarantee
        const duration = (Math.random() * 10 + 10) * 1000; // 10s to 20s
        const driftX = Math.random() * 100 - 50;
        const driftY = Math.random() * 400 + 150;

        // Random opacity fluctuations for firefly blink effect
        const blink1 = Math.random() * 0.5 + 0.3;
        const blink2 = Math.random() * 0.4 + 0.1;

        particle.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { opacity: blink1, offset: 0.2 },
            { opacity: blink2, offset: 0.4 },
            { opacity: 0.8, offset: 0.6 },
            { opacity: blink2, offset: 0.8 },
            { transform: `translate(${driftX}px, -${driftY}px)`, opacity: 0 }
        ], {
            duration: duration,
            iterations: Infinity,
            delay: -(Math.random() * duration), // Start at random point in cycle
            easing: 'ease-in-out'
        });
    }
}

initAmbientDust();

// Final Node Pulse Effect Trigger
const finalBloomObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('glow-active');
            finalBloomObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

const finalNode = document.querySelector('.final-bloom-node');
if (finalNode) {
    finalBloomObserver.observe(finalNode);
}

// Add WhatsApp Floating Widget Site-wide
document.addEventListener('DOMContentLoaded', () => {
    const waWidget = document.createElement('a');
    waWidget.href = "https://wa.me/916282556686?text=Hi%20Evara%20Crafts!%20I%20would%20like%20to%20know%20more%20about...";
    waWidget.className = "whatsapp-float";
    waWidget.target = "_blank";
    waWidget.rel = "noopener noreferrer";
    waWidget.setAttribute('aria-label', 'Chat on WhatsApp');
    waWidget.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
    `;
    document.body.appendChild(waWidget);
});

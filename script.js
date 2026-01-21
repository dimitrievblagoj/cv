// Initialize EmailJS with your public key
// IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
// Get it from: https://dashboard.emailjs.com/admin/account
const EMAILJS_PUBLIC_KEY = 'F3S68WTih-P3e8Y0A';
const EMAILJS_SERVICE_ID = 'service_nfxoune';
const EMAILJS_TEMPLATE_ID = 'template_ciw7xk9';

let emailjsReady = false;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 50; // 5 seconds max

// Wait for EmailJS to be loaded and then initialize
function initEmailJS() {
    initAttempts++;
    
    if (typeof emailjs !== 'undefined') {
        try {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            emailjsReady = true;
            console.log('✅ EmailJS initialized successfully');
            console.log('Service ID:', EMAILJS_SERVICE_ID);
            console.log('Template ID:', EMAILJS_TEMPLATE_ID);
        } catch (error) {
            console.error('❌ EmailJS initialization error:', error);
            emailjsReady = false;
        }
    } else if (initAttempts < MAX_INIT_ATTEMPTS) {
        // Retry after 100ms
        setTimeout(initEmailJS, 100);
    } else {
        console.error('❌ EmailJS library failed to load after multiple attempts');
        emailjsReady = false;
    }
}

// Initialize EmailJS when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
    // DOM is already ready
    setTimeout(initEmailJS, 100);
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
html.classList.add(currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
    html.classList.remove('dark', 'light');
    html.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth Scrolling for Navigation Links (only for hash links, not mailto/tel)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-purple-400');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('text-purple-400');
        }
    });
});

// Intersection Observer for Fade In Animations
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

// Observe all sections for fade in effect
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Skill Bar Animation
const skillBars = document.querySelectorAll('.skill-bar');
const skillsSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillBars.forEach(bar => {
                bar.classList.add('animate');
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Particle Background
const particlesContainer = document.getElementById('particles');
const particleCount = 50;

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 5 + 1;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.background = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.1})`;
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    particlesContainer.appendChild(particle);
}

for (let i = 0; i < particleCount; i++) {
    createParticle();
}

// Contact Form with EmailJS
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const buttonText = document.getElementById('button-text');
const buttonIcon = document.getElementById('button-icon');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if EmailJS is ready
        if (!emailjsReady || typeof emailjs === 'undefined') {
            showMessage('Email service is still loading. Please wait a moment and try again.', 'error');
            console.error('EmailJS is not ready yet');
            return;
        }

        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate form data
        if (!name || !email || !subject || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        // Show loading state
        if (buttonText) buttonText.textContent = 'Sending...';
        if (buttonIcon) {
            buttonIcon.classList.remove('fa-paper-plane');
            buttonIcon.classList.add('fa-spinner', 'fa-spin');
        }
        contactForm.classList.add('loading');

        try {
            // IMPORTANT: Configure your EmailJS service
            // 1. Go to https://www.emailjs.com/
            // 2. Create an account and email service
            // 3. Create an email template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
            // 4. Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' below

            console.log('📧 Sending email via EmailJS...');
            console.log('Service ID:', EMAILJS_SERVICE_ID);
            console.log('Template ID:', EMAILJS_TEMPLATE_ID);
            
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: 'dimitrievblagoj@icloud.com'
            };
            
            console.log('Template params:', templateParams);
            
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );

            console.log('Email sent successfully!', response);
            // Success
            showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();

        } catch (error) {
            // Error
            console.error('EmailJS Error Details:', error);
            console.error('Error Code:', error.status);
            console.error('Error Text:', error.text);
            
            let errorMessage = 'Oops! Something went wrong. ';
            if (error.status === 0) {
                errorMessage += 'Please check your internet connection.';
            } else if (error.text) {
                errorMessage += error.text;
            } else {
                errorMessage += 'Please try again or email me directly at dimitrievblagoj@icloud.com';
            }
            
            showMessage(errorMessage, 'error');
        } finally {
            // Reset button state
            if (buttonText) buttonText.textContent = 'Send Message';
            if (buttonIcon) {
                buttonIcon.classList.remove('fa-spinner', 'fa-spin');
                buttonIcon.classList.add('fa-paper-plane');
            }
            contactForm.classList.remove('loading');
        }
    });
} else {
    console.warn('Contact form not found');
}

function showMessage(text, type) {
    if (!formMessage) {
        console.error('Form message element not found');
        alert(text); // Fallback to alert
        return;
    }
    
    formMessage.textContent = text;
    formMessage.classList.remove('hidden', 'bg-green-500', 'bg-red-500');

    if (type === 'success') {
        formMessage.classList.add('bg-green-500', 'text-white');
    } else {
        formMessage.classList.add('bg-red-500', 'text-white');
    }

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Hide message after 5 seconds
    setTimeout(() => {
        if (formMessage) {
            formMessage.classList.add('hidden');
        }
    }, 5000);
}

// Parallax Effect on Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.float-animation');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover effect to cards
const cards = document.querySelectorAll('.card-hover');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Navbar background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
        nav.style.backdropFilter = 'blur(20px)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.05)';
        nav.style.backdropFilter = 'blur(10px)';
    }
});

// Typing Effect for Hero Section (Optional Enhancement)
const typingText = document.querySelector('.text-2xl.md\\:text-3xl');
if (typingText) {
    const originalText = typingText.textContent;
    typingText.textContent = '';
    let index = 0;

    setTimeout(() => {
        const typeInterval = setInterval(() => {
            if (index < originalText.length) {
                typingText.textContent += originalText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }, 1000);
}

// Prevent animations from running on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add glitch effect to name on hover (Optional Enhancement)
const nameElement = document.querySelector('h1 span');
if (nameElement) {
    nameElement.addEventListener('mouseenter', function() {
        this.style.textShadow = '2px 2px #ff00de, -2px -2px #00ffff';
    });

    nameElement.addEventListener('mouseleave', function() {
        this.style.textShadow = 'none';
    });
}

// Console easter egg
console.log('%c👋 Hey there!', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%cLooks like you\'re checking out the code. I like your style!', 'color: #764ba2; font-size: 16px;');
console.log('%cFeel free to reach out: dimitrievblagoj@icloud.com', 'color: #667eea; font-size: 14px;');

// Animate numbers in about section
function animateNumber(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Trigger number animation when about section is visible
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberElements = entry.target.querySelectorAll('.text-2xl.font-bold.text-white');
            numberElements.forEach((element, index) => {
                if (index === 0) {
                    const targetNumber = parseInt(element.textContent);
                    element.textContent = '0+';
                    animateNumber(element, targetNumber, 2000);
                }
            });
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// EmailJS Test Function - Run this in console to test: testEmailJS()
window.testEmailJS = function() {
    console.log('🧪 Testing EmailJS Configuration...');
    console.log('EmailJS Ready:', emailjsReady);
    console.log('EmailJS Library:', typeof emailjs !== 'undefined' ? '✅ Loaded' : '❌ Not Loaded');
    console.log('Public Key:', EMAILJS_PUBLIC_KEY);
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', EMAILJS_TEMPLATE_ID);
    
    if (!emailjsReady) {
        console.error('❌ EmailJS is not ready. Check initialization.');
        return;
    }
    
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS library is not loaded.');
        return;
    }
    
    console.log('✅ Configuration looks good!');
    console.log('💡 If emails still fail, check:');
    console.log('   1. Service ID is correct in EmailJS dashboard');
    console.log('   2. Template ID is correct in EmailJS dashboard');
    console.log('   3. Template variables match: from_name, from_email, subject, message, to_email');
    console.log('   4. Email service is activated in EmailJS dashboard');
};

// DOM Elements (guarded - pages may not include all of these)
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const contactForm = document.getElementById('contactForm');


// ============================================
// PARTICLE BACKGROUND EFFECT
// ============================================
const createParticles = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    const createParticlesArray = () => {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: `rgba(249, 115, 22, ${Math.random() * 0.5 + 0.3})`
            });
        }
    };
    
    const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Update position
            p.x += p.dx;
            p.y += p.dy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            
            // Draw connections
            particles.forEach((p2, index2) => {
                if (index === index2) return;
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        animationId = requestAnimationFrame(drawParticles);
    };
    
    resize();
    createParticlesArray();
    drawParticles();
    
    window.addEventListener('resize', () => {
        resize();
        createParticlesArray();
    });
};

// ============================================
// CUSTOM CURSOR EFFECT
// ============================================
const createCustomCursor = () => {
    // Only create cursor on desktop devices
    if (window.innerWidth < 768) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #f97316;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease, opacity 0.3s ease;
        mix-blend-mode: normal;
        box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
    `;
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: #f97316;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 5px rgba(249, 115, 22, 0.8);
    `;
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    // Initialize cursor position
    mouseX = -100;
    mouseY = -100;
    cursorX = -100;
    cursorY = -100;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Show cursor when mouse enters window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    const animateCursor = () => {
        // Smooth follow for outer cursor
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        // Faster follow for dot
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        cursorDot.style.left = dotX - 4 + 'px';
        cursorDot.style.top = dotY - 4 + 'px';
        
        requestAnimationFrame(animateCursor);
    };
    animateCursor();
    
    // Add hover effect on interactive elements
    const addCursorHover = () => {
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .why-card, input, textarea, .btn, .skill-card, .innovation-card, .testimonial-card');
        interactiveElements.forEach(el => {
            el.style.cursor = 'none';
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.borderColor = '#ff6600';
                cursor.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = '#f97316';
                cursor.style.boxShadow = '0 0 10px rgba(249, 115, 22, 0.5)';
            });
        });
    };
    
    // Run after a short delay to ensure DOM is ready
    setTimeout(addCursorHover, 500);
    
    // Also run when DOM content is loaded
    if (document.readyState === 'complete') {
        addCursorHover();
    }
};

// ============================================
// TYPING EFFECT FOR HERO
// ============================================
const typeWriter = (text, element, speed = 100, callback) => {
    let i = 0;
    element.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.style.cssText = `
        border-right: 2px solid #f97316;
        animation: blink 0.7s infinite;
    `;
    element.appendChild(cursor);
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
        } else {
            clearInterval(timer);
            if (callback) callback();
        }
    }, speed);
};

// Add blinking cursor animation
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes blink {
        0%, 50% { border-color: #f97316; }
        51%, 100% { border-color: transparent; }
    }
`;
document.head.appendChild(cursorStyle);

// ============================================
// 3D TILT EFFECT FOR CARDS
// ============================================
const createTiltEffect = () => {
    const cards = document.querySelectorAll('.project-card, .service-card, .why-card, .stat-item');
    
    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 0.3s ease';
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
};

// ============================================
// GLASSMORPHISM EFFECT
// ============================================
const addGlassmorphism = () => {
    // Add glass effect to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.background = 'rgba(21, 21, 21, 0.85)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.webkitBackdropFilter = 'blur(10px)';
    }
    
    // Add glass effect to cards
    const glassCards = document.querySelectorAll('.service-card, .why-card, .project-card');
    glassCards.forEach(card => {
        card.style.background = 'rgba(37, 37, 37, 0.7)';
        card.style.backdropFilter = 'blur(10px)';
        card.style.webkitBackdropFilter = 'blur(10px)';
        card.style.border = '1px solid rgba(249, 115, 22, 0.1)';
    });
};

// ============================================
// GLOW EFFECTS
// ============================================
const addGlowEffects = () => {
    // Add glow to primary buttons
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.4)';
        btn.style.transition = 'all 0.3s ease';
        
        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 0 30px rgba(249, 115, 22, 0.6)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = '0 0 20px rgba(249, 115, 22, 0.4)';
        });
    });
    
    // Add glow to stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.background = 'rgba(255, 255, 255, 0.1)';
        item.style.backdropFilter = 'blur(10px)';
        item.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    });
};

// ============================================
// STAGGERED ANIMATIONS
// ============================================
const addStaggeredAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Add animation styles
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
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
        .project-card, .service-card, .why-card, .stat-item {
            opacity: 0;
        }
    `;
    document.head.appendChild(animStyle);
    
    // Observe elements
    document.querySelectorAll('.project-card, .service-card, .why-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
};

// ============================================
// HOVER SOUND EFFECT (Optional)
// ============================================
const addHoverEffects = () => {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
};

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #f97316, #ea580c);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

// Sticky Navigation
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(21, 21, 21, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(21, 21, 21, 0.85)';
        }
    });
}

// Mobile Menu Toggle
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(45deg) translate(5px, 5px)' 
            : '';
        spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navLinks.classList.contains('active') 
            ? 'rotate(-45deg) translate(7px, -6px)' 
            : '';
    });
}


// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active link highlighting
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// FORM SUBMISSION
// ============================================
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Save message to localStorage
        const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
        messages.push({
            id: Date.now(),
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            date: new Date().toISOString(),
            read: false,
            starred: false
        });
        localStorage.setItem('portfolioMessages', JSON.stringify(messages));
        
        // Simulate form submission (replace with actual API call)
        console.log('Form submitted:', data);
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
    });
}

// Custom notification function
function showNotification(message, type = 'info') {

    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 350px;
        backdrop-filter: blur(10px);
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))';
    } else {
        notification.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))';
    }
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => notification.remove());
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add keyframe animations for notifications
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

// ============================================
// PARALLAX EFFECT
// ============================================
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.image-frame');
    const scrollPosition = window.pageYOffset;
    if (heroImage && scrollPosition < 600) {
        heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
    }
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const createScrollTopBtn = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-top-btn';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #f97316, #ea580c);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 10px 30px rgba(249, 115, 22, 0.4);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.style.transform = 'translateY(0)';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
            btn.style.transform = 'translateY(20px)';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ============================================
// THEME TOGGLE (Dark/Light Mode)
// ============================================
const initThemeToggle = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
};

// ============================================
// INITIALIZE ALL EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all special effects
    createParticles();
    createCustomCursor();
    createScrollProgress();
    addGlassmorphism();
    addGlowEffects();
    addStaggeredAnimations();
    addHoverEffects();
    createScrollTopBtn();
    createTiltEffect();
    initThemeToggle();
    
    // Enable typing effect
    const heroSubtitle = document.querySelector('.hero-content h2');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent.trim();
        typeWriter(originalText, heroSubtitle, 80);
    }
    
    // Console log welcome message
    console.log('%c Welcome to my Portfolio! 🎨', 'background: #f97316; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;');
    console.log('%c Special Effects Enabled ✨', 'color: #f97316; font-size: 14px;');
});

// Handle window load
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

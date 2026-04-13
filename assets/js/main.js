document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initScrollProgress();
    initActiveNav();
    initFadeIn();
    initParallax();
    initLightbox();
    initFormValidation();
    initMobileMenu();
});

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    if (navLinks.length === 0 || sections.length === 0) return;

    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

function initFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach((element, index) => {
        element.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(element);
    });
}

function initParallax() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');

    if (!hero || !heroBg) return;

    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const rate = scrollY * 0.5;

        if (scrollY <= hero.offsetHeight) {
            heroBg.style.transform = 'translateY(' + rate + 'px)';
        }
    });
}

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length === 0 || !lightbox) return;

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initFormValidation() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('.btn');

    if (!submitBtn) return;

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();

        let isValid = true;

        if (nameInput) {
            if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
                showError(nameInput, 'Name must be at least 2 characters');
                isValid = false;
            } else {
                clearError(nameInput);
            }
        }

        if (emailInput) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput);
            }
        }

        if (phoneInput && phoneInput.value.trim()) {
            const phoneRegex = /^[\d\s\-+()]{10,}$/;
            if (!phoneRegex.test(phoneInput.value)) {
                showError(phoneInput, 'Please enter a valid phone number');
                isValid = false;
            } else {
                clearError(phoneInput);
            }
        }

        if (messageInput) {
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            } else {
                clearError(messageInput);
            }
        }

        if (isValid) {
            const successMessage = form.querySelector('.form-success');
            if (successMessage) {
                successMessage.classList.add('show');
                form.reset();
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }

            if (emailInput) {
                const subject = encodeURIComponent('New Inquiry from Discover Nepal Website');
                const body = encodeURIComponent(
                    'Name: ' + (nameInput ? nameInput.value : '') + '\n' +
                    'Email: ' + emailInput.value + '\n' +
                    'Phone: ' + (phoneInput ? phoneInput.value : '') + '\n' +
                    'Message: ' + (messageInput ? messageInput.value : '')
                );
                window.location.href = 'mailto:info@discoverfnepal.com?subject=' + subject + '&body=' + body;
            }
        }
    });

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            const errorEl = formGroup.querySelector('.error-message');
            if (errorEl) {
                errorEl.textContent = message;
            }
        }
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
        }
    }

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const formGroup = input.closest('.form-group');
            if (formGroup && formGroup.classList.contains('error')) {
                if (input.value.trim()) {
                    formGroup.classList.remove('error');
                }
            }
        });
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}
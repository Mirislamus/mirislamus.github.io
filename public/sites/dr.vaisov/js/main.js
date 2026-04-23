/**
 * Dr.Vaisov Laser Aesthetic Dermatology — Landing Page
 * Main JavaScript
 */

// ==========================================
// CONFIGURATION
// ==========================================
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

const SERVICE_DATA = [
    {
        title: 'Лазерная эпиляция',
        desc: 'Безболезненное удаление нежелательных волос с помощью современных лазерных систем. Подходит для всех типов кожи. Эффект заметен уже после первой процедуры — волосы перестают расти на срок до 3 месяцев.'
    },
    {
        title: 'Hollywood Laser Peel',
        desc: 'Популярная среди голливудских звёзд процедура на лазере Spectra. Мгновенное очищение пор, выравнивание тона кожи, эффект «кожи софитов». Результат виден сразу после процедуры — идеально перед важным событием.'
    },
    {
        title: 'Удаление сосудов и капилляров (DermaV)',
        desc: 'Лазерное удаление сосудистых звёздочек, купероза, папиллом и сосудов на лице и теле с помощью многофункционального лазера DermaV. Процедура безболезненная, без периода реабилитации.'
    },
    {
        title: 'Лечение акне и постакне',
        desc: 'Комплексный подход к лечению угревой болезни: от диагностики и внутреннего лечения до аппаратных процедур. Индивидуальный план под каждый тип кожи и стадию акне.'
    },
    {
        title: 'Омоложение кожи (BBL, LaseMD)',
        desc: 'Аппаратные методики омоложения: фракционный лазер LaseMD для улучшения текстуры кожи и широкополосный свет BBL (Forever Young) для общего омоложения. Оба метода стимулируют выработку коллагена.'
    },
    {
        title: 'Удаление пигментации и родинок',
        desc: 'Лазерное удаление пигментных пятен, веснушек, мелазмы и родинок с использованием сертифицированного оборудования. Предварительная консультация и дерматоскопия обязательны.'
    },
    {
        title: 'Лечение розацеа',
        desc: 'Специализированное лечение розацеа (розовых угрей) — комплексная терапия с применением лазерных и световых технологий. Подробная диагностика и индивидуальный план лечения.'
    },
    {
        title: 'RF-лифтинг (Volnewmer)',
        desc: 'Монополярный RF-лифтинг для подтяжки кожи век, лица и тела без хирургического вмешательства. Эффект подтягивости и сияния виден с первых минут процедуры.'
    }
];

// ==========================================
// NAVIGATION
// ==========================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileLinks = document.querySelectorAll('.mobile-menu__link');
const navLinks = document.querySelectorAll('.nav__link');

// Scroll behavior for nav background
function handleNavScroll() {
    if (window.scrollY > 100) {
        nav.classList.add('nav--scrolled');
    } else {
        nav.classList.remove('nav--scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// Mobile menu toggle
function openMobileMenu() {
    mobileMenu.classList.add('mobile-menu--open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('mobile-menu--open')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

mobileMenuClose.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// Close mobile menu on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
        closeMobileMenu();
    }
});

// Active section highlighting
const sections = document.querySelectorAll('.section[id], .hero[id]');
const sectionIds = Array.from(sections).map(s => s.id);

const observerOptions = {
    threshold: 0.3,
    rootMargin: '-72px 0px 0px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('nav__link--active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('nav__link--active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// GSAP ANIMATIONS
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Hero load animation
function initHeroAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTl
        .from('.hero__caption', { opacity: 0, y: 60, duration: 0.8 }, 0.4)
        .from('.hero__title-line', { opacity: 0, y: 60, duration: 1.0, stagger: 0.2 }, 0.6)
        .from('.hero__subtitle', { opacity: 0, y: 40, duration: 0.8 }, 1.1)
        .from('.hero__cta', { opacity: 0, y: 30, duration: 0.7 }, 1.3)
        .from('.hero__scroll', { opacity: 0, duration: 0.5 }, 1.6);
}

// Scroll indicator pulse
gsap.to('.hero__scroll-line', {
    opacity: 1,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
});

// Section reveal animation (shared pattern)
function createSectionReveal(sectionSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const caption = section.querySelector('.section-caption');
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-header')?.querySelector('p:not(.section-caption)');
    const content = section.querySelectorAll('.stats__item, .about__credential, .service-card, .equipment-card, .gallery__item, .contact__detail, .contact__map');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    if (caption) {
        tl.from(caption, { opacity: 0, y: 15, duration: 0.5 });
    }
    
    if (title) {
        tl.from(title, { opacity: 0, y: 30, duration: 0.7 }, '-=0.3');
    }

    if (subtitle) {
        tl.from(subtitle, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
    }

    if (content.length > 0) {
        tl.from(content, { 
            opacity: 0, 
            y: 40, 
            duration: 0.8, 
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');
    }
}

// Stats bar animation
function initStatsAnimation() {
    const statsItems = document.querySelectorAll('.stats__item');
    
    gsap.from(statsItems, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#stats',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

// About section - image slide in
function initAboutAnimation() {
    const aboutImage = document.querySelector('.about__image-wrapper');
    const aboutContent = document.querySelector('.about__content');
    
    if (aboutImage) {
        gsap.from(aboutImage, {
            opacity: 0,
            x: 40,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    if (aboutContent) {
        const caption = aboutContent.querySelector('.section-caption');
        const title = aboutContent.querySelector('.section-title');
        const text = aboutContent.querySelector('.about__text');
        const creds = aboutContent.querySelectorAll('.about__credential');
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        
        if (caption) tl.from(caption, { opacity: 0, y: 15, duration: 0.5 });
        if (title) tl.from(title, { opacity: 0, y: 30, duration: 0.7 }, '-=0.3');
        if (text) tl.from(text, { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
        if (creds.length) tl.from(creds, { opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
    }
}

// Services cards stagger
function initServicesAnimation() {
    const cards = document.querySelectorAll('.service-card');
    const header = document.querySelector('.services__header');
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#services',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    if (header) {
        const caption = header.querySelector('.section-caption');
        const title = header.querySelector('.section-title');
        if (caption) tl.from(caption, { opacity: 0, y: 15, duration: 0.5 });
        if (title) tl.from(title, { opacity: 0, y: 30, duration: 0.7 }, '-=0.3');
    }
    
    tl.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
    }, '-=0.3');
}

// Equipment cards stagger
function initEquipmentAnimation() {
    const cards = document.querySelectorAll('.equipment-card');
    const header = document.querySelector('.equipment__header');
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#equipment',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    if (header) {
        const caption = header.querySelector('.section-caption');
        const title = header.querySelector('.section-title');
        if (caption) tl.from(caption, { opacity: 0, y: 15, duration: 0.5 });
        if (title) tl.from(title, { opacity: 0, y: 30, duration: 0.7 }, '-=0.3');
    }
    
    tl.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
    }, '-=0.3');
}

// Reviews animation
function initReviewsAnimation() {
    const header = document.querySelector('.reviews__header');
    
    if (header) {
        gsap.from(header.children, {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#reviews',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }
}

// Gallery images stagger
function initGalleryAnimation() {
    const items = document.querySelectorAll('.gallery__item');
    const header = document.querySelector('.gallery__header');
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#gallery',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    
    if (header) {
        const caption = header.querySelector('.section-caption');
        const title = header.querySelector('.section-title');
        if (caption) tl.from(caption, { opacity: 0, y: 15, duration: 0.5 });
        if (title) tl.from(title, { opacity: 0, y: 30, duration: 0.7 }, '-=0.3');
    }
    
    tl.from(items, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.3');
}

// Contact section animation
function initContactAnimation() {
    const info = document.querySelector('.contact__info');
    const formCard = document.querySelector('.contact__form-card');
    
    if (info) {
        const caption = info.querySelector('.section-caption');
        const title = info.querySelector('.section-title');
        const details = info.querySelectorAll('.contact__detail');
        const map = info.querySelector('.contact__map');
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
        
        if (caption) tl.from(caption, { opacity: 0, y: 15, duration: 0.5 });
        if (title) tl.from(title, { opacity: 0, y: 30, duration: 0.7 }, '-=0.3');
        if (details.length) tl.from(details, { opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
        if (map) tl.from(map, { opacity: 0, y: 30, duration: 0.6 }, '-=0.5');
    }
    
    if (formCard) {
        gsap.from(formCard, {
            opacity: 0,
            x: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initStatsAnimation();
    initAboutAnimation();
    initServicesAnimation();
    initEquipmentAnimation();
    initReviewsAnimation();
    initGalleryAnimation();
    initContactAnimation();
});

// ==========================================
// SWIPER — Reviews Carousel
// ==========================================
let reviewsSwiper;

function initSwiper() {
    const swiperEl = document.querySelector('.reviews__swiper');
    if (!swiperEl) return;

    reviewsSwiper = new Swiper('.reviews__swiper', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 16
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 24
            }
        },
        navigation: {
            prevEl: '.reviews__btn--prev',
            nextEl: '.reviews__btn--next'
        }
    });
}

document.addEventListener('DOMContentLoaded', initSwiper);

// ==========================================
// MICROMODAL — Service & Image Modals
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Micromodal
    MicroModal.init({
        awaitOpenAnimation: true,
        awaitCloseAnimation: true,
        disableFocus: false
    });

    // Service cards click handlers
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceModalNum = document.getElementById('serviceModalNum');
    const serviceModalTitle = document.getElementById('serviceModalTitle');
    const serviceModalDesc = document.getElementById('serviceModalDesc');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceIndex = parseInt(card.dataset.service);
            const service = SERVICE_DATA[serviceIndex];
            
            if (service && serviceModalNum && serviceModalTitle && serviceModalDesc) {
                serviceModalNum.textContent = String(serviceIndex + 1).padStart(2, '0');
                serviceModalTitle.textContent = service.title;
                serviceModalDesc.textContent = service.desc;
                
                MicroModal.show('serviceModal');
            }
        });
    });

    // Gallery image click handlers
    const galleryItems = document.querySelectorAll('.gallery__item');
    const imageModalImg = document.getElementById('imageModalImg');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery__img');
            if (img && imageModalImg) {
                imageModalImg.src = img.dataset.full || img.src;
                imageModalImg.alt = img.alt;
                MicroModal.show('imageModal');
            }
        });
    });
});

// ==========================================
// IMASK — Phone Input
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('formPhone');
    if (phoneInput && window.IMask) {
        IMask(phoneInput, {
            mask: '+{998} (00) 000-00-00',
            lazy: false,
            placeholderChar: '_'
        });
    }
});

// ==========================================
// FORM HANDLING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('formSubmit');
        const btnText = submitBtn.querySelector('.btn__text');
        const btnSpinner = submitBtn.querySelector('.btn__spinner');
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name')?.trim();
        const phone = formData.get('phone')?.trim();
        const service = formData.get('service');
        const message = formData.get('message')?.trim();
        
        // Validation
        if (!name) {
            showToast('Пожалуйста, введите ваше имя');
            return;
        }
        
        if (!phone || phone.includes('_')) {
            showToast('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        if (!service) {
            showToast('Пожалуйста, выберите услугу');
            return;
        }
        
        // Loading state
        submitBtn.disabled = true;
        btnText.hidden = true;
        btnSpinner.hidden = false;
        
        // Get service name
        const serviceSelect = document.getElementById('formService');
        const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
        
        // Prepare message for Telegram
        const telegramMessage = `
📋 *Новая заявка с сайта Dr.Vaisov*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
💉 *Услуга:* ${serviceName}
${message ? `📝 *Сообщение:* ${message}` : ''}
        `.trim();
        
        try {
            // Send to Telegram
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown'
                })
            });
            
            if (response.ok) {
                showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                form.reset();
            } else {
                showToast('Произошла ошибка при отправке. Пожалуйста, позвоните нам: +998 78 113 95 00');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('Произошла ошибка при отправке. Пожалуйста, позвоните нам: +998 78 113 95 00');
        } finally {
            submitBtn.disabled = false;
            btnText.hidden = false;
            btnSpinner.hidden = true;
        }
    });
});

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
let toastTimeout;

function showToast(message) {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('toast--visible');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('toast--visible');
    }, 5000);
}

// Close toast on click
toast?.addEventListener('click', () => {
    toast.classList.remove('toast--visible');
});

// ==========================================
// NAV APPEARANCE ON LOAD
// ==========================================
gsap.from(nav, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.2
});

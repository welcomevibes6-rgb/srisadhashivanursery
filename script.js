document.addEventListener('DOMContentLoaded', () => {

    // ===== HEADER SCROLL =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    });

    // ===== MOBILE NAV =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        document.querySelectorAll('.nav-menu .nav-link, .dropdown-content a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ===== HERO SLIDER =====
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        let isPaused = false;
        let cleanupTimeout = null;

        // Preload / decode all hero images for instant, smooth transitions without flashes
        slides.forEach(s => {
            const img = s.querySelector('.hero-img');
            if (img && img.decode) {
                img.decode().catch(() => {});
            }
        });

        function goToSlide(idx) {
            const targetSlide = ((idx % slides.length) + slides.length) % slides.length;
            if (targetSlide === currentSlide) return;

            const prevSlide = currentSlide;
            currentSlide = targetSlide;

            if (cleanupTimeout) {
                clearTimeout(cleanupTimeout);
                cleanupTimeout = null;
            }

            // Keep the previous slide solid underneath while the new slide transitions on top
            slides.forEach((s, i) => {
                s.classList.remove('last-active');
                if (i !== prevSlide && i !== currentSlide) {
                    s.classList.remove('active');
                }
            });

            slides[prevSlide].classList.remove('active');
            slides[prevSlide].classList.add('last-active');

            // Force reflow so the browser triggers the incoming transition reliably
            void slides[currentSlide].offsetWidth;
            slides[currentSlide].classList.add('active');

            dots.forEach(d => d.classList.remove('active'));
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');

            // After crossfade transition completes (1300ms), remove last-active cleanly
            cleanupTimeout = setTimeout(() => {
                slides.forEach(s => s.classList.remove('last-active'));
                cleanupTimeout = null;
            }, 1300);
        }

        function startAuto() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                if (!isPaused) {
                    goToSlide(currentSlide + 1);
                }
            }, 4500);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                startAuto();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                startAuto();
            });
        }

        dots.forEach(d => {
            d.addEventListener('click', () => {
                goToSlide(+d.dataset.slide);
                startAuto();
            });
        });

        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', () => isPaused = true);
            hero.addEventListener('mouseleave', () => isPaused = false);

            // Touch swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            hero.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            hero.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) {
                        goToSlide(currentSlide + 1);
                    } else {
                        goToSlide(currentSlide - 1);
                    }
                    startAuto();
                }
            }, { passive: true });
        }

        // Pause on background tab to prevent animation queue buildup
        document.addEventListener('visibilitychange', () => {
            isPaused = document.hidden;
        });

        startAuto();
    }

    // ===== GALLERY GRID (Homepage) =====
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        const galleryImages = [];
        for (let i = 1; i <= 17; i++) {
            if (i === 3) continue; // gallery3 missing
            galleryImages.push(`gallery${i}.jpg`);
        }
        galleryImages.forEach((src, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item anim-up';
            item.style.setProperty('--delay', `${i * 0.05}s`);
            item.innerHTML = `<img src="${src}" alt="Gallery ${i + 1}" loading="lazy">`;
            item.addEventListener('click', () => openLightbox(src, galleryImages, i));
            galleryGrid.appendChild(item);
        });
    }

    // ===== LANDSCAPE LIGHTBOX =====
    const landImages = ['10.png', '11.png', '12.png', '13.png', '14.png'];
    document.querySelectorAll('.landscape-card').forEach((card, i) => {
        card.addEventListener('click', () => openLightbox(landImages[i], landImages, i));
    });

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    let lbImages = [], lbIndex = 0;

    window.openLightbox = function(src, images, index) {
        lbImages = images;
        lbIndex = index;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    function lbNext() {
        lbIndex = (lbIndex + 1) % lbImages.length;
        lightboxImg.src = lbImages[lbIndex];
    }
    function lbPrev() {
        lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
        lightboxImg.src = lbImages[lbIndex];
    }

    if (lightbox) {
        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-next').addEventListener('click', lbNext);
        document.querySelector('.lightbox-prev').addEventListener('click', lbPrev);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lbNext();
            if (e.key === 'ArrowLeft') lbPrev();
        });
    }

    // ===== SCROLL ANIMATIONS =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const d = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
                const sd = getComputedStyle(entry.target).getPropertyValue('--split-delay') || '0s';
                const delay = Math.max(parseFloat(d), parseFloat(sd)) * 1000;
                setTimeout(() => entry.target.classList.add('visible'), delay || 0);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

    document.querySelectorAll('.anim-up, .anim-left, .anim-right, .anim-split').forEach(el => observer.observe(el));

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const mobile = document.getElementById('formMobile').value;
            const message = document.getElementById('formMessage').value;
            const text = encodeURIComponent(
                `Hello Sri Sadha Shiva Nursery!\n\nName: ${name}\nEmail: ${email}\nMobile: ${mobile}\nMessage: ${message}`
            );
            window.open(`https://wa.me/917981103996?text=${text}`, '_blank');
            contactForm.reset();
        });
    }

    // ===== ACTIVE NAV ON SCROLL (homepage) =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0 && !window.location.pathname.includes('plants.html')) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href === '#' + current) link.classList.add('active');
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = document.querySelector('.category-nav') ? 140 : 80;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // ===== CATEGORY PILL ACTIVE STATE (plants page) =====
    const catPills = document.querySelectorAll('.cat-pill');
    if (catPills.length > 0) {
        const catSections = document.querySelectorAll('.plant-section');
        window.addEventListener('scroll', () => {
            let current = '';
            catSections.forEach(sec => {
                if (window.scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
            });
            catPills.forEach(pill => {
                pill.classList.remove('active');
                const href = pill.getAttribute('href');
                if (href && href === '#' + current) pill.classList.add('active');
            });
        });
    }

    // ===== REVIEWS CAROUSEL =====
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewPrev = document.getElementById('reviewPrev');
    const reviewNext = document.getElementById('reviewNext');
    const reviewsDots = document.getElementById('reviewsDots');

    if (reviewsTrack) {
        const cards = reviewsTrack.querySelectorAll('.review-card');

        // Create dots
        if (reviewsDots) {
            cards.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = `review-dot ${idx === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                });
                reviewsDots.appendChild(dot);
            });
        }

        const dots = reviewsDots ? reviewsDots.querySelectorAll('.review-dot') : [];

        function updateActiveDot() {
            if (!dots.length) return;
            const trackRect = reviewsTrack.getBoundingClientRect();
            let closestIdx = 0;
            let minDiff = Infinity;
            cards.forEach((card, idx) => {
                const cardRect = card.getBoundingClientRect();
                const diff = Math.abs(cardRect.left - trackRect.left);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIdx = idx;
                }
            });
            dots.forEach((d, i) => d.classList.toggle('active', i === closestIdx));
        }

        reviewsTrack.addEventListener('scroll', updateActiveDot, { passive: true });

        function getStep() {
            const firstCard = cards[0];
            const gap = parseFloat(window.getComputedStyle(reviewsTrack).gap) || 24;
            return firstCard ? (firstCard.offsetWidth + gap) : 320;
        }

        if (reviewNext) {
            reviewNext.addEventListener('click', () => {
                reviewsTrack.scrollBy({ left: getStep(), behavior: 'smooth' });
            });
        }

        if (reviewPrev) {
            reviewPrev.addEventListener('click', () => {
                reviewsTrack.scrollBy({ left: -getStep(), behavior: 'smooth' });
            });
        }

        // Gentle auto scroll (pauses on interaction)
        let reviewAutoInterval;
        let isReviewPaused = false;
        function startReviewAuto() {
            reviewAutoInterval = setInterval(() => {
                if (!isReviewPaused) {
                    const maxScroll = reviewsTrack.scrollWidth - reviewsTrack.clientWidth;
                    if (reviewsTrack.scrollLeft >= maxScroll - 15) {
                        reviewsTrack.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        reviewsTrack.scrollBy({ left: getStep(), behavior: 'smooth' });
                    }
                }
            }, 6000);
        }

        reviewsTrack.addEventListener('mouseenter', () => isReviewPaused = true);
        reviewsTrack.addEventListener('mouseleave', () => isReviewPaused = false);
        reviewsTrack.addEventListener('touchstart', () => isReviewPaused = true, { passive: true });
        reviewsTrack.addEventListener('touchend', () => isReviewPaused = false, { passive: true });

        startReviewAuto();
    }

});

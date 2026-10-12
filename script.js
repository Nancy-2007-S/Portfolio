
// ── Native Smooth Scroll Spy ────────
document.addEventListener("DOMContentLoaded", function () {
    var sections = document.querySelectorAll('.page-section, .hero-section, .projects-arc-section');
    var navLinks = document.querySelectorAll('.nav-link');

    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var currentId = entry.target.id;
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(function(sec) {
        observer.observe(sec);
    });

    // Mobile nav fallback active click handling
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');
        });
    });

    // ── Hamburger Mobile Navigation Toggle ──
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var navMenu = document.getElementById('navMenu');
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
        });

        // Close menu on link click
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('mobile-active');
            });
        });

        // Close menu on click outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('mobile-active');
            }
        });
    }

    // ── Auto Replay Project & Achievement Videos On Reaching Section ──
    var projectVideos = document.querySelectorAll('.stacked-video-element, .timeline-media-element');
    if (projectVideos.length) {
        var videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var vid = entry.target;
                    if (vid.tagName.toLowerCase() === 'video') {
                        vid.currentTime = 0;
                        var playPromise = vid.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(function(error) {
                                // Autoplay policy fallback handling
                            });
                        }
                    }
                }
            });
        }, { threshold: 0.1 });

        projectVideos.forEach(function(vid) {
            videoObserver.observe(vid);
        });
    }

    // ── Semi-Circular Orbital Projects Carousel Engine (Dock Controls) ──
    var arcCards = Array.from(document.querySelectorAll('.arc-project-card'));
    var arcCounterCurrent = document.getElementById('arc-counter-current');
    var arcDockDots = Array.from(document.querySelectorAll('.project-dock-dot'));
    var currentArcActiveIndex = 0;

    function updateArcCardsPositions(floatIndex) {
        if (!arcCards.length) return;
        
        var totalCards = arcCards.length; // 4
        
        // Adaptive orbital positioning geometry across desktop, tablet, and mobile
        var isMobile = window.innerWidth <= 640;
        var isTablet = window.innerWidth > 640 && window.innerWidth <= 1024;

        var radiusX;
        var angleStep;
        var baseRotation;

        if (isMobile) {
            radiusX = Math.min(window.innerWidth * 0.72, 320);
            angleStep = 0.72;
            baseRotation = 10;
        } else if (isTablet) {
            radiusX = Math.min(window.innerWidth * 0.52, 460);
            angleStep = 0.54;
            baseRotation = 14;
        } else {
            radiusX = Math.min(window.innerWidth * 0.42, 580);
            angleStep = 0.46;
            baseRotation = 18;
        }
        var radiusY = radiusX * 0.28;

        arcCards.forEach(function(card, idx) {
            var diff = idx - floatIndex; // offset from current active focal point
            
            // Calculate orbital angle along semi-circle (in radians)
            var angleRad = diff * angleStep;
            
            // Position on semi-circular arc
            var translateX = Math.sin(angleRad) * radiusX;
            var translateY = (1 - Math.cos(angleRad)) * radiusY;
            var rotateDeg = diff * baseRotation;
            
            // Scale, opacity, and blur according to distance from center
            var absDiff = Math.abs(diff);
            var scale = Math.max(0.68, 1 - (absDiff * 0.16));
            var opacity = Math.max(0.12, 1 - (absDiff * 0.42));
            var zIndex = Math.round(100 - absDiff * 20);
            var blurPx = absDiff < 0.35 ? 0 : Math.min(10, absDiff * 6);

            // Apply 3D transform along arc trajectory
            card.style.transform = 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0px) rotate(' + rotateDeg + 'deg) scale(' + scale + ')';
            card.style.opacity = opacity.toFixed(2);
            card.style.filter = blurPx === 0 ? 'blur(0px)' : 'blur(' + blurPx.toFixed(1) + 'px)';
            card.style.zIndex = zIndex;

            if (absDiff < 0.4) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Update active index indicator
        var activeInt = Math.max(0, Math.min(totalCards - 1, Math.round(floatIndex)));
        currentArcActiveIndex = activeInt;

        if (arcCounterCurrent) {
            arcCounterCurrent.textContent = '0' + (activeInt + 1);
        }

        // Update bottom dock indicators (active elongated glowing capsule vs inactive round dots)
        arcDockDots.forEach(function(btn, bIdx) {
            if (bIdx === activeInt) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Direct selection when clicking dot or card
    window.selectArcProject = function(index) {
        if (!arcCards.length) return;
        var nextIdx = Math.max(0, Math.min(arcCards.length - 1, index));
        currentArcActiveIndex = nextIdx;
        updateArcCardsPositions(nextIdx);
    };

    // Step previous/next project via dock arrows
    window.stepArcCarousel = function(direction) {
        if (!arcCards.length) return;
        var total = arcCards.length;
        var nextIdx = (currentArcActiveIndex + direction + total) % total;
        window.selectArcProject(nextIdx);
    };

    // Touch swipe support for Mobile & Tablet
    var stageEl = document.getElementById('arc-carousel-stage');
    if (stageEl) {
        var touchStartX = 0;
        var touchStartY = 0;
        
        stageEl.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length > 0) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        stageEl.addEventListener('touchend', function(e) {
            if (!e.changedTouches || !e.changedTouches.length) return;
            var touchEndX = e.changedTouches[0].clientX;
            var touchEndY = e.changedTouches[0].clientY;
            var diffX = touchEndX - touchStartX;
            var diffY = touchEndY - touchStartY;

            // Check if horizontal swipe is prominent
            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    // Swiped Left -> Next Project
                    window.stepArcCarousel(1);
                } else {
                    // Swiped Right -> Previous Project
                    window.stepArcCarousel(-1);
                }
            }
        }, { passive: true });
    }

    // Initialize initial project positions & handle resize
    updateArcCardsPositions(0);
    window.addEventListener('resize', function() {
        updateArcCardsPositions(currentArcActiveIndex);
    });

    // ── 3D Cover Flow Perspective Carousel (Achievements Section) ──
    (function initAchievementsFlow() {
        var stage = document.getElementById('achieveFlowStage');
        var wrapper = document.getElementById('achieveFlowWrapper');
        if (!stage || !wrapper) return;

        var cards = Array.from(stage.querySelectorAll('.achieve-flow-card'));
        var dotsContainer = document.getElementById('achieveFlowDots');
        var prevBtn = document.getElementById('achieveFlowPrev');
        var nextBtn = document.getElementById('achieveFlowNext');
        if (!cards.length) return;

        var currentIndex = 0;
        var total = cards.length;
        var autoPlayTimer = null;
        var isDragging = false;
        var startX = 0;
        var deltaX = 0;

        // Populate dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            cards.forEach(function(_, idx) {
                var dot = document.createElement('div');
                dot.className = 'flow-dot' + (idx === 0 ? ' is-active' : '');
                dot.setAttribute('title', 'Achievement ' + (idx + 1));
                dot.addEventListener('click', function(e) {
                    e.stopPropagation();
                    goToSlide(idx);
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateLayout() {
            var width = window.innerWidth;
            var stepX = 230;
            if (width <= 600) {
                stepX = 120;
            } else if (width <= 960) {
                stepX = 175;
            }

            cards.forEach(function(card, idx) {
                var diff = idx - currentIndex;
                // Wrap around cyclic distance
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                card.classList.remove('is-active');

                if (diff === 0) {
                    // CENTER / ACTIVE
                    card.classList.add('is-active');
                    card.style.transform = 'translateX(0px) scale(1) translateZ(0px)';
                    card.style.opacity = '1';
                    card.style.filter = 'blur(0px) brightness(1)';
                    card.style.zIndex = '15';
                    card.style.pointerEvents = 'auto';
                    card.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 255, 255, 0.12)';
                    card.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                } else if (Math.abs(diff) === 1) {
                    // IMMEDIATE SIBLINGS
                    var sign = Math.sign(diff);
                    var x = sign * stepX;
                    card.style.transform = 'translateX(' + x + 'px) scale(0.85) translateZ(-50px)';
                    card.style.opacity = '0.78';
                    card.style.filter = 'blur(1px) brightness(0.8)';
                    card.style.zIndex = '10';
                    card.style.pointerEvents = 'auto';
                    card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.75)';
                    card.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                } else if (Math.abs(diff) === 2) {
                    // FAR SIBLINGS
                    var sign2 = Math.sign(diff);
                    var x2 = sign2 * (stepX * 1.85);
                    card.style.transform = 'translateX(' + x2 + 'px) scale(0.72) translateZ(-120px)';
                    card.style.opacity = '0.42';
                    card.style.filter = 'blur(2.5px) brightness(0.65)';
                    card.style.zIndex = '5';
                    card.style.pointerEvents = 'auto';
                    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.6)';
                    card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                } else {
                    // HIDDEN OFF-STAGE
                    var sign3 = Math.sign(diff);
                    var x3 = sign3 * (stepX * 2.5);
                    card.style.transform = 'translateX(' + x3 + 'px) scale(0.55) translateZ(-200px)';
                    card.style.opacity = '0';
                    card.style.filter = 'blur(5px)';
                    card.style.zIndex = '1';
                    card.style.pointerEvents = 'none';
                    card.style.borderColor = 'transparent';
                }
            });

            // Update dots
            if (dotsContainer) {
                var dots = dotsContainer.querySelectorAll('.flow-dot');
                dots.forEach(function(dot, dIdx) {
                    dot.classList.toggle('is-active', dIdx === currentIndex);
                });
            }
        }

        function goToSlide(index) {
            // Reset info hidden toggle on slide change
            cards.forEach(function(c) {
                c.classList.remove('info-hidden');
            });
            currentIndex = (index + total) % total;
            updateLayout();
            resetAutoPlay();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function toggleCardInfo(card) {
            var isHidden = card.classList.toggle('info-hidden');
            if (isHidden) {
                resetAutoPlay();
            } else {
                clearInterval(autoPlayTimer);
            }
        }

        // Click or tap on any card to navigate or toggle info
        cards.forEach(function(card, idx) {
            card.addEventListener('click', function(e) {
                // If clicked on mute button, do nothing here
                if (e.target.closest('.achieve-mute-btn')) return;

                if (idx !== currentIndex) {
                    goToSlide(idx);
                } else {
                    // Tap on center active poster toggles message
                    toggleCardInfo(card);
                }
            });

            // Explicit toggle button tap
            var toggleBtn = card.querySelector('.achieve-info-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (idx !== currentIndex) {
                        goToSlide(idx);
                    } else {
                        toggleCardInfo(card);
                    }
                });
            }
        });

        if (nextBtn) nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nextSlide();
        });

        if (prevBtn) prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            prevSlide();
        });

        // Swipe & Drag Support
        wrapper.addEventListener('pointerdown', function(e) {
            isDragging = true;
            startX = e.clientX;
            deltaX = 0;
        });

        window.addEventListener('pointermove', function(e) {
            if (!isDragging) return;
            deltaX = e.clientX - startX;
        });

        window.addEventListener('pointerup', function() {
            if (!isDragging) return;
            isDragging = false;
            if (deltaX > 45) {
                prevSlide();
            } else if (deltaX < -45) {
                nextSlide();
            }
        });

        // AutoPlay Timer
        function startAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(function () { if (!window.__achieveHold) nextSlide(); }, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        wrapper.addEventListener('mouseenter', function() {
            clearInterval(autoPlayTimer);
        });

        wrapper.addEventListener('mouseleave', function() {
            startAutoPlay();
        });

        window.addEventListener('resize', updateLayout);

        // Initialize stage
        updateLayout();
        startAutoPlay();
    })();

    // ── Ultra-Smooth Inertial Scroll & Kinetic Motion Transitions (Reference: transition.mp4) ──
    (function initSmoothTransitions() {
        // 1. Lenis Smooth Inertial Scrolling Engine
        var lenis = null;
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.25,
                easing: function(t) {
                    return Math.min(1, 1.001 - Math.pow(2, -10 * t)); // Luxury exponential ease
                },
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                smoothTouch: false, // Maintain native swipe feel on touch screens
                touchMultiplier: 1.8
            });

            function lenisRaf(time) {
                lenis.raf(time);
                requestAnimationFrame(lenisRaf);
            }
            requestAnimationFrame(lenisRaf);

            // Connect smooth scrolling to internal navigation links
            document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
                anchor.addEventListener('click', function(e) {
                    var targetId = this.getAttribute('href');
                    if (!targetId || targetId === '#' || targetId === '#!') return;
                    var targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        lenis.scrollTo(targetEl, {
                            offset: 0,
                            duration: 1.3,
                            easing: function(t) {
                                return Math.min(1, 1.001 - Math.pow(2, -10 * t));
                            }
                        });
                    }
                });
            });
        }

        // 2. GSAP ScrollTrigger Choreography (Movement of Texts and Images)
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            document.body.classList.add('gsap-active');

            // Synchronize Lenis with GSAP ScrollTrigger ticker
            if (lenis) {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add(function(time) {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            }

            // Refresh ScrollTrigger after initial intro animation completes
            setTimeout(function() {
                ScrollTrigger.refresh();
            }, 3700);

            // Preserve Hero Starting Page & Backward Portfolio Text with original color and appearance
            // No opacity, color, or filter overrides on intro-overlay, introName, or starting page elements

            // B. ABOUT SECTION: Kinetic Title, Photo Orbit & Bio Card Reveal
            var aboutSec = document.getElementById('about');
            if (aboutSec) {
                // Photo Orbit: Smooth scale-up and upward glide
                var photoWrap = aboutSec.querySelector('.hero-photo-wrap');
                if (photoWrap) {
                    gsap.fromTo(photoWrap, 
                        { y: 70, scale: 0.92, opacity: 0 },
                        {
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            duration: 1.25,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: photoWrap,
                                start: 'top 85%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );

                    // Continuous float scrub while passing About section
                    gsap.to(photoWrap, {
                        scrollTrigger: {
                            trigger: aboutSec,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 0.8
                        },
                        y: '-25px',
                        ease: 'none'
                    });
                }

                // Intro Title: Kinetic upward reveal
                var introTitle = aboutSec.querySelector('.about-intro-title');
                if (introTitle) {
                    gsap.fromTo(introTitle,
                        { y: 55, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: introTitle,
                                start: 'top 88%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }

                // Bio Card: Staggered entrance
                var infoCard = aboutSec.querySelector('.orbital-info-card');
                if (infoCard) {
                    gsap.fromTo(infoCard,
                        { y: 60, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.2,
                            delay: 0.15,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: infoCard,
                                start: 'top 86%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }

                // Skills Marquee: Smooth rise into view
                var marqueeWrap = aboutSec.querySelector('.skills-marquee-container');
                if (marqueeWrap) {
                    gsap.fromTo(marqueeWrap,
                        { y: 45, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.2,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: marqueeWrap,
                                start: 'top 90%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }
            }

            // C. FEATURED PROJECTS SECTION: Header & Semi-Circular Stage Entrance
            var projSec = document.getElementById('projects');
            if (projSec) {
                var arcHeader = projSec.querySelector('.arc-projects-header');
                if (arcHeader) {
                    gsap.fromTo(arcHeader,
                        { y: 45, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: arcHeader,
                                start: 'top 88%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }

                var arcStage = projSec.querySelector('.arc-carousel-stage');
                if (arcStage) {
                    gsap.fromTo(arcStage,
                        { y: 60, scale: 0.95, opacity: 0 },
                        {
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            duration: 1.3,
                            delay: 0.1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: arcStage,
                                start: 'top 82%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }

                var arcDock = projSec.querySelector('.project-nav-dock');
                if (arcDock) {
                    gsap.fromTo(arcDock,
                        { y: 30, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            delay: 0.25,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: arcDock,
                                start: 'top 92%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }
            }

            // D. ACHIEVEMENTS SECTION: Header & 3D Coverflow Stage Entrance
            var achieveSec = document.getElementById('achievements');
            if (achieveSec) {
                var achieveHeader = achieveSec.querySelector('.achievements-section-header');
                if (achieveHeader) {
                    gsap.fromTo(achieveHeader,
                        { y: 45, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: achieveHeader,
                                start: 'top 88%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }

                var achieveWrapper = achieveSec.querySelector('.achieve-flow-wrapper');
                if (achieveWrapper) {
                    gsap.fromTo(achieveWrapper,
                        { y: 60, scale: 0.94, opacity: 0 },
                        {
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            duration: 1.3,
                            delay: 0.1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: achieveWrapper,
                                start: 'top 82%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }
            }

            // E. CONTACT SECTION: Editorial Heading & Channel Cards Stagger
            var contactSec = document.getElementById('contact');
            if (contactSec) {
                var contactHead = contactSec.querySelector('.editorial-heading-wrap');
                if (contactHead) {
                    gsap.fromTo(contactHead,
                        { y: 45, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: contactHead,
                                start: 'top 88%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }

                var channelCards = contactSec.querySelectorAll('.editorial-channel-card');
                if (channelCards.length) {
                    gsap.fromTo(channelCards,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1.1,
                            stagger: 0.12,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: contactSec.querySelector('.editorial-channels-grid') || contactSec,
                                start: 'top 84%',
                                toggleActions: 'restart none restart reset'
                            }
                        }
                    );
                }
            }

            // F. CONTINUOUS EDITORIAL PARALLAX ON HEADINGS (Floating Magazine Depth)
            document.querySelectorAll('.editorial-section-title').forEach(function(titleEl) {
                gsap.to(titleEl, {
                    scrollTrigger: {
                        trigger: titleEl,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2
                    },
                    y: '-22px',
                    ease: 'none'
                });
            });
        }
    })();
});

/* ─── Copy Email to Clipboard Helper ─────────────────────────────────────── */
window.copyEmailToClipboard = function(el) {
    var email = 'nancy54200717@gmail.com';
    var target = (el && el.querySelector) ? (el.querySelector('.copy-badge') || el) : el;
    navigator.clipboard.writeText(email).then(function() {
        var origHTML = target.innerHTML;
        target.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span style="color:#00e676; font-weight:700;">Copied!</span>';
        setTimeout(function() {
            target.innerHTML = origHTML;
        }, 2200);
    }).catch(function() {
        prompt('Copy email:', email);
    });
};

/* ─── Direct Mailbox Contact Form Handlers ────────────────────────────────── */
window.handleDirectMailSubmit = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var msgEl = document.getElementById('mailMessageText');
    var sendBtn = document.getElementById('mailboxSendBtn');
    var feedbackEl = document.getElementById('mailboxFeedback');
    var feedbackText = document.getElementById('mailboxFeedbackText');
    
    var message = msgEl ? msgEl.value.trim() : '';
    if (!message) {
        if (msgEl) msgEl.focus();
        return;
    }

    var originalBtnHTML = sendBtn ? sendBtn.innerHTML : '<span>SEND MESSAGE</span>';

    // Show Sending state on button
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="mailbox-spinner"></span> <span>SENDING...</span>';
    }

    var targetEmail = 'nancy54200717@gmail.com';
    var payload = {
        _subject: "Direct Portfolio Message",
        _captcha: "false",
        _template: "table",
        message: message
    };

    function showFeedback(ok, text) {
        if (feedbackEl) feedbackEl.style.display = 'flex';
        if (feedbackEl) feedbackEl.setAttribute('data-state', ok ? 'ok' : 'err');
        if (feedbackText) feedbackText.textContent = text;
        setTimeout(function () { if (feedbackEl) feedbackEl.style.display = 'none'; }, 6000);
    }

    fetch("https://formsubmit.co/ajax/" + targetEmail, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; });
    })
    .then(function (r) {
        var msg = (r.data && r.data.message) ? String(r.data.message) : '';
        if (msg.toLowerCase().indexOf('activation') !== -1) {
            showFeedback(true, "Activation email sent! Please check nancy54200717@gmail.com and click 'Activate Form'.");
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<span>CHECK EMAIL</span>';
                setTimeout(function () { sendBtn.innerHTML = originalBtnHTML; }, 5000);
            }
            return;
        }
        if (!r.ok || !(r.data.success === true || r.data.success === 'true')) throw new Error('not delivered');
        if (msgEl) msgEl.value = '';
        if (feedbackEl) feedbackEl.style.display = 'none';
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<span>SENT \u2713</span>';
            setTimeout(function () { sendBtn.innerHTML = originalBtnHTML; }, 3000);
        }
    })
    .catch(function () {
        // Keep the visitor's text so nothing is lost, and tell them honestly.
        showFeedback(false, "Couldn't send just now. Please email nancy54200717@gmail.com directly.");
        if (sendBtn) { sendBtn.disabled = false; sendBtn.innerHTML = originalBtnHTML; }
    });
};

/* ─── Mouse Movement (Parallax) ──────────────────────────────────────────── */

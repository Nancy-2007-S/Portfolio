/* ==========================================================================
   motion.js — loaded AFTER script.js. Delete this file (and its <script>)
   to return to the previous animations. It only animates child elements, so
   it does not fight the section tweens already in script.js.
   ========================================================================== */
(function () {
    'use strict';
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Fit the intro word to the screen even when Impact isn't installed (e.g. Android)
    function fitIntro() {
        var el = document.querySelector('.intro-massive-name'); if (!el) return;
        var txt = el.textContent, sz = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = ''; sz = parseFloat(getComputedStyle(el).fontSize);
        el.textContent = 'PORTFOLIO'; el.style.cssText += ';display:inline-block;width:max-content;max-width:none';
        var w = el.offsetWidth; el.textContent = txt; el.style.display = ''; el.style.width = ''; el.style.maxWidth = '';
        if (w > innerWidth * 0.94) el.style.fontSize = (sz * innerWidth * 0.94 / w) + 'px';
    }
    fitIntro(); window.addEventListener('resize', fitIntro);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitIntro);

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    document.documentElement.classList.add('js-motion');

    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };




    /* ---- 1. Hero: portrait glides up in 3D, then the intro text slides in L→R -- */
    var heroStarted = false;
    function playHero() {
        if (heroStarted) return;
        heroStarted = true;
        var wrap = $('.hero-blazer-wrap'), words = $$('.tag-word'), rule = $('.hero-rule');
        var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo(wrap,
            { autoAlpha: 0, y: '26vh', rotationX: 20, scale: 0.94, filter: 'blur(10px)', transformOrigin: '50% 100%', transformPerspective: 1400 },
            { autoAlpha: 1, y: 0, rotationX: 0, scale: 1, filter: 'blur(0px)', duration: 2, onComplete: enableHeroTilt })
          .fromTo(words, { xPercent: -115, autoAlpha: 0 },
            { xPercent: 0, autoAlpha: 1, duration: 1.2, stagger: 0.16, ease: 'power4.out' }, '-=1.1')
          .fromTo(rule, { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 1, ease: 'power3.out' }, '-=0.7');
    }
    document.addEventListener('intro:done', playHero);
    setTimeout(playHero, 5200); // safety net if the intro event never fires

    function enableHeroTilt() {
        gsap.to($('.hero-blazer-wrap'), { y: -9, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        if (!fine) return;
        var wrap = $('.hero-blazer-wrap');
        var rx = gsap.quickTo(wrap, 'rotationX', { duration: 0.9, ease: 'power3.out' });
        var ry = gsap.quickTo(wrap, 'rotationY', { duration: 0.9, ease: 'power3.out' });
        window.addEventListener('pointermove', function (e) {
            ry((e.clientX / innerWidth - 0.5) * 6);
            rx(-(e.clientY / innerHeight - 0.5) * 3);
        }, { passive: true });
    }

    /* ---- 2. Scroll reveals: one shared language — wipe from left to right ------ */
    function wipe(el, opts) {
        opts = opts || {};
        if (!el) return;
        gsap.fromTo(el,
            { clipPath: 'inset(0 100% 0 0)', x: -40 },
            { clipPath: 'inset(-12% -12% -12% -12%)', x: 0, duration: 1.3, delay: opts.delay || 0, ease: 'power4.out',
              scrollTrigger: { trigger: opts.trigger || el, start: opts.start || 'top 86%', toggleActions: 'restart none restart reset' } });
    }
    function pop3D(els, trigger, from, to) {
        if (!els || (els.length === 0)) return;
        gsap.fromTo(els, from, Object.assign({ ease: 'expo.out', scrollTrigger: { trigger: trigger, start: 'top 80%', toggleActions: 'restart none restart reset' } }, to));
    }

    // About
    wipe($('.about-intro-title'));
    pop3D($('.about-orb'), $('.about-photo-wrap'),
        { rotationY: -42, transformPerspective: 1000, transformOrigin: '50% 50%' },
        { rotationY: 0, duration: 1.8 });
    $$('.skills-marquee-row').forEach(function (row, i) { wipe(row, { delay: i * 0.15, start: 'top 94%' }); });

    // Projects
    wipe($('.projects-arc-section .editorial-section-title'));
    pop3D($$('.arc-pill'), $('.arc-carousel-stage'),
        { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.04, ease: 'back.out(2.2)' });

    // Achievements
    wipe($('.achievements-section-header .editorial-section-title'));
    pop3D($$('.achieve-card-media'), $('.achieve-flow-wrapper'),
        { scale: 1.35 }, { scale: 1, duration: 1.8, stagger: 0.08 });

    // Contact: each headline line wipes in, mailbox swings in from the right
    $$('.editorial-line').forEach(function (line, i) { wipe(line, { delay: i * 0.14, trigger: '.editorial-contact-title', start: 'top 82%' }); });
    pop3D($('.editorial-mailbox-card'), $('.editorial-mailbox-wrap'),
        { opacity: 0.35, x: 60, rotationY: 24, transformPerspective: 1000, transformOrigin: '100% 50%' },
        { opacity: 1, x: 0, rotationY: 0, duration: 1.5 }); // never fully hidden: the form must always be usable

    /* ---- 3. Pointer-driven 3D tilt on cards (mouse devices only) ----------------- */
    if (fine) {
        [['.about-photo-wrap', 8], ['.orbital-info-card', 5], ['.editorial-mailbox-card', 4], ['.editorial-channel-card', 5]].forEach(function (pair) {
            $$(pair[0]).forEach(function (el) {
                el.setAttribute('data-tilt', '');
                el.addEventListener('pointermove', function (e) {
                    var r = el.getBoundingClientRect();
                    gsap.to(el, { rotationY: ((e.clientX - r.left) / r.width - 0.5) * 2 * pair[1],
                                  rotationX: -((e.clientY - r.top) / r.height - 0.5) * 2 * pair[1],
                                  transformPerspective: 900, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
                });
                el.addEventListener('pointerleave', function () {
                    gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1,0.6)', overwrite: 'auto' });
                });
            });
        });
    }

    /* ---- 3b. Videos: only the visible/active one plays; projects restart from 0 ---- */
    var pv = $$('.arc-project-card video');
    function syncProjectVideos() {
        pv.forEach(function (v) {
            var on = v.closest('.arc-project-card').classList.contains('active');
            if (on && v.paused) v.play().catch(function () {}); else if (!on && !v.paused) v.pause();
        });
    }
    if ($('#projects')) {
        ScrollTrigger.create({ trigger: '#projects', start: 'top 70%', end: 'bottom 20%',
            onEnter: restart, onEnterBack: restart, onLeave: stopAll, onLeaveBack: stopAll });
        $$('.arc-project-card').forEach(function (c) { new MutationObserver(syncProjectVideos).observe(c, { attributes: true, attributeFilter: ['class'] }); });
    }
    function restart() { pv.forEach(function (v) { v.currentTime = 0; }); syncProjectVideos(); }
    function stopAll() { pv.forEach(function (v) { v.pause(); }); }

    // Achievements video: plays only while its card is centred AND the section is on screen.
    // Sound ON = it keeps playing and the carousel holds, until the viewer mutes or taps to pause/resume.
    var av = document.getElementById('achieve-vid-4');
    if (av) {
        var card = av.closest('.achieve-flow-card'), mbtn = card.querySelector('.achieve-mute-btn');
        var muteLabel = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg><span>Unmute</span>';
        var inView = false, userPaused = false, wasActive = false;
        var noop = function () {};
        function resetAudio() { av.muted = true; window.__achieveHold = false; mbtn.innerHTML = muteLabel; }
        function syncAv() {
            var active = card.classList.contains('is-active');
            if (active && inView) { if (av.paused && !userPaused) av.play().catch(noop); }
            else if (!av.paused) { av.pause(); }
        }
        new MutationObserver(function () {
            var active = card.classList.contains('is-active');
            if (active && !wasActive) { av.currentTime = 0; userPaused = false; }
            if (!active && wasActive) resetAudio();
            wasActive = active; syncAv();
        }).observe(card, { attributes: true, attributeFilter: ['class'] });
        ScrollTrigger.create({ trigger: '#achievements', start: 'top 85%', end: 'bottom 15%',
            onToggle: function (self) { inView = self.isActive; if (!inView) resetAudio(); syncAv(); } });
        av.addEventListener('canplay', syncAv);
        av.load(); // start buffering immediately so there is no wait when the card arrives
        card.querySelector('.achieve-card-media').addEventListener('click', function (e) {
            if (av.muted || e.target.closest('.achieve-mute-btn')) return;
            e.stopPropagation(); // sound on: a tap pauses/resumes instead of toggling the caption
            userPaused = !av.paused; if (av.paused) av.play().catch(noop); else av.pause();
        }, true);
    }

    /* ---- 3c. Menu: aria + close on Escape ---- */
    var hb = document.getElementById('hamburgerBtn'), nm = document.getElementById('navMenu');
    if (hb && nm) {
        new MutationObserver(function () { hb.setAttribute('aria-expanded', nm.classList.contains('mobile-active')); }).observe(nm, { attributes: true, attributeFilter: ['class'] });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { hb.classList.remove('active'); nm.classList.remove('mobile-active'); } });
    }

    /* ---- 3d. Magnetic icon buttons (mouse only) ---- */
    if (fine) {
        $$('.icon-link, .footer-icon-link, .theme-toggle').forEach(function (el) {
            var mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }), my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
            el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.35); my((e.clientY - r.top - r.height / 2) * 0.35); });
            el.addEventListener('pointerleave', function () { mx(0); my(0); });
        });
    }

    /* ---- 4. Scroll progress bar ------------------------------------------------------ */
    var bar = document.createElement('div');
    bar.id = 'scrollProgress';
    document.body.appendChild(bar);
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    /* ---- 5. Re-measure once fonts/images settle so triggers land correctly ----------- */
    var refresh = function () { ScrollTrigger.refresh(); };
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
})();

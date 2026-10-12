/* Light / dark toggle. The saved choice is applied by a tiny inline script in <head> (no flash). */
(function () {
    'use strict';
    var root = document.documentElement, btn = document.getElementById('themeToggle');
    if (!btn) return;
    function apply(theme, save) {
        root.setAttribute('data-theme', theme);
        btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = theme === 'light' ? '#f4f2ee' : '#000000';
        if (save) { try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ } }
    }
    apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);
    btn.addEventListener('click', function () {
        root.classList.add('theme-switching');
        apply(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
        setTimeout(function () { root.classList.remove('theme-switching'); }, 700);
    });
})();

/* =========================================================
   Plama TV Repairs — vanilla JS
   Pure browser JS. No frameworks, no build-time imports.
   Drop this file next to index.html and styles.css and it
   will work on any static host.
   ========================================================= */

(function () {
  'use strict';

  /* --- Year in footer --- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Nav: scroll state + mobile toggle --- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 16) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  /* --- Smooth scroll for in-page anchors (closes mobile menu) --- */
  document.querySelectorAll('a[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (nav) nav.classList.remove('is-open');
    });
  });

  /* --- Scroll reveal via IntersectionObserver --- */
  var revealEls = document.querySelectorAll('[data-reveal], .reveal-line');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --- Stagger reveal lines in the hero title --- */
  var staggerEls = document.querySelectorAll('[data-reveal-stagger]');
  staggerEls.forEach(function (el, i) {
    el.style.transitionDelay = (i * 120) + 'ms';
  });

  /* --- Animated stats counter --- */
  var stats = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && stats.length) {
    var sIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var duration = 1600;
        var start = performance.now();
        function tick(now) {
          var p = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          var value = Math.round(target * eased);
          el.textContent = value.toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        sIo.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { sIo.observe(el); });
  }

  /* --- Parallax for hero blobs --- */
  var blob1 = document.querySelector('.hero__blob--1');
  var blob2 = document.querySelector('.hero__blob--2');
  var heroVisual = document.querySelector('.hero__visual');
  var ticking = false;
  function parallax() {
    var y = window.scrollY;
    if (blob1) blob1.style.transform = 'translate3d(0,' + (y * 0.15) + 'px,0)';
    if (blob2) blob2.style.transform = 'translate3d(0,' + (y * -0.08) + 'px,0)';
    if (heroVisual && y < 800) heroVisual.style.transform = 'translate3d(0,' + (y * -0.05) + 'px,0)';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }, { passive: true });

  /* --- Contact form: simple client-side success state --- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Basic validation
      var required = form.querySelectorAll('[required]');
      var ok = true;
      required.forEach(function (input) {
        if (!input.value.trim()) {
          input.style.borderColor = '#e85a18';
          ok = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!ok) return;
      form.reset();
      if (note) {
        note.hidden = false;
        setTimeout(function () { note.hidden = true; }, 6000);
      }
    });
  }
})();

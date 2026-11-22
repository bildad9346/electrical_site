/* ==========================================================================
   Barriam Electricals: script.js
   Vanilla JS, no dependencies. Sections:
   1. Setup  2. Nav  3. Scroll progress  4. Reveals  5. Testimonials  6. Form
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- 1. Setup ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 2. Navigation ---------- */
  const nav = $('.nav');
  const toggle = $('.nav__toggle');

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  // Close menu after picking a link, or on Escape
  $$('.nav__menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });

  // Highlight the nav link for the section in view
  const links = $$('.nav__links a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((l) => { const s = $(l.getAttribute('href')); if (s) spy.observe(s); });

  /* ---------- 3. Scroll progress ("current" line) + nav background ---------- */
  const root = document.documentElement;
  let ticking = false;
  const onScroll = () => {
    const max = root.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    root.style.setProperty('--progress', p.toFixed(4));
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- 4. Scroll reveals ---------- */
  const reveals = $$('.reveal');
  // Stagger siblings within the same list so grids cascade gently
  reveals.forEach((el) => {
    const parent = el.parentElement;
    if (parent && parent.matches('.cards, .stats, .timeline, .tiles')) {
      el.style.setProperty('--delay', `${[...parent.children].indexOf(el) * 80}ms`);
    }
  });

  const timeline = $('.timeline');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    if (timeline) timeline.classList.add('is-charged');
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));

    // The timeline line "charges" once the steps come into view
    if (timeline) {
      new IntersectionObserver(([entry], obs) => {
        if (entry.isIntersecting) { timeline.classList.add('is-charged'); obs.disconnect(); }
      }, { threshold: 0.4 }).observe(timeline);
    }
  }

  /* ---------- 5. Testimonials (auto-rotate, pause on hover/focus) ---------- */
  const quotes = $$('.quote');
  const dots = $$('.dot');
  let current = 0;
  let timer = null;

  const show = (i) => {
    current = (i + quotes.length) % quotes.length;
    quotes.forEach((q, n) => q.classList.toggle('is-active', n === current));
    dots.forEach((d, n) => {
      d.classList.toggle('is-active', n === current);
      d.setAttribute('aria-pressed', String(n === current));
    });
  };
  const start = () => { if (!reduceMotion && quotes.length > 1) { stop(); timer = setInterval(() => show(current + 1), 6500); } };
  const stop = () => { clearInterval(timer); timer = null; };

  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); start(); }));
  const quoteBox = $('.quotes');
  if (quoteBox) {
    quoteBox.addEventListener('mouseenter', stop);
    quoteBox.addEventListener('mouseleave', start);
    quoteBox.addEventListener('focusin', stop);
    quoteBox.addEventListener('focusout', start);
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();

  /* ---------- 6. Quote form: validation + submission ---------- */
  const form = $('#quote-form');
  if (!form) return;
  const status = $('.form__status', form);

  // Kenyan numbers: 07XX / 01XX (10 digits) or +254 / 254 followed by 9 digits
  const phoneOk = (v) => /^(?:\+?254|0)(?:7|1)\d{8}$/.test(v.replace(/[\s-]/g, ''));
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const rules = {
    name:    (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    phone:   (v) => (!v.trim() ? 'Please enter a phone number.' : phoneOk(v) ? '' : 'Use a Kenyan number, e.g. 0711 175 656.'),
    email:   (v) => (!v.trim() || emailOk(v.trim()) ? '' : 'That email doesn’t look right.'),
    service: (v) => (v ? '' : 'Please choose a service.'),
    message: (v) => (v.trim().length >= 10 ? '' : 'Tell us a little more (at least 10 characters).'),
  };

  const validateField = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;
    const msg = rule(input.value);
    const field = input.closest('.field');
    const err = $('.field__error', field);
    field.classList.toggle('has-error', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
    err.textContent = msg;
    return !msg;
  };

  // Validate on blur; once a field has errored, re-check as the user types
  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('has-error')) validateField(input); });
  });

  const showSuccess = (name) => {
    const first = name.trim().split(/\s+/)[0];
    form.innerHTML = `
      <div class="form-success" tabindex="-1">
        <div class="form-success__ring" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
        <h3>Request received${first ? `, ${first.replace(/[<>&"]/g, '')}` : ''}.</h3>
        <p>We’ll call you back shortly. Need us urgently? Call <a href="tel:+254711175656" class="accent-text">0711 175 656</a>.</p>
      </div>`;
    $('.form-success', form).focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('is-error');

    const inputs = Object.keys(rules).map((n) => form.elements[n]);
    const results = inputs.map(validateField);
    const firstBad = inputs[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }

    const btn = $('button[type="submit"]', form);
    const name = form.elements.name.value;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Demo mode: until a real Formspree ID is set, simulate success locally
    if (form.action.includes('YOUR_FORM_ID')) {
      setTimeout(() => showSuccess(name), 600);
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(res.status);
      showSuccess(name);
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send Request';
      status.classList.add('is-error');
      status.textContent = 'Something went wrong. Please try again or call 0711 175 656.';
    }
  });
})();

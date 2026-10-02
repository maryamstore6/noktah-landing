/* ==========================================================================
   Noktah — motion layer
   Lenis smooth scroll + GSAP ScrollTrigger choreography.
   Deliberately no WebGL: this is a paid-traffic landing page and the
   1.3MB three.js payload would cost more in conversions than it returns.
   ========================================================================== */
(function () {
  'use strict';

  // Tell the inline safety net in index.html that the motion layer really
  // booted, so it does not strip the `js` class and kill every animation.
  window.__siteBooted = true;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasLenis = typeof window.Lenis !== 'undefined';

  /* ------------------------------------------------------------------ *
   * Preloader / logo intro
   * A single gold dot appears, stretches into a rule, then the wordmark
   * resolves — "noktah" (a full stop) that moves on instead of resting.
   * Hard 2.6s ceiling: a loader that waits on a slow asset on a 3G
   * Meta-ad click is a bounce, not a flourish.
   * ------------------------------------------------------------------ */
  var loader = document.getElementById('loader');
  var intro = document.getElementById('intro');
  var bar = document.getElementById('loader-bar');
  var pct = document.getElementById('loader-pct');
  var done = false;

  function finishLoader() {
    if (done) return;
    done = true;
    document.body.classList.remove('is-loading');
    if (loader) loader.classList.add('is-gone');
    if (window.__site && window.__site.lenis) window.__site.lenis.start();
    if (hasGSAP && window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  /* Hide the loader explicitly instead of relying on the reduced-motion CSS
     media query alone. If that query ever fails to match, the loader is a
     full-screen z-9999 overlay sitting on top of the whole page. */
  function hideLoader() {
    document.body.classList.remove('is-loading');
    if (loader) loader.classList.add('is-gone');
    done = true;
  }

  if (reduced || !loader) {
    // No motion, or a partial page with no loader: never hold the body.
    hideLoader();
  } else {
    if (intro) intro.classList.add('is-play');
    // Progress is cosmetic here — the intro is the real event.
    var p = 0;
    var tick = setInterval(function () {
      p += Math.random() * 24 + 12;
      if (p >= 100) p = 100;
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = String(Math.floor(p)).padStart(3, '0') + '%';
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(finishLoader, 260);
      }
    }, 120);
    setTimeout(finishLoader, 2600); // hard ceiling
  }

  /* ------------------------------------------------------------------ *
   * Lenis smooth scroll
   * ------------------------------------------------------------------ */
  var lenis = null;
  if (hasLenis && !reduced) {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    if (hasGSAP && window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }
  }

  // Expose for verification probes.
  window.__site = { lenis: lenis, reduced: reduced };

  /* ------------------------------------------------------------------ *
   * GSAP setup
   * ------------------------------------------------------------------ */
  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ------------------------------------------------------------------ *
   * Scroll progress — a travelling dot instead of a bar
   * ------------------------------------------------------------------ */
  var progress = document.querySelector('.progress');
  var progressDot = document.getElementById('progressDot');
  function updateProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY || window.pageYOffset;
    var ratio = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
    if (progress) progress.style.width = (ratio * 100) + '%';
    if (progressDot) {
      progressDot.style.left = (ratio * window.innerWidth) + 'px';
      progressDot.style.top = '1px';
    }
  }

  /* ------------------------------------------------------------------ *
   * Sticky header — appears once past the hero
   * ------------------------------------------------------------------ */
  var hdr = document.querySelector('.hdr');
  function updateHeader() {
    if (!hdr) return;
    var y = window.scrollY || window.pageYOffset;
    hdr.classList.toggle('is-stuck', y > 520);
  }

  /* ------------------------------------------------------------------ *
   * Reveal on scroll
   * ------------------------------------------------------------------ */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  // Stagger siblings inside a group.
  revealables.forEach(function (el) {
    var group = el.closest('[data-reveal-group]');
    if (!group) return;
    var sibs = Array.prototype.slice.call(group.querySelectorAll('[data-reveal]'));
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', (i * 0.09) + 's');
  });

  if (reduced) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('.line-inner').forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('.hero-copy > *').forEach(function (el) { el.classList.add('is-in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // Reveal when entering the viewport, and also when the element is
        // already ABOVE it. A fast flick or an anchor jump skips straight
        // past sections, and an observer that only watches isIntersecting
        // leaves them at opacity 0 permanently.
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });

    // Sweep net: catches anything the observer missed on a fast scroll.
    window.__revealSweep = function () {
      revealables.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    };
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------------ *
   * Hero intro — line masks + copy stagger
   * Runs after the loader clears so the reveal is actually seen.
   * ------------------------------------------------------------------ */
  function heroIntro() {
    if (reduced) return;
    var lines = document.querySelectorAll('.line-inner');
    var copy = document.querySelectorAll('.hero-copy > *');
    lines.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-in'); }, 120 + i * 150);
    });
    copy.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-in'); }, 200 + i * 110);
    });
  }

  if (reduced) {
    heroIntro();
  } else {
    // Wait for the loader to clear (or the 2.6s ceiling, whichever first).
    var introTimer = setInterval(function () {
      if (done) { clearInterval(introTimer); heroIntro(); }
    }, 100);
    setTimeout(function () { clearInterval(introTimer); heroIntro(); }, 3200);
  }

  /* ------------------------------------------------------------------ *
   * Marquee — CSS-free continuous translate, respects reduced motion
   * ------------------------------------------------------------------ */
  var mtrack = document.querySelector('.marquee-track');
  if (mtrack && !reduced) {
    var x = 0;
    var half = 0;
    function measure() { half = mtrack.scrollWidth / 2; }
    measure();
    window.addEventListener('resize', measure);
    (function loop() {
      var speed = 0.5;
      x -= speed;
      if (half && x <= -half) x += half;
      mtrack.style.transform = 'translate3d(' + x + 'px,0,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------------ *
   * Dot system — "Noktah bukan noktah"
   * Level B: hero dot field + travelling section dividers. No cursor
   * follower, no canvas. Transform/opacity only, so it stays composited.
   * ------------------------------------------------------------------ */

  /* Hero dot field: a slow drift of dots behind the copy. */
  var dotHost = document.getElementById('heroDots');
  if (dotHost && !reduced) {
    var DOTS = 34;
    var w = dotHost.clientWidth || window.innerWidth;
    var h = dotHost.clientHeight || 480;
    var field = [];
    for (var i = 0; i < DOTS; i++) {
      var d = document.createElement('span');
      d.className = 'hero-dot' + (i % 3 === 0 ? ' hero-dot--soft' : '');
      var size = 2 + Math.random() * 3;
      var y = Math.random() * h;
      var speed = 0.10 + Math.random() * 0.28;
      var alpha = 0.18 + Math.random() * 0.42;
      d.style.width = size + 'px';
      d.style.height = size + 'px';
      d.style.top = y + 'px';
      d.style.left = '0';
      d.style.opacity = String(alpha);
      dotHost.appendChild(d);
      field.push({ el: d, x: Math.random() * w, y: y, v: speed, a: alpha, ph: Math.random() * 6.28 });
    }

    // Only animate while the hero is on screen.
    var heroVisible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        heroVisible = es[0].isIntersecting;
      }, { threshold: 0 }).observe(dotHost);
    }

    var last = performance.now();
    (function dotLoop(now) {
      requestAnimationFrame(dotLoop);
      if (!heroVisible || document.hidden) { last = now; return; }
      var dt = Math.min((now - last) / 16.67, 3);
      last = now;
      var cw = dotHost.clientWidth || w;
      for (var k = 0; k < field.length; k++) {
        var f = field[k];
        f.x += f.v * dt;
        if (f.x > cw + 8) { f.x = -8; f.y = Math.random() * h; }
        // gentle vertical bob so the field is not a straight conveyor
        f.ph += 0.012 * dt;
        var oy = Math.sin(f.ph) * 6;
        f.el.style.transform = 'translate3d(' + f.x.toFixed(1) + 'px,' + oy.toFixed(1) + 'px,0)';
      }
    })(performance.now());
  }

  /* Section dividers: one dot travels along each rule on scroll. */
  var rules = document.querySelectorAll('.dot-rule');
  if (rules.length) {
    var ruleDots = [];
    rules.forEach(function (r) {
      var dot = r.querySelector('.dot-rule__dot');
      if (dot) ruleDots.push({ rule: r, dot: dot });
    });
    window.__updateRuleDots = function () {
      var vh = window.innerHeight;
      for (var i = 0; i < ruleDots.length; i++) {
        var it = ruleDots[i];
        var rect = it.rule.getBoundingClientRect();
        // 0 when the rule enters from the bottom, 1 when it leaves the top.
        var t = (vh - rect.top) / (vh + rect.height);
        t = t < 0 ? 0 : (t > 1 ? 1 : t);
        it.dot.style.left = (t * 100).toFixed(2) + '%';
      }
    };
  }

  /* ------------------------------------------------------------------ *
   * Metric counters — count up once when scrolled into view.
   * Values are read from data-* so the copy stays the single source of truth.
   * ------------------------------------------------------------------ */
  var metrics = document.querySelectorAll('[data-count-to]');
  function runCounter(el) {
    var to = parseFloat(el.getAttribute('data-count-to'));
    var dec = parseInt(el.getAttribute('data-count-dec') || '0', 10);
    var pre = el.getAttribute('data-count-pre') || '';
    var suf = el.getAttribute('data-count-suf') || '';
    if (isNaN(to)) return;
    function fmt(v) {
      return pre + v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suf;
    }
    // Reduced motion, or a zero target: show the final value immediately.
    // Never leave a visitor staring at 0.
    if (reduced || to === 0) {
      el.textContent = fmt(to);
      return;
    }
    var t0 = null;
    var DUR = 1400;
    el.textContent = fmt(0); // animate up from zero
    function step(ts) {
      if (t0 === null) t0 = ts;
      var t = Math.min((ts - t0) / DUR, 1);
      // easeOutCubic
      var e = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(to * e);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = fmt(to); // guarantee the exact final value
    }
    requestAnimationFrame(step);
  }
  if (metrics.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      metrics.forEach(runCounter);
    } else {
      var mio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          runCounter(e.target);
          mio.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      metrics.forEach(function (m) { mio.observe(m); });
    }
  }

  /* ------------------------------------------------------------------ *
   * Anchor links route through Lenis
   * A raw scrollIntoView bypasses Lenis and desyncs ScrollTrigger.
   * ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.1 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      // The jump can skip sections; sweep so nothing stays hidden.
      setTimeout(function () { if (window.__revealSweep) window.__revealSweep(); }, 1200);
    });
  });

  /* ------------------------------------------------------------------ *
   * Scroll-driven hero parallax (skipped in headless: hover:none is true
   * there, and skipped for reduced motion).
   * ------------------------------------------------------------------ */
  if (hasGSAP && window.ScrollTrigger && !reduced && !isTouch) {
    var heroImg = document.querySelector('.hero-img');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    var blooms = document.querySelectorAll('.hero-bloom');
    blooms.forEach(function (b, i) {
      gsap.to(b, {
        yPercent: (i + 1) * -14,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Cookie notice
   * Revealed only once the visitor scrolls past the hero, so a fixed
   * bottom banner never covers the hero trust row on short viewports.
   * ------------------------------------------------------------------ */
  var cookieNote = document.getElementById('cookieNote');
  function updateCookieNote() {
    if (!cookieNote || cookieNote.style.display === 'none') return;
    var y = window.scrollY || window.pageYOffset;
    cookieNote.classList.toggle('is-shown', y > 420);
  }
  if (cookieNote) {
    var cookieBtn = cookieNote.querySelector('button');
    if (cookieBtn) {
      cookieBtn.addEventListener('click', function () {
        cookieNote.classList.remove('is-shown');
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * Scroll listeners
   * ------------------------------------------------------------------ */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateProgress();
      updateHeader();
      updateCookieNote();
      if (window.__revealSweep) window.__revealSweep();
      if (window.__updateRuleDots) window.__updateRuleDots();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateProgress();
  updateHeader();
  updateCookieNote();
  if (window.__updateRuleDots) window.__updateRuleDots();

  // Late font load changes document height — recompute triggers.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (hasGSAP && window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  }

  window.addEventListener('load', function () {
    if (hasGSAP && window.ScrollTrigger) window.ScrollTrigger.refresh();
  });
})();

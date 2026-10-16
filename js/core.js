/* HOMELUXE core — header/footer, favorites, cards, modal, API client */
(function () {
  'use strict';
  var icon = window.hlIcon;

  /* ---------- storage ---------- */
  function lsRead(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
  }
  function lsWrite(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }

  var FAV_KEY = 'homeluxe:favorites';
  var Favorites = {
    list: function () { return lsRead(FAV_KEY, []); },
    has: function (slug) { return Favorites.list().indexOf(slug) !== -1; },
    toggle: function (slug) {
      var list = Favorites.list();
      var i = list.indexOf(slug);
      if (i === -1) { list.push(slug); lsWrite(FAV_KEY, list); return true; }
      list.splice(i, 1); lsWrite(FAV_KEY, list); return false;
    }
  };

  /* ---------- API ---------- */
  function apiPost(path, payload) {
    return fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error(data.error || 'Request failed (' + res.status + ')');
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  /* ---------- helpers ---------- */
  function fmtPrice(p, transaction) {
    var n = '$' + Number(p).toLocaleString('en-US');
    return transaction === 'rent' ? n + '<small>/month</small>' : n;
  }
  function fmtMoney(p) { return '$' + Number(p).toLocaleString('en-US'); }
  function propBySlug(slug) {
    return (window.HL_PROPERTIES || []).filter(function (p) { return p.slug === slug; })[0] || null;
  }
  function agentById(id) {
    return (window.HL_AGENTS || []).filter(function (a) { return a.id === id; })[0] || null;
  }
  function postBySlug(slug) {
    return (window.HL_POSTS || []).filter(function (p) { return p.slug === slug; })[0] || null;
  }
  function fmtDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  function locationStr(p) { return p.city + ', ' + p.state + ' ' + p.zip; }

  /* ---------- property card ---------- */
  function cardHTML(p) {
    var fav = Favorites.has(p.slug);
    return '' +
      '<article class="prop-card">' +
        '<a class="prop-media" href="property.html?slug=' + p.slug + '" aria-label="' + p.title + ', ' + fmtMoney(p.price) + '">' +
          '<img src="' + p.images[0] + '" alt="' + p.title + ' — ' + locationStr(p) + '" loading="lazy" width="600" height="450">' +
          '<span class="badges"><span class="badge ' + (p.transaction === 'rent' ? 'rent' : 'sale') + '">' +
            (p.transaction === 'rent' ? 'For Rent' : 'For Sale') + '</span>' +
          '</span>' +
        '</a>' +
        '<button class="fav-btn' + (fav ? ' active' : '') + '" data-fav="' + p.slug + '" ' +
          'aria-pressed="' + fav + '" aria-label="' + (fav ? 'Remove ' : 'Save ') + p.title + ' ' + (fav ? 'from' : 'to') + ' favorites">' +
          icon('heart', 18) + '</button>' +
        '<div class="prop-body">' +
          '<div class="prop-price">' + fmtPrice(p.price, p.transaction) + '</div>' +
          '<a class="prop-card-link prop-title" href="property.html?slug=' + p.slug + '">' + p.title + '</a>' +
          '<div class="prop-loc">' + icon('pin', 15) + '<span>' + locationStr(p) + '</span></div>' +
          '<div class="prop-meta">' +
            '<span>' + icon('bed', 15) + p.beds + ' Beds</span>' +
            '<span>' + icon('bath', 15) + p.baths + ' Baths</span>' +
            '<span>' + icon('area', 15) + p.sqft.toLocaleString('en-US') + ' Sq Ft</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* Favorite buttons: delegated — hearts must not trigger card navigation */
  function bindFavoriteScope(root) {
    (root || document).addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-fav]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var active = Favorites.toggle(btn.getAttribute('data-fav'));
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
      var prop = propBySlug(btn.getAttribute('data-fav'));
      var title = prop ? prop.title : btn.getAttribute('data-fav');
      btn.setAttribute('aria-label', (active ? 'Remove ' : 'Save ') + title + (active ? ' from' : ' to') + ' favorites');
      document.dispatchEvent(new CustomEvent('hl:favorites', { detail: { slug: btn.getAttribute('data-fav'), active: active } }));
    });
  }

  /* ---------- header ---------- */
  var NAV = [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'buy', label: 'Buy', href: 'listings.html?mode=buy' },
    { id: 'sell', label: 'Sell', href: 'sell.html' },
    { id: 'rent', label: 'Rent', href: 'listings.html?mode=rent' },
    { id: 'listings', label: 'Listings', dropdown: true },
    { id: 'about', label: 'About Us', href: 'about.html' },
    { id: 'blog', label: 'Blog', href: 'blog.html' },
    { id: 'contact', label: 'Contact', href: 'contact.html' }
  ];
  var DROPDOWN = [
    { label: 'All Properties', href: 'listings.html' },
    { label: 'For Sale', href: 'listings.html?mode=buy' },
    { label: 'For Rent', href: 'listings.html?mode=rent' },
    { label: 'Featured Homes', href: 'listings.html?sort=featured' }
  ];

  function headerHTML(activePage) {
    var links = NAV.map(function (n) {
      if (n.dropdown) {
        return '<li data-dropdown>' +
          '<button class="nav-link" aria-haspopup="true" aria-expanded="false">' + n.label + ' ' + icon('chevron', 15) + '</button>' +
          '<div class="dropdown" role="menu">' +
            DROPDOWN.map(function (d) {
              return '<a role="menuitem" href="' + d.href + '">' + d.label + ' ' + icon('arrow', 14) + '</a>';
            }).join('') +
          '</div></li>';
      }
      return '<li><a class="nav-link' + (activePage === n.id ? ' active' : '') + '"' +
        (activePage === n.id ? ' aria-current="page"' : '') + ' href="' + n.href + '">' + n.label + '</a></li>';
    }).join('');

    var mobileLinks = NAV.map(function (n) {
      if (n.dropdown) return DROPDOWN.map(function (d) {
        return '<a href="' + d.href + '">' + d.label + '</a>';
      }).join('');
      return '<a class="' + (activePage === n.id ? 'active' : '') + '" href="' + n.href + '">' + n.label + '</a>';
    }).join('');

    return '' +
      '<div class="topbar"><div class="container topbar-inner">' +
        '<div class="topbar-group topbar-left">' +
          '<span class="topbar-item">' + icon('users', 14) + 'Trusted by 10,000+ Clients<sup>&dagger;</sup></span>' +
          '<span class="topbar-item">' + icon('star', 14) + '5 Star Rated Agency<sup>&dagger;</sup></span>' +
          '<span class="topbar-item">' + icon('tag', 14) + 'Free Property Valuation</span>' +
        '</div>' +
        '<div class="topbar-right">' +
          '<a class="topbar-item" href="tel:+18001234567">' + icon('phone', 14) + '(800) 123-4567<sup>&dagger;</sup></a>' +
          '<div class="social-links">' +
            '<a href="https://facebook.com" target="_blank" rel="noopener" aria-label="HOMELUXE on Facebook">' + icon('facebook', 15) + '</a>' +
            '<a href="https://instagram.com" target="_blank" rel="noopener" aria-label="HOMELUXE on Instagram">' + icon('instagram', 15) + '</a>' +
            '<a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="HOMELUXE on LinkedIn">' + icon('linkedin', 15) + '</a>' +
          '</div>' +
        '</div>' +
      '</div></div>' +
      '<nav class="navbar" aria-label="Main navigation"><div class="container navbar-inner">' +
        '<a class="brand" href="index.html" aria-label="HOMELUXE Real Estate — home">' +
          '<span class="brand-mark">' + icon('house', 22) + '</span>' +
          '<span><span class="brand-name">HOMELUXE</span><span class="brand-sub">Real Estate</span></span>' +
        '</a>' +
        '<ul class="nav-links">' + links +
          '<li class="nav-cta"><a class="btn btn-primary btn-sm" href="sell.html">' + icon('house', 17) + ' List Your Property</a></li>' +
        '</ul>' +
        '<button class="menu-btn" aria-expanded="false" aria-controls="mobileMenu" aria-label="Open menu">' + icon('menu', 22) + '</button>' +
      '</div>' +
      '<div class="mobile-menu" id="mobileMenu">' + mobileLinks +
        '<a class="btn btn-primary" href="sell.html">List Your Property</a>' +
      '</div></nav>';
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return '' +
      '<footer class="site-footer"><div class="container">' +
        '<div class="footer-main">' +
          '<div class="footer-brand">' +
            '<a class="brand" href="index.html">' +
              '<span class="brand-mark">' + icon('house', 22) + '</span>' +
              '<span><span class="brand-name">HOMELUXE</span><span class="brand-sub">Real Estate</span></span>' +
            '</a>' +
            '<p>Premium properties, expert guidance and a simpler path to the keys. Demo website showcasing the HOMELUXE experience.</p>' +
            '<div class="social-links">' +
              '<a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">' + icon('facebook', 16) + '</a>' +
              '<a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">' + icon('instagram', 16) + '</a>' +
              '<a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">' + icon('linkedin', 16) + '</a>' +
            '</div>' +
            '<p class="demo-note" style="margin-top:16px">' + icon('info', 14) + 'Demo site — listings and stats are illustrative</p>' +
          '</div>' +
          '<nav class="footer-col" aria-label="Quick links"><h3>Quick Links</h3>' +
            '<a href="index.html">Home</a>' +
            '<a href="listings.html?mode=buy">Buy</a>' +
            '<a href="listings.html?mode=rent">Rent</a>' +
            '<a href="sell.html">Sell</a>' +
            '<a href="listings.html">Listings</a>' +
          '</nav>' +
          '<nav class="footer-col" aria-label="Company"><h3>Company</h3>' +
            '<a href="about.html">About Us</a>' +
            '<a href="agents.html">Our Agents</a>' +
            '<a href="contact.html">Careers</a>' +
            '<a href="blog.html">Blog</a>' +
            '<a href="contact.html">Contact Us</a>' +
          '</nav>' +
          '<nav class="footer-col" aria-label="Resources"><h3>Resources</h3>' +
            '<a href="sell.html#valuation">Home Valuation</a>' +
            '<a href="faq.html">Buyers Guide</a>' +
            '<a href="sell.html">Sellers Guide</a>' +
            '<a href="faq.html">FAQ</a>' +
            '<a href="mortgage-calculator.html">Mortgage Calculator</a>' +
          '</nav>' +
          '<div class="footer-col"><h3>Contact Us</h3><ul class="footer-contact">' +
            '<li>' + icon('phone', 16) + '<span>(800) 123-4567 <em class="demo-note">(demo)</em></span></li>' +
            '<li>' + icon('mail', 16) + '<span>hello@homeluxe.demo <em class="demo-note">(demo)</em></span></li>' +
            '<li>' + icon('pin', 16) + '<span>123 Market Street, Suite 400<br>San Francisco, CA 94105 <em class="demo-note">(demo)</em></span></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom"><div class="footer-bottom-inner">' +
          '<span>&copy; ' + year + ' Homeluxe Real Estate (demo). All rights reserved.</span>' +
          '<span><a href="privacy.html">Privacy Policy</a> &nbsp;&middot;&nbsp; <a href="terms.html">Terms of Service</a></span>' +
        '</div></div>' +
      '</div></footer>';
  }

  function initChrome(activePage) {
    var mount = document.getElementById('site-header');
    if (mount) {
      mount.innerHTML = headerHTML(activePage);
      var menuBtn = mount.querySelector('.menu-btn');
      var mobileMenu = mount.querySelector('.mobile-menu');
      menuBtn.addEventListener('click', function () {
        var open = mobileMenu.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.innerHTML = open ? icon('x', 22) : icon('menu', 22);
      });
      mount.querySelectorAll('[data-dropdown]').forEach(function (li) {
        var btn = li.querySelector('.nav-link');
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          var open = li.classList.toggle('open');
          btn.setAttribute('aria-expanded', String(open));
        });
        li.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && li.classList.contains('open')) { li.classList.remove('open'); btn.focus(); }
        });
      });
      document.addEventListener('click', function (e) {
        mount.querySelectorAll('[data-dropdown].open').forEach(function (li) {
          if (!li.contains(e.target)) { li.classList.remove('open'); li.querySelector('.nav-link').setAttribute('aria-expanded', 'false'); }
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          mount.querySelectorAll('[data-dropdown].open').forEach(function (li) {
            li.classList.remove('open'); li.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
          });
        }
      });
    }
    var foot = document.getElementById('site-footer');
    if (foot) foot.innerHTML = footerHTML();
    bindFavoriteScope(document);
  }

  /* ---------- modal ---------- */
  function ensureModalRoot() {
    var root = document.getElementById('hl-modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'hl-modal-root';
      root.className = 'modal-overlay';
      root.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="hl-modal-title">' +
        '<div class="modal-head"><div><h2 id="hl-modal-title"></h2><p id="hl-modal-sub"></p></div>' +
        '<button class="modal-close" aria-label="Close dialog">' + icon('x', 20) + '</button></div>' +
        '<div class="modal-body" id="hl-modal-body"></div></div>';
      document.body.appendChild(root);
      root.querySelector('.modal-close').addEventListener('click', closeModal);
      root.addEventListener('click', function (e) { if (e.target === root) closeModal(); });
    }
    return root;
  }
  var lastFocus = null;
  function openModal(opts) {
    var root = ensureModalRoot();
    lastFocus = document.activeElement;
    root.querySelector('#hl-modal-title').textContent = opts.title || '';
    root.querySelector('#hl-modal-sub').textContent = opts.subtitle || '';
    root.querySelector('#hl-modal-body').innerHTML = opts.body || '';
    root.classList.add('open');
    document.body.style.overflow = 'hidden';
    root.querySelector('.modal-close').focus();
    if (typeof opts.onOpen === 'function') opts.onOpen(root);
  }
  function closeModal() {
    var root = document.getElementById('hl-modal-root');
    if (root) {
      root.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      var lb = document.getElementById('hl-lightbox');
      if (lb) lb.classList.remove('open');
    }
  });

  /* ---------- forms ---------- */
  function setFieldError(field, msg) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    if (msg) {
      wrap.classList.add('invalid');
      var err = wrap.querySelector('.field-error');
      if (!err) { err = document.createElement('div'); err.className = 'field-error'; wrap.appendChild(err); }
      err.textContent = msg;
    } else {
      wrap.classList.remove('invalid');
    }
  }
  function validateForm(form, rules) {
    var ok = true;
    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      var msg = rules[name](input.value.trim(), input);
      setFieldError(input, msg);
      if (msg) ok = false;
    });
    return ok;
  }
  function handleFormSubmit(form, opts) {
    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('[type="submit"]');
    function show(type, html) {
      status.className = 'form-status show ' + type;
      status.innerHTML = icon(type === 'ok' ? 'checkCircle' : 'info', 18) + '<div>' + html + '</div>';
      status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form, opts.rules)) {
        if (status) { status.className = 'form-status'; }
        return;
      }
      submitBtn.disabled = true;
      submitBtn.dataset.label = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending&hellip;';
      var payload = {};
      Object.keys(opts.rules).forEach(function (k) {
        if (form.elements[k]) payload[k] = form.elements[k].value.trim();
      });
      if (opts.extra) Object.assign(payload, opts.extra());
      apiPost(opts.endpoint, payload).then(function (data) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.dataset.label;
        form.reset();
        show('ok', opts.successMessage || 'Thank you — your request has been received.');
        if (typeof opts.onSuccess === 'function') opts.onSuccess(data);
      }).catch(function (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.dataset.label;
        if (err.status === 409) { show('ok', opts.duplicateMessage || 'You are already on our list — thank you!'); return; }
        show('err', (err.status >= 400 && err.status < 500 ? '' : 'Something went wrong on our side. ') +
          (err.message || 'Please try again in a moment.'));
      });
    });
  }

  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  var isPhone = function (v) { return /^[+()\d][\d\s().-]{6,19}$/.test(v); };
  var req = function (label) { return function (v) { return v ? '' : label + ' is required.'; }; };

  window.HL = {
    icon: icon,
    Favorites: Favorites,
    apiPost: apiPost,
    fmtPrice: fmtPrice,
    fmtMoney: fmtMoney,
    fmtDate: fmtDate,
    propBySlug: propBySlug,
    agentById: agentById,
    postBySlug: postBySlug,
    locationStr: locationStr,
    cardHTML: cardHTML,
    initChrome: initChrome,
    openModal: openModal,
    closeModal: closeModal,
    handleFormSubmit: handleFormSubmit,
    validate: {
      email: isEmail,
      phone: isPhone,
      required: req
    }
  };
})();

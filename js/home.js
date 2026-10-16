/* HOMELUXE homepage script */
(function () {
  'use strict';
  var HL = window.HL, icon = window.hlIcon, Forms = window.HLForms;

  HL.initChrome('home');

  /* ---- static icon slots ---- */
  var slots = { tb1: 'house', tb2: 'users', tb3: 'shield', tb4: 'tag',
                w1: 'pin', w2: 'user', w3: 'award', w4: 'checkCircle',
                valCardIcon: 'house', newsIcon: 'mail' };
  Object.keys(slots).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = icon(slots[id], 24);
  });

  /* ---- hero image ---- */
  document.querySelector('.hero').style.setProperty('--hero-img', 'url("' + window.HL_IMAGES.hero + '")');
  var valRight = document.querySelector('.val-right');
  if (valRight) valRight.style.backgroundImage = 'url("' + window.HL_IMAGES.int1 + '")';

  /* ---- featured properties (4 given demo records) ---- */
  var grid = document.getElementById('featuredGrid');
  if (grid) {
    grid.innerHTML = window.HL_PROPERTIES.filter(function (p) { return p.featured; }).slice(0, 4)
      .map(HL.cardHTML).join('');
  }

  /* ---- How It Works modal ---- */
  var howBtn = document.getElementById('howItWorksBtn');
  if (howBtn) {
    howBtn.addEventListener('click', function () {
      HL.openModal({
        title: 'How It Works',
        subtitle: 'Three simple steps from browsing to keys in hand.',
        body: '<div class="steps-list">' +
          '<div class="step"><span class="step-num">1</span><div><b>Search &amp; Save</b><p>Filter verified listings by location, price and size, and save your favorites to shortlist them.</p></div></div>' +
          '<div class="step"><span class="step-num">2</span><div><b>Tour with an Agent</b><p>Book viewings with a local expert who knows the neighborhood and can answer every question.</p></div></div>' +
          '<div class="step"><span class="step-num">3</span><div><b>Offer &amp; Close</b><p>We negotiate, coordinate inspection and closing, and hand you the keys — with support at every step.</p></div></div>' +
          '</div>' +
          '<div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap">' +
          '<a class="btn btn-primary" href="listings.html">Browse Properties ' + icon('arrow', 17) + '</a>' +
          '<a class="btn btn-outline" href="agents.html">Meet Our Agents</a></div>'
      });
    });
  }

  /* ---- hero search panel ---- */
  var form = document.getElementById('heroSearch');
  if (!form) return;

  var mode = 'buy';
  var SALE_STEPS = [0, 100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2500000];
  var RENT_STEPS = [0, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 10000];

  function fillPriceSelect(sel, steps, label) {
    sel.innerHTML = steps.map(function (v) {
      return '<option value="' + v + '">' + (v === 0 ? label : (mode === 'rent' ? '$' + v.toLocaleString() + '+' : '$' + (v / 1000) + 'k+')) + '</option>';
    }).join('');
  }

  function applyMode(next) {
    mode = next;
    document.querySelectorAll('.search-tab').forEach(function (t) {
      t.setAttribute('aria-selected', String(t.dataset.mode === mode));
    });
    var sell = mode === 'sell';
    document.getElementById('searchFields').style.display = sell ? 'none' : '';
    var btn = document.getElementById('searchSubmitBtn');
    btn.innerHTML = sell
      ? icon('tag', 18) + ' Get Free Valuation'
      : icon('search', 18) + ' Search Properties';
    fillPriceSelect(document.getElementById('sp-min'), sell ? SALE_STEPS : (mode === 'rent' ? RENT_STEPS : SALE_STEPS), 'Min price');
    fillPriceSelect(document.getElementById('sp-max'), sell ? SALE_STEPS : (mode === 'rent' ? RENT_STEPS : SALE_STEPS), 'Max price');
  }

  document.querySelectorAll('.search-tab').forEach(function (tab) {
    tab.addEventListener('click', function () { applyMode(tab.dataset.mode); });
  });
  applyMode('buy');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (mode === 'sell') { window.location.href = 'sell.html#valuation'; return; }
    var min = Number(document.getElementById('sp-min').value);
    var max = Number(document.getElementById('sp-max').value);
    var err = document.getElementById('sp-error');
    if (max > 0 && min > max) { err.classList.add('show'); return; }
    err.classList.remove('show');
    var params = new URLSearchParams();
    params.set('mode', mode);
    var loc = document.getElementById('sp-location').value.trim();
    if (loc) params.set('location', loc);
    var type = document.getElementById('sp-type').value;
    if (type) params.set('type', type);
    if (min > 0) params.set('min', min);
    if (max > 0) params.set('max', max);
    var beds = document.getElementById('sp-beds').value;
    if (beds) params.set('beds', beds);
    var baths = document.getElementById('sp-baths').value;
    if (baths) params.set('baths', baths);
    window.location.href = 'listings.html?' + params.toString();
  });

  /* ---- valuation modal ---- */
  var valCta = document.getElementById('valuationCta');
  if (valCta) {
    valCta.addEventListener('click', function () {
      HL.openModal({
        title: 'Free Home Valuation',
        subtitle: 'Tell us about your property and we\u2019ll schedule a no-obligation estimate (demo).',
        body: Forms.valuationFormHTML('valuationModalForm'),
        onOpen: function () { Forms.initValuationForm('valuationModalForm', HL.closeModal); }
      });
    });
  }

  /* ---- newsletter ---- */
  var newsForm = document.getElementById('newsletterForm');
  if (newsForm) Forms.initNewsletter(newsForm);
})();

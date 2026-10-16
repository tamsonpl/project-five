/* HOMELUXE listings page */
(function () {
  'use strict';
  var HL = window.HL, icon = window.hlIcon;

  HL.initChrome('listings');
  document.getElementById('emptyIcon').innerHTML = icon('search', 26);

  var ALL = window.HL_PROPERTIES.slice();
  var PAGE_SIZE = 6;
  var shown = PAGE_SIZE;

  var els = {
    location: document.getElementById('f-location'),
    type: document.getElementById('f-type'),
    min: document.getElementById('f-min'),
    max: document.getElementById('f-max'),
    beds: document.getElementById('f-beds'),
    baths: document.getElementById('f-baths'),
    sort: document.getElementById('f-sort'),
    grid: document.getElementById('listingsGrid'),
    count: document.getElementById('resultCount'),
    chips: document.getElementById('chips'),
    empty: document.getElementById('emptyState'),
    loadWrap: document.getElementById('loadMoreWrap'),
    loadBtn: document.getElementById('loadMore'),
    error: document.getElementById('f-error'),
    heading: document.getElementById('pageHeading')
  };

  var PRICE_STEPS_SALE = [100000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2500000];
  var PRICE_STEPS_RENT = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 10000];

  /* ---------- URL state ---------- */
  function readParams() {
    var q = new URLSearchParams(window.location.search);
    var p = {
      mode: q.get('mode') === 'rent' ? 'rent' : (q.get('mode') === 'buy' ? 'buy' : 'all'),
      location: q.get('location') || '',
      type: q.get('type') || '',
      min: q.get('min') ? Number(q.get('min')) : '',
      max: q.get('max') ? Number(q.get('max')) : '',
      beds: q.get('beds') || '',
      baths: q.get('baths') || '',
      sort: q.get('sort') || 'newest',
      featured: q.get('sort') === 'featured'
    };
    return p;
  }
  var state = readParams();

  function writeParams() {
    var q = new URLSearchParams();
    if (state.mode !== 'all') q.set('mode', state.mode);
    if (state.location) q.set('location', state.location);
    if (state.type) q.set('type', state.type);
    if (state.min) q.set('min', state.min);
    if (state.max) q.set('max', state.max);
    if (state.beds) q.set('beds', state.beds);
    if (state.baths) q.set('baths', state.baths);
    if (state.sort !== 'newest') q.set('sort', state.sort);
    var url = 'listings.html' + (q.toString() ? '?' + q.toString() : '');
    window.history.replaceState(null, '', url);
  }

  function priceOptions(select, steps, anyLabel, mode) {
    var opts = '<option value="">' + anyLabel + '</option>';
    opts += steps.map(function (v) {
      return '<option value="' + v + '">' + (mode === 'rent' ? '$' + v.toLocaleString() + '+' : '$' + (v / 1000) + 'k+') + '</option>';
    }).join('');
    select.innerHTML = opts;
  }

  function priceStepsFor(mode) { return mode === 'rent' ? PRICE_STEPS_RENT : PRICE_STEPS_SALE; }

  function buildPriceSelects() {
    var all = [].concat(PRICE_STEPS_SALE, PRICE_STEPS_RENT).sort(function (a, b) { return a - b; });
    priceOptions(els.min, all, 'Any', state.mode === 'rent' ? 'rent' : 'sale');
    priceOptions(els.max, all, 'Any', state.mode === 'rent' ? 'rent' : 'sale');
  }

  function syncControls() {
    els.location.value = state.location;
    els.type.value = state.type;
    els.beds.value = state.beds;
    els.baths.value = state.baths;
    els.sort.value = state.sort;
    els.min.value = state.min;
    els.max.value = state.max;
  }

  /* ---------- filtering ---------- */
  function filtered() {
    var term = state.location.toLowerCase();
    var list = ALL.filter(function (p) {
      if (state.mode === 'buy' && p.transaction !== 'sale') return false;
      if (state.mode === 'rent' && p.transaction !== 'rent') return false;
      if (term) {
        var hay = (p.title + ' ' + p.address + ' ' + p.city + ' ' + p.state + ' ' + p.zip).toLowerCase();
        if (hay.indexOf(term) === -1) return false;
      }
      if (state.type && p.type !== state.type) return false;
      if (state.min && p.price < state.min) return false;
      if (state.max && p.price > state.max) return false;
      if (state.beds && p.beds < Number(state.beds)) return false;
      if (state.baths && p.baths < Number(state.baths)) return false;
      return true;
    });
    var sorters = {
      'newest': function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; },
      'price-asc': function (a, b) { return a.price - b.price; },
      'price-desc': function (a, b) { return b.price - a.price; },
      'featured': function (a, b) { return (b.featured - a.featured) || (a.createdAt < b.createdAt ? 1 : -1); }
    };
    return list.sort(sorters[state.sort] || sorters.newest);
  }

  var CHIP_LABELS = {
    buy: 'For Sale', rent: 'For Rent',
    type: 'Type', beds: 'Beds', baths: 'Baths', min: 'Min', max: 'Max', location: 'Search'
  };
  function chipHTML(key, label, value) {
    return '<span class="chip">' + label + ': ' + value +
      '<button type="button" data-clear="' + key + '" aria-label="Remove ' + label + ' filter">' + icon('x', 12) + '</button></span>';
  }
  function renderChips() {
    var out = '';
    if (state.mode === 'buy') out += chipHTML('mode', 'Status', 'For Sale');
    if (state.mode === 'rent') out += chipHTML('mode', 'Status', 'For Rent');
    if (state.location) out += chipHTML('location', CHIP_LABELS.location, '\u201c' + state.location + '\u201d');
    if (state.type) out += chipHTML('type', CHIP_LABELS.type, state.type);
    if (state.min) out += chipHTML('min', CHIP_LABELS.min, HL.fmtMoney(state.min));
    if (state.max) out += chipHTML('max', CHIP_LABELS.max, HL.fmtMoney(state.max));
    if (state.beds) out += chipHTML('beds', CHIP_LABELS.beds, state.beds + '+');
    if (state.baths) out += chipHTML('baths', CHIP_LABELS.baths, state.baths + '+');
    if (out) {
      out += '<button type="button" class="clear-all" id="clearAll">' + icon('x', 13) + ' Clear all</button>';
    }
    els.chips.innerHTML = out;
  }

  function render() {
    var list = filtered();
    var visible = list.slice(0, shown);
    els.grid.innerHTML = visible.map(HL.cardHTML).join('');
    els.count.innerHTML = '<b>' + list.length + '</b> propert' + (list.length === 1 ? 'y' : 'ies') + ' found';
    els.empty.style.display = list.length ? 'none' : '';
    els.grid.style.display = list.length ? '' : 'none';
    els.loadWrap.style.display = list.length > shown ? '' : 'none';
    renderChips();
    writeParams();

    var label = state.mode === 'buy' ? 'Homes for Sale' : state.mode === 'rent' ? 'Homes for Rent' : 'All Properties';
    if (state.sort === 'featured') label = 'Featured Homes';
    els.heading.textContent = label;
    document.title = label + ' | HOMELUXE Real Estate';
  }

  function update(patch) {
    if (patch) Object.assign(state, patch);
    if (Number(state.min) > 0 && Number(state.max) > 0 && Number(state.min) > Number(state.max)) {
      els.error.classList.add('show');
      return;
    }
    els.error.classList.remove('show');
    shown = PAGE_SIZE;
    render();
  }

  /* ---------- events ---------- */
  els.location.addEventListener('input', function () { update({ location: els.location.value.trim() }); });
  ['type', 'beds', 'baths'].forEach(function (k) {
    els[k].addEventListener('change', function () { update(); });
  });
  els.min.addEventListener('change', function () { state.min = els.min.value; update(); });
  els.max.addEventListener('change', function () { state.max = els.max.value; update(); });
  els.sort.addEventListener('change', function () { state.sort = els.sort.value; shown = PAGE_SIZE; render(); });
  els.loadBtn.addEventListener('click', function () { shown += PAGE_SIZE; render(); });
  document.getElementById('resetFilters').addEventListener('click', resetAll);
  els.chips.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-clear]');
    if (!btn) return;
    var key = btn.getAttribute('data-clear');
    if (key === 'mode') state.mode = 'all';
    else state[key] = key === 'beds' || key === 'baths' ? '' : '';
    if (key === 'min' || key === 'max') { els[key].value = ''; state[key] = ''; }
    else if (key === 'location') { els.location.value = ''; state.location = ''; }
    else if (key === 'type') { els.type.value = ''; state.type = ''; }
    else if (key === 'beds') { els.beds.value = ''; state.beds = ''; }
    else if (key === 'baths') { els.baths.value = ''; state.baths = ''; }
    if (key === 'mode') buildPriceSelects();
    update();
  });
  function resetAll() {
    state = { mode: 'all', location: '', type: '', min: '', max: '', beds: '', baths: '', sort: 'newest' };
    buildPriceSelects();
    syncControls();
    update();
  }

  buildPriceSelects();
  syncControls();
  render();
})();

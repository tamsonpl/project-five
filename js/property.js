/* HOMELUXE property detail page */
(function () {
  'use strict';
  var HL = window.HL, icon = window.hlIcon, Forms = window.HLForms;

  HL.initChrome('listings');

  var slug = new URLSearchParams(window.location.search).get('slug');
  var p = slug ? HL.propBySlug(slug) : null;

  document.getElementById('nfIcon').innerHTML = icon('house', 26);

  if (!p) {
    document.getElementById('notFound').style.display = '';
    document.getElementById('breadcrumbs').style.display = 'none';
    document.title = 'Property Not Found | HOMELUXE Real Estate';
    return;
  }

  /* ---------- head / breadcrumbs / title ---------- */
  document.title = p.title + ' — ' + HL.locationStr(p) + ' | HOMELUXE Real Estate';
  document.getElementById('bc-current').textContent = p.title;
  document.getElementById('detailRoot').style.display = '';

  var mainImg = document.getElementById('mainImg');
  mainImg.src = p.images[0];
  mainImg.alt = p.title + ' — photo 1 of ' + p.images.length;

  /* ---------- gallery thumbs ---------- */
  var thumbs = document.getElementById('galleryThumbs');
  thumbs.innerHTML = p.images.map(function (src, i) {
    return '<button type="button" role="listitem" data-idx="' + i + '" aria-label="Show photo ' + (i + 1) + '"' +
      (i === 0 ? ' aria-current="true"' : '') + '><img src="' + src + '" alt="" loading="lazy"></button>';
  }).join('');
  thumbs.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-idx]');
    if (!btn) return;
    showImage(Number(btn.getAttribute('data-idx')));
  });
  function showImage(idx) {
    mainImg.src = p.images[idx];
    mainImg.alt = p.title + ' — photo ' + (idx + 1) + ' of ' + p.images.length;
    thumbs.querySelectorAll('[data-idx]').forEach(function (b) {
      b.setAttribute('aria-current', String(Number(b.getAttribute('data-idx')) === idx));
    });
  }

  /* ---------- lightbox ---------- */
  var lb = document.createElement('div');
  lb.id = 'hl-lightbox';
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', 'Photo gallery');
  lb.innerHTML = '<button class="lightbox-close" aria-label="Close gallery">' + icon('x', 20) + '</button>' +
    '<button class="lightbox-nav lightbox-prev" aria-label="Previous photo">' + icon('arrowLeft', 22) + '</button>' +
    '<img id="lbImg" src="" alt="">' +
    '<button class="lightbox-nav lightbox-next" aria-label="Next photo">' + icon('arrow', 22) + '</button>' +
    '<div class="lightbox-count" id="lbCount"></div>';
  document.body.appendChild(lb);
  var lbIdx = 0;
  function openLightbox(idx) {
    lbIdx = idx;
    lb.querySelector('#lbImg').src = p.images[idx];
    lb.querySelector('#lbImg').alt = p.title + ' — photo ' + (idx + 1);
    lb.querySelector('#lbCount').textContent = (idx + 1) + ' / ' + p.images.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lightbox-close').focus();
  }
  function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function stepLightbox(d) { openLightbox((lbIdx + d + p.images.length) % p.images.length); }
  document.getElementById('galleryMain').addEventListener('click', function () { openLightbox(guessIdx()); });
  function guessIdx() {
    var i = p.images.indexOf(mainImg.getAttribute('src'));
    return i === -1 ? 0 : i;
  }
  lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lightbox-prev').addEventListener('click', function () { stepLightbox(-1); });
  lb.querySelector('.lightbox-next').addEventListener('click', function () { stepLightbox(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
  document.getElementById('galleryMain').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(guessIdx()); }
  });

  /* ---------- header info ---------- */
  document.getElementById('propTitle').textContent = p.title;
  document.getElementById('propLoc').textContent = p.address + ' · ' + HL.locationStr(p);
  document.getElementById('asidePrice').innerHTML = HL.fmtPrice(p.price, p.transaction) + (p.transaction === 'rent' ? '<small>/month</small>' : '');

  var saveBtn = document.getElementById('saveBtn');
  function paintSave() {
    var fav = HL.Favorites.has(p.slug);
    saveBtn.className = 'save-btn' + (fav ? ' active' : '');
    saveBtn.innerHTML = icon('heart', 18) + (fav ? ' Saved' : ' Save');
    saveBtn.setAttribute('aria-pressed', String(fav));
    saveBtn.setAttribute('aria-label', fav ? 'Remove from favorites' : 'Save to favorites');
  }
  saveBtn.addEventListener('click', function () { HL.Favorites.toggle(p.slug); paintSave(); });
  paintSave();

  /* ---------- spec strip ---------- */
  var specs = [
    { icon: 'bed', label: p.beds + ' Bedrooms' },
    { icon: 'bath', label: p.baths + ' Bathrooms' },
    { icon: 'area', label: p.sqft.toLocaleString('en-US') + ' Sq Ft' },
    { icon: 'house', label: p.type }
  ];
  document.getElementById('specStrip').innerHTML = specs.map(function (s) {
    return '<div class="spec-cell">' + icon(s.icon, 20) + '<b>' + s.label + '</b></div>';
  }).join('');

  /* ---------- description / features ---------- */
  document.getElementById('propDesc').innerHTML =
    '<p>' + p.description + '</p><p>Set in ' + p.city + ', this ' + p.type.toLowerCase() +
    ' combines considered design with everyday comfort — schedule a private tour to experience it in person.</p>';
  document.getElementById('featureList').innerHTML =
    p.features.concat(p.amenities).map(function (f) {
      return '<li>' + icon('check', 17) + '<span>' + f + '</span></li>';
    }).join('');

  /* ---------- spec table ---------- */
  var rows = [
    ['Status', p.transaction === 'rent' ? 'For Rent' : 'For Sale'],
    ['Property Type', p.type],
    ['Lot Size', p.lot],
    ['Year Built', String(p.year)],
    ['Square Footage', p.sqft.toLocaleString('en-US') + ' sq ft'],
    ['Bedrooms / Bathrooms', p.beds + ' / ' + p.baths],
    ['Address', p.address + ', ' + HL.locationStr(p)],
    ['Listed', HL.fmtDate(p.createdAt)]
  ];
  document.getElementById('specTable').innerHTML = rows.map(function (r) {
    return '<tr><th scope="row">' + r[0] + '</th><td>' + r[1] + '</td></tr>';
  }).join('');

  /* ---------- agent ---------- */
  var agent = HL.agentById(p.agent);
  if (agent) {
    document.getElementById('agentRow').innerHTML =
      '<div class="agent-row"><img src="' + agent.photo + '" alt="' + agent.name + '" loading="lazy">' +
      '<div><b>' + agent.name + '</b><span>' + agent.role + '</span>' +
      '<div class="agent-contact">' + icon('phone', 14) + '<span>' + agent.phone + ' <em class="demo-note">(demo)</em></span></div>' +
      '<div class="agent-contact">' + icon('mail', 14) + '<span>' + agent.email + '</span></div>' +
      '</div></div>';
  }

  Forms.initContactForm('agentForm', function () {
    return { subject: 'Property inquiry: ' + p.title, property: p.slug };
  }, { successMessage: 'Thank you! Your inquiry has been sent to the listing agent (demo) — expect a reply within one business day.' });

  /* ---------- related ---------- */
  var related = window.HL_PROPERTIES.filter(function (q) {
    return q.slug !== p.slug && (q.transaction === p.transaction || q.type === p.type);
  }).slice(0, 3);
  if (related.length < 3) {
    related = window.HL_PROPERTIES.filter(function (q) { return q.slug !== p.slug; }).slice(0, 3);
  }
  document.getElementById('relatedGrid').innerHTML = related.map(HL.cardHTML).join('');
})();

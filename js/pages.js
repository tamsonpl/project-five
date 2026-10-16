/* HOMELUXE secondary pages — dispatches per-page behavior by presence of key elements */
(function () {
  'use strict';
  var HL = window.HL, icon = window.hlIcon, Forms = window.HLForms;

  var pageName = document.body.dataset.page || 'home';
  HL.initChrome(pageName);

  /* Data-driven icon slots used across pages */
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    el.innerHTML = icon(el.getAttribute('data-icon'), el.classList.contains('icon-circle') ? 22 : 17);
    if (el.classList.contains('icon-circle')) el.innerHTML = icon(el.getAttribute('data-icon'), 22);
  });

  function agentCardHTML(a, compact) {
    return '<article class="agent-card">' +
      '<div class="agent-photo"><img src="' + a.photo + '" alt="' + a.name + ', ' + a.role + '" loading="lazy" width="300" height="300"></div>' +
      '<div class="agent-body">' +
        '<h3>' + a.name + '</h3><span class="role">' + a.role + '</span>' +
        (compact ? '' : '<p style="font-size:13.5px;color:var(--muted);margin-bottom:12px">' + a.bio + '</p>') +
        '<div class="agent-tags">' + a.specialties.map(function (s) { return '<span>' + s + '</span>'; }).join('') + '</div>' +
        '<a class="btn btn-outline btn-sm" href="contact.html" style="width:100%">Contact ' + a.name.split(' ')[0] + '</a>' +
      '</div></article>';
  }

  /* ---------- About: team grid ---------- */
  var teamGrid = document.getElementById('teamGrid');
  if (teamGrid) teamGrid.innerHTML = window.HL_AGENTS.map(function (a) { return agentCardHTML(a, false); }).join('');

  /* ---------- Agents page grid ---------- */
  var agentsGrid = document.getElementById('agentsGrid');
  if (agentsGrid) agentsGrid.innerHTML = window.HL_AGENTS.map(function (a) { return agentCardHTML(a, false); }).join('');

  /* ---------- Blog grid ---------- */
  var blogGrid = document.getElementById('blogGrid');
  if (blogGrid) {
    blogGrid.innerHTML = window.HL_POSTS.map(function (p) {
      return '<article class="post-card">' +
        '<a class="post-media" href="blog-post.html?slug=' + p.slug + '"><img src="' + p.cover + '" alt="' + p.title + '" loading="lazy" width="600" height="375"></a>' +
        '<div class="post-body">' +
          '<div class="post-meta-row"><span class="post-cat">' + p.category + '</span><span>' + icon('calendar', 13) + ' ' + HL.fmtDate(p.date) + '</span><span>' + icon('clock', 13) + ' ' + p.minutes + ' min read</span></div>' +
          '<h3><a href="blog-post.html?slug=' + p.slug + '">' + p.title + '</a></h3>' +
          '<p>' + p.excerpt + '</p>' +
          '<a class="post-read" href="blog-post.html?slug=' + p.slug + '">Read Article ' + icon('arrow', 15) + '</a>' +
        '</div></article>';
    }).join('');
  }

  /* ---------- Blog article ---------- */
  var articleRoot = document.getElementById('articleRoot');
  if (articleRoot) {
    var slug = new URLSearchParams(window.location.search).get('slug');
    var post = slug ? HL.postBySlug(slug) : null;
    document.getElementById('nfIcon').innerHTML = icon('house', 26);
    if (!post) {
      document.getElementById('notFound').style.display = '';
      document.title = 'Article Not Found | HOMELUXE Real Estate';
    } else {
      document.getElementById('bc-article').textContent = post.title;
      document.title = post.title + ' | HOMELUXE Real Estate';
      articleRoot.style.display = '';
      var shareUrl = encodeURIComponent(window.location.href);
      var shareTitle = encodeURIComponent(post.title);
      articleRoot.innerHTML =
        '<span class="post-cat">' + post.category + '</span>' +
        '<h1 style="font-size:34px;margin-top:12px">' + post.title + '</h1>' +
        '<div class="article-meta">' +
          '<span>' + icon('calendar', 15) + HL.fmtDate(post.date) + '</span>' +
          '<span>' + icon('clock', 15) + post.minutes + ' min read</span>' +
          '<span>' + icon('users', 15) + 'HOMELUXE Team</span>' +
        '</div>' +
        '<div class="article-cover"><img src="' + post.cover + '" alt="' + post.title + '"></div>' +
        post.content.map(function (t) { return '<p>' + t + '</p>'; }).join('') +
        '<p class="demo-note" style="margin-top:20px">' + icon('info', 14) + ' Demo article — sample editorial content, not verified market data or financial advice.</p>' +
        '<div class="share-row"><span>Share</span>' +
          '<a href="https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '" target="_blank" rel="noopener" aria-label="Share on Facebook">' + icon('facebook', 17) + '</a>' +
          '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + shareUrl + '" target="_blank" rel="noopener" aria-label="Share on LinkedIn">' + icon('linkedin', 17) + '</a>' +
        '</div>' +
        '<section style="margin-top:44px"><span class="eyebrow">Keep Reading</span><div class="blog-grid" style="margin-top:10px">' +
          window.HL_POSTS.filter(function (q) { return q.slug !== post.slug; }).slice(0, 2).map(function (q) {
            return '<article class="post-card"><a class="post-media" href="blog-post.html?slug=' + q.slug + '"><img src="' + q.cover + '" alt="' + q.title + '" loading="lazy"></a>' +
              '<div class="post-body"><div class="post-meta-row"><span class="post-cat">' + q.category + '</span></div>' +
              '<h3 style="font-size:16px"><a href="blog-post.html?slug=' + q.slug + '">' + q.title + '</a></h3></div></article>';
          }).join('') +
        '</div></section>';
    }
  }

  /* ---------- Sell: valuation form ---------- */
  var valuationMount = document.getElementById('valuationFormMount');
  if (valuationMount) {
    valuationMount.innerHTML = Forms.valuationFormHTML('sellValuationForm');
    Forms.initValuationForm('sellValuationForm');
  }

  /* ---------- Contact: form ---------- */
  var contactMount = document.getElementById('contactFormMount');
  if (contactMount) {
    contactMount.innerHTML = Forms.contactFormHTML('pageContactForm');
    Forms.initContactForm('pageContactForm');
  }

  /* ---------- FAQ accordion ---------- */
  var FAQS = [
    ['How do I book a viewing for a listing?', 'Use the &ldquo;Contact Agent&rdquo; form on any property page — mention the viewing times that suit you and the agent will confirm availability within one business day.'],
    ['Do I need to sign in to browse listings?', 'No. All published listings are open to browse without an account. You can also save favorites — these are stored in your own browser, no sign-in required.'],
    ['How is a free home valuation done?', 'An agent reviews your property details and local comparables, then presents a suggested price range with a marketing plan. In this demo, no real valuation is performed — submitting the form records a demo request.'],
    ['What price range can I search within?', 'The search filters accept a minimum and a maximum price for both sale and rental listings. If you set a minimum above the maximum, the form will ask you to correct it.'],
    ['Can I rent before I buy?', 'Absolutely. Our rental specialists can help you find a home while you search for a property to purchase, and buying decisions can take as long as you need.'],
    ['Are the listings on this site real?', 'No — this is a demo website. All properties, agents, prices and statistics are illustrative sample records clearly labeled as demo content.'],
    ['How do I list my property with HOMELUXE?', 'Start with a free valuation on the Sell page. Your agent will then handle photography, listing copy, publishing and buyer screening end-to-end.'],
    ['Do you charge buyers a fee?', 'Typically the seller pays agency commission; buyers are not charged a fee for representation. Exact terms are confirmed in writing before any engagement.'],
    ['What happens after I submit a contact form?', 'Your message is saved to our inbox and a team member replies within one business day. In this demo the message is stored by the demo backend, not a real agency.'],
    ['Is the mortgage calculator accurate?', 'It applies the standard amortization formula to the numbers you enter, so the math is correct — but real offers depend on your lender, credit profile, taxes and insurance. Treat results as estimates, not advice.']
  ];
  var acc = document.getElementById('faqAccordion');
  if (acc) {
    acc.innerHTML = FAQS.map(function (q, i) {
      return '<div class="acc-item">' +
        '<button class="acc-btn" type="button" aria-expanded="false" aria-controls="faq-panel-' + i + '" id="faq-btn-' + i + '">' + q[0] + icon('chevron', 18) + '</button>' +
        '<div class="acc-panel" id="faq-panel-' + i + '" role="region" aria-labelledby="faq-btn-' + i + '"><p>' + q[1] + '</p></div>' +
      '</div>';
    }).join('');
    acc.addEventListener('click', function (e) {
      var btn = e.target.closest('.acc-btn');
      if (!btn) return;
      var item = btn.closest('.acc-item');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- Mortgage calculator ---------- */
  var calcForm = document.getElementById('calcForm');
  if (calcForm) {
    var priceIn = document.getElementById('c-price');
    var downIn = document.getElementById('c-down');
    var pctEl = document.getElementById('downPct');
    function paintPct() {
      var price = Number(priceIn.value);
      var down = Number(downIn.value);
      if (price > 0 && down >= 0) {
        var pct = (down / price * 100);
        pctEl.textContent = pct.toFixed(1) + '% of purchase price' + (down > price ? ' — down payment exceeds the price' : '');
      } else {
        pctEl.textContent = '—';
      }
    }
    priceIn.addEventListener('input', paintPct);
    downIn.addEventListener('input', paintPct);
    paintPct();

    calcForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var price = Number(priceIn.value);
      var down = Number(downIn.value);
      var rate = Number(document.getElementById('c-rate').value);
      var years = Number(document.getElementById('c-term').value);
      var tax = Number(document.getElementById('c-tax').value) || 0;
      var ins = Number(document.getElementById('c-ins').value) || 0;

      if (!(price >= 10000)) { alert('Please enter a purchase price of at least $10,000.'); return; }
      if (!(down >= 0) || down > price) { alert('Please enter a down payment between $0 and the purchase price.'); return; }
      if (!(rate > 0 && rate <= 25)) { alert('Please enter an interest rate between 0.1% and 25%.'); return; }

      var loan = price - down;
      var r = rate / 100 / 12;
      var n = years * 12;
      var pi;
      if (r === 0) { pi = loan / n; }
      else { pi = loan * r / (1 - Math.pow(1 + r, -n)); }
      var totalInterest = pi * n - loan;
      var monthly = pi + tax / 12 + ins / 12;

      function money(v) { return '$' + Math.round(v).toLocaleString('en-US'); }
      document.getElementById('calcMonthly').textContent = money(monthly);
      document.getElementById('calcPI').textContent = money(pi);
      document.getElementById('calcTax').textContent = money(tax / 12);
      document.getElementById('calcIns').textContent = money(ins / 12);
      document.getElementById('calcLoan').textContent = money(loan);
      document.getElementById('calcTotalInterest').textContent = money(totalInterest);
    });
  }
})();

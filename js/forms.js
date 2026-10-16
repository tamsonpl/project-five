/* HOMELUXE forms — reusable valuation, contact and newsletter builders */
(function () {
  'use strict';
  var HL = window.HL, icon = window.hlIcon;

  var PROPERTY_TYPES = ['House', 'Apartment', 'Condo', 'Villa', 'Townhouse', 'Land'];

  function valuationFormHTML(id) {
    return '<form id="' + id + '" novalidate>' +
      '<div class="form-grid">' +
        '<div class="field"><label for="' + id + '-name">Full Name <span class="req">*</span></label>' +
          '<input id="' + id + '-name" name="name" type="text" autocomplete="name" placeholder="Jane Smith">' +
        '</div>' +
        '<div class="field"><label for="' + id + '-email">Email <span class="req">*</span></label>' +
          '<input id="' + id + '-email" name="email" type="email" autocomplete="email" placeholder="jane@example.com">' +
        '</div>' +
        '<div class="field"><label for="' + id + '-phone">Phone <span class="req">*</span></label>' +
          '<input id="' + id + '-phone" name="phone" type="tel" autocomplete="tel" placeholder="(555) 000-0000">' +
        '</div>' +
        '<div class="field"><label for="' + id + '-type">Property Type</label>' +
          '<select id="' + id + '-type" name="propertyType">' +
            PROPERTY_TYPES.map(function (t) { return '<option value="' + t + '">' + t + '</option>'; }).join('') +
          '</select>' +
        '</div>' +
        '<div class="field full"><label for="' + id + '-address">Property Address <span class="req">*</span></label>' +
          '<input id="' + id + '-address" name="address" type="text" autocomplete="street-address" placeholder="123 Maple Drive, Beverly Hills, CA">' +
        '</div>' +
        '<div class="field full"><label for="' + id + '-value">Estimated Value <span class="demo-note">(optional)</span></label>' +
          '<input id="' + id + '-value" name="estimatedValue" type="number" min="0" step="1000" placeholder="e.g. 850000">' +
        '</div>' +
      '</div>' +
      '<p class="demo-note" style="margin-top:14px">' + icon('info', 14) + 'Demo request — no real valuation or market analysis is performed.</p>' +
      '<button type="submit" class="btn btn-primary" style="margin-top:18px;width:100%">' + icon('send', 17) + ' Request Free Valuation</button>' +
      '<div class="form-status" role="status" aria-live="polite"></div>' +
    '</form>';
  }

  function valuationRules() {
    return {
      name: function (v) { return v ? '' : 'Please enter your name.'; },
      email: function (v) { return HL.validate.email(v) ? '' : 'Please enter a valid email address.'; },
      phone: function (v) { return HL.validate.phone(v) ? '' : 'Please enter a valid phone number.'; },
      address: function (v) { return v.length >= 5 ? '' : 'Please enter the property address.'; }
    };
  }

  function initValuationForm(root, onSuccess) {
    var form = typeof root === 'string' ? document.getElementById(root) : root;
    if (!form) return;
    HL.handleFormSubmit(form, {
      endpoint: '/api/valuation',
      rules: valuationRules(),
      successMessage: 'Thank you! Your valuation request has been received — our team (demo) will reach out within one business day.',
      onSuccess: onSuccess
    });
  }

  function contactFormHTML(id) {
    return '<form id="' + id + '" novalidate>' +
      '<div class="form-grid">' +
        '<div class="field"><label for="' + id + '-name">Full Name <span class="req">*</span></label>' +
          '<input id="' + id + '-name" name="name" type="text" autocomplete="name" placeholder="Jane Smith"></div>' +
        '<div class="field"><label for="' + id + '-email">Email <span class="req">*</span></label>' +
          '<input id="' + id + '-email" name="email" type="email" autocomplete="email" placeholder="jane@example.com"></div>' +
        '<div class="field"><label for="' + id + '-phone">Phone</label>' +
          '<input id="' + id + '-phone" name="phone" type="tel" autocomplete="tel" placeholder="(555) 000-0000"></div>' +
        '<div class="field"><label for="' + id + '-subject">Subject <span class="req">*</span></label>' +
          '<input id="' + id + '-subject" name="subject" type="text" placeholder="How can we help?"></div>' +
        '<div class="field full"><label for="' + id + '-message">Message <span class="req">*</span></label>' +
          '<textarea id="' + id + '-message" name="message" placeholder="Tell us more about what you are looking for…"></textarea></div>' +
      '</div>' +
      '<button type="submit" class="btn btn-primary" style="margin-top:18px">' + icon('send', 17) + ' Send Message</button>' +
      '<div class="form-status" role="status" aria-live="polite"></div>' +
    '</form>';
  }

  function initContactForm(root, extraFn, opts) {
    opts = opts || {};
    var form = typeof root === 'string' ? document.getElementById(root) : root;
    if (!form) return;
    HL.handleFormSubmit(form, {
      endpoint: '/api/contact',
      rules: {
        name: function (v) { return v ? '' : 'Please enter your name.'; },
        email: function (v) { return HL.validate.email(v) ? '' : 'Please enter a valid email address.'; },
        subject: function (v) { return v ? '' : 'Please add a subject.'; },
        message: function (v) { return v.length >= 10 ? '' : 'Please write a short message (10+ characters).'; }
      },
      extra: extraFn,
      successMessage: opts.successMessage || 'Thank you! Your message has been received — we (demo) will reply within one business day.'
    });
  }

  function initNewsletter(form) {
    var input = form.querySelector('input[type="email"]');
    var note = form.querySelector('.form-note') || (function () {
      var n = document.createElement('div'); n.className = 'form-note'; n.setAttribute('role', 'status');
      form.parentNode.insertBefore(n, form.nextSibling); return n;
    })();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!HL.validate.email(email)) {
        note.className = 'form-note err';
        note.textContent = 'Please enter a valid email address.';
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.innerHTML = 'Subscribing&hellip;';
      HL.apiPost('/api/newsletter', { email: email, consent: true }).then(function () {
        input.value = '';
        note.className = 'form-note ok';
        note.textContent = 'You\u2019re on the list! Watch your inbox for the latest listings (demo).';
      }).catch(function (err) {
        if (err.status === 409) {
          note.className = 'form-note ok';
          note.textContent = 'This email is already subscribed — thank you!';
        } else {
          note.className = 'form-note err';
          note.textContent = 'We couldn\u2019t complete the subscription right now. Please try again shortly.';
        }
      }).then(function () {
        btn.disabled = false; btn.innerHTML = 'Subscribe';
      });
    });
  }

  window.HLForms = {
    valuationFormHTML: valuationFormHTML,
    initValuationForm: initValuationForm,
    contactFormHTML: contactFormHTML,
    initContactForm: initContactForm,
    initNewsletter: initNewsletter
  };
})();

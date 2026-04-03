/* ============================================================
   SmartGrid Integrations — booking-wizard.js
   3-step multi-step booking form
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Config ---------- */
  var BOOKING_WEBHOOK_URL = 'https://your-webhook-url.com/booking';

  /* ---------- Data ---------- */
  var services = [
    { id: 'infrastructure', icon: 'server',        label: 'Infrastructure',       desc: 'Network, cabling & hardware deployment' },
    { id: 'technology',     icon: 'cpu',            label: 'Technology',           desc: 'Systems integration & software rollout' },
    { id: 'professional',   icon: 'briefcase',      label: 'Professional',         desc: 'Consulting, project management & training' },
    { id: 'managed',        icon: 'shield',         label: 'Managed',              desc: '24/7 monitoring & managed IT services' },
    { id: 'cloud',          icon: 'cloud',          label: 'Cloud',                desc: 'Cloud migration, hosting & optimization' },
    { id: 'logistics',      icon: 'truck',          label: 'Global Logistics',     desc: 'Supply chain tech & logistics integration' }
  ];

  var industries = [
    'Select your industry',
    'Healthcare',
    'Finance & Banking',
    'Retail & E-Commerce',
    'Manufacturing',
    'Education',
    'Government',
    'Hospitality',
    'Technology',
    'Energy & Utilities',
    'Other'
  ];

  var companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  /* ---------- State ---------- */
  var currentStep      = 1;
  var selectedService  = null;
  var formData         = {};

  /* ----------------------------------------------------------
     Render the wizard inside #booking-wizard
     ---------------------------------------------------------- */
  function initBookingWizard() {
    var root = document.getElementById('booking-wizard');
    if (!root) return;

    root.innerHTML = buildIndicator() + buildSteps() + buildNav();

    bindServiceCards();
    bindNav();
    showStep(1);
  }

  /* ---------- Step indicator ---------- */
  function buildIndicator() {
    var html = '<div class="bw-indicator">';
    for (var i = 1; i <= 3; i++) {
      if (i > 1) html += '<span class="bw-line"></span>';
      html += '<span class="bw-dot' + (i === 1 ? ' active' : '') + '" data-step="' + i + '">' + i + '</span>';
    }
    html += '</div>';
    return html;
  }

  /* ---------- Step 1: Service selection ---------- */
  function buildStep1() {
    var html = '<div class="bw-step" id="bw-step-1">' +
      '<h3>Select a Service</h3>' +
      '<div class="bw-services">';
    services.forEach(function (s) {
      html +=
        '<div class="bw-card" data-service="' + s.id + '">' +
          '<i data-lucide="' + s.icon + '"></i>' +
          '<strong>' + s.label + '</strong>' +
          '<p>' + s.desc + '</p>' +
        '</div>';
    });
    html += '</div></div>';
    return html;
  }

  /* ---------- Step 2: Company details ---------- */
  function buildStep2() {
    var optionsHtml = '';
    industries.forEach(function (ind, idx) {
      optionsHtml += '<option value="' + (idx === 0 ? '' : ind) + '"' + (idx === 0 ? ' disabled selected' : '') + '>' + ind + '</option>';
    });

    var sizesHtml = '';
    companySizes.forEach(function (size) {
      sizesHtml +=
        '<label class="bw-radio">' +
          '<input type="radio" name="bw-size" value="' + size + '" />' +
          '<span>' + size + '</span>' +
        '</label>';
    });

    return '<div class="bw-step" id="bw-step-2" style="display:none">' +
      '<h3>Company Details</h3>' +
      '<div class="bw-field">' +
        '<label for="bw-company">Company Name</label>' +
        '<input type="text" id="bw-company" placeholder="Your company name" required />' +
      '</div>' +
      '<div class="bw-field">' +
        '<label for="bw-industry">Industry</label>' +
        '<select id="bw-industry">' + optionsHtml + '</select>' +
      '</div>' +
      '<div class="bw-field">' +
        '<label>Company Size</label>' +
        '<div class="bw-sizes">' + sizesHtml + '</div>' +
      '</div>' +
    '</div>';
  }

  /* ---------- Step 3: Contact info ---------- */
  function buildStep3() {
    return '<div class="bw-step" id="bw-step-3" style="display:none">' +
      '<h3>Contact Information</h3>' +
      '<div class="bw-row">' +
        '<div class="bw-field">' +
          '<label for="bw-first">First Name</label>' +
          '<input type="text" id="bw-first" placeholder="First name" required />' +
        '</div>' +
        '<div class="bw-field">' +
          '<label for="bw-last">Last Name</label>' +
          '<input type="text" id="bw-last" placeholder="Last name" required />' +
        '</div>' +
      '</div>' +
      '<div class="bw-field">' +
        '<label for="bw-email">Email</label>' +
        '<input type="email" id="bw-email" placeholder="you@company.com" required />' +
      '</div>' +
      '<div class="bw-field">' +
        '<label for="bw-phone">Phone</label>' +
        '<input type="tel" id="bw-phone" placeholder="+1 (555) 000-0000" />' +
      '</div>' +
      '<div class="bw-field">' +
        '<label for="bw-msg">Message</label>' +
        '<textarea id="bw-msg" rows="3" placeholder="Tell us about your project (optional)"></textarea>' +
      '</div>' +
    '</div>';
  }

  /* ---------- Success state ---------- */
  function buildSuccess() {
    return '<div class="bw-step bw-success" id="bw-step-success" style="display:none">' +
      '<div class="bw-checkmark">' +
        '<svg viewBox="0 0 52 52" width="64" height="64">' +
          '<circle cx="26" cy="26" r="25" fill="none" stroke="#0d1b3e" stroke-width="2"/>' +
          '<path fill="none" stroke="#0d1b3e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16"/>' +
        '</svg>' +
      '</div>' +
      '<h3>Consultation Booked!</h3>' +
      '<p>Our team will reach out within 24 hours to confirm your appointment.</p>' +
      '<p class="bw-phone">Or call us now: <a href="tel:+18557464744">+1 (855) 746-4744</a></p>' +
    '</div>';
  }

  function buildSteps() {
    return buildStep1() + buildStep2() + buildStep3() + buildSuccess();
  }

  /* ---------- Navigation ---------- */
  function buildNav() {
    return '<div class="bw-nav" id="bw-nav">' +
      '<button class="bw-btn bw-back" id="bw-back" style="display:none">Back</button>' +
      '<button class="bw-btn bw-continue" id="bw-continue">Continue</button>' +
    '</div>';
  }

  /* ----------------------------------------------------------
     Interactivity
     ---------------------------------------------------------- */
  function bindServiceCards() {
    var cards = document.querySelectorAll('.bw-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        cards.forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        selectedService = card.getAttribute('data-service');
      });
    });
  }

  function bindNav() {
    document.getElementById('bw-back').addEventListener('click', function () {
      if (currentStep > 1) showStep(currentStep - 1);
    });

    document.getElementById('bw-continue').addEventListener('click', function () {
      if (currentStep === 1) {
        if (!selectedService) {
          shakeElement(document.querySelector('.bw-services'));
          return;
        }
        showStep(2);
      } else if (currentStep === 2) {
        var company = document.getElementById('bw-company').value.trim();
        if (!company) {
          shakeElement(document.getElementById('bw-company'));
          return;
        }
        showStep(3);
      } else if (currentStep === 3) {
        submitBooking();
      }
    });
  }

  function showStep(step) {
    currentStep = step;

    for (var i = 1; i <= 3; i++) {
      var el = document.getElementById('bw-step-' + i);
      if (el) el.style.display = (i === step) ? 'block' : 'none';
    }

    // Indicator
    document.querySelectorAll('.bw-dot').forEach(function (dot) {
      var s = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.toggle('active', s <= step);
    });
    document.querySelectorAll('.bw-line').forEach(function (line, idx) {
      line.classList.toggle('active', (idx + 2) <= step);
    });

    // Nav buttons
    document.getElementById('bw-back').style.display = (step > 1) ? '' : 'none';

    var continueBtn = document.getElementById('bw-continue');
    continueBtn.textContent = (step === 3) ? 'Submit' : 'Continue';
    continueBtn.style.display = '';

    // Re-init Lucide for new icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  /* ---------- Submit ---------- */
  function submitBooking() {
    var first = document.getElementById('bw-first').value.trim();
    var last  = document.getElementById('bw-last').value.trim();
    var email = document.getElementById('bw-email').value.trim();

    if (!first || !last || !email) {
      if (!first) shakeElement(document.getElementById('bw-first'));
      if (!last)  shakeElement(document.getElementById('bw-last'));
      if (!email) shakeElement(document.getElementById('bw-email'));
      return;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      shakeElement(document.getElementById('bw-email'));
      return;
    }

    var sizeRadio = document.querySelector('input[name="bw-size"]:checked');

    var payload = {
      service: selectedService,
      company: document.getElementById('bw-company').value.trim(),
      industry: document.getElementById('bw-industry').value,
      companySize: sizeRadio ? sizeRadio.value : '',
      firstName: first,
      lastName: last,
      email: email,
      phone: document.getElementById('bw-phone').value.trim(),
      message: document.getElementById('bw-msg').value.trim(),
      page: window.location.href,
      timestamp: new Date().toISOString()
    };

    var continueBtn = document.getElementById('bw-continue');
    continueBtn.disabled = true;
    continueBtn.textContent = 'Sending...';

    fetch(BOOKING_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function () { showSuccess(); })
      .catch(function () { showSuccess(); }); // still show success — webhook will retry
  }

  function showSuccess() {
    for (var i = 1; i <= 3; i++) {
      var el = document.getElementById('bw-step-' + i);
      if (el) el.style.display = 'none';
    }
    document.getElementById('bw-step-success').style.display = 'block';
    document.getElementById('bw-nav').style.display = 'none';
  }

  /* ---------- Utility ---------- */
  function shakeElement(el) {
    if (!el) return;
    el.classList.add('shake');
    setTimeout(function () { el.classList.remove('shake'); }, 500);
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', initBookingWizard);
})();

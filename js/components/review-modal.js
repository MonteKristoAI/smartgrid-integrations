/* ============================================================
   SmartGrid Integrations — review-modal.js
   Smart review gating (MonteKristo pattern)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Config ---------- */
  var GOOGLE_REVIEWS_URL = 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review';
  var WEBHOOK_URL       = 'https://your-webhook-url.com/review-feedback';

  /* ---------- State ---------- */
  var selectedRating    = 0;
  var selectedCategory  = null;
  var overlay           = null;

  /* ----------------------------------------------------------
     Build modal HTML and inject into page
     ---------------------------------------------------------- */
  function buildModal() {
    if (document.getElementById('review-modal-overlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'review-modal-overlay';
    overlay.className = 'review-overlay';
    overlay.innerHTML =
      '<div class="review-modal" role="dialog" aria-labelledby="review-title">' +
        '<button class="review-close" aria-label="Close">&times;</button>' +
        '<div id="review-step-rating" class="review-step">' +
          '<h3 id="review-title">How was your experience?</h3>' +
          '<p>Tap a star to rate SmartGrid Integrations</p>' +
          '<div class="review-stars" id="review-stars"></div>' +
        '</div>' +
        '<div id="review-step-thanks" class="review-step" style="display:none">' +
          '<div class="review-icon-check">&#10003;</div>' +
          '<h3>Thank you!</h3>' +
          '<p>Your feedback means a lot to us.</p>' +
        '</div>' +
        '<div id="review-step-feedback" class="review-step" style="display:none">' +
          '<h3>We\'d love to do better</h3>' +
          '<p>What area could we improve?</p>' +
          '<div class="review-pills" id="review-pills"></div>' +
          '<input type="text" id="review-improvement" class="review-input" placeholder="What could we improve?" />' +
          '<textarea id="review-message" class="review-textarea" rows="3" placeholder="Tell us more (optional)"></textarea>' +
          '<button id="review-submit" class="review-btn">Send Feedback</button>' +
          '<div id="review-feedback-thanks" style="display:none">' +
            '<div class="review-icon-check">&#10003;</div>' +
            '<p>Thank you — we\'ll use this to improve.</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Stars
    var starsContainer = document.getElementById('review-stars');
    for (var i = 1; i <= 5; i++) {
      var star = document.createElement('span');
      star.className = 'review-star';
      star.setAttribute('data-value', i);
      star.innerHTML = '&#9733;';
      star.addEventListener('click', handleStarClick);
      star.addEventListener('mouseenter', handleStarHover);
      starsContainer.appendChild(star);
    }
    starsContainer.addEventListener('mouseleave', function () {
      highlightStars(selectedRating);
    });

    // Category pills
    var categories = ['Communication', 'Quality', 'Timeliness', 'Value', 'Support', 'Other'];
    var pillsContainer = document.getElementById('review-pills');
    categories.forEach(function (cat) {
      var pill = document.createElement('button');
      pill.className = 'review-pill';
      pill.textContent = cat;
      pill.addEventListener('click', function () {
        pillsContainer.querySelectorAll('.review-pill').forEach(function (p) {
          p.classList.remove('active');
        });
        pill.classList.add('active');
        selectedCategory = cat;
      });
      pillsContainer.appendChild(pill);
    });

    // Close handlers
    overlay.querySelector('.review-close').addEventListener('click', closeReviewModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeReviewModal();
    });

    // Submit feedback
    document.getElementById('review-submit').addEventListener('click', submitFeedback);
  }

  /* ---------- Star helpers ---------- */
  function highlightStars(count) {
    var stars = document.querySelectorAll('#review-stars .review-star');
    stars.forEach(function (s) {
      var val = parseInt(s.getAttribute('data-value'), 10);
      s.classList.toggle('active', val <= count);
    });
  }

  function handleStarHover(e) {
    highlightStars(parseInt(e.target.getAttribute('data-value'), 10));
  }

  function handleStarClick(e) {
    selectedRating = parseInt(e.target.getAttribute('data-value'), 10);
    highlightStars(selectedRating);

    setTimeout(function () {
      if (selectedRating >= 4) {
        // Happy path — send to Google
        document.getElementById('review-step-rating').style.display = 'none';
        document.getElementById('review-step-thanks').style.display = 'block';
        window.open(GOOGLE_REVIEWS_URL, '_blank');
        setTimeout(closeReviewModal, 3000);
      } else {
        // Improvement path — collect feedback
        document.getElementById('review-step-rating').style.display = 'none';
        document.getElementById('review-step-feedback').style.display = 'block';
      }
    }, 400);
  }

  /* ---------- Submit negative feedback ---------- */
  function submitFeedback() {
    var improvement = document.getElementById('review-improvement').value.trim();
    var message     = document.getElementById('review-message').value.trim();

    var payload = {
      rating: selectedRating,
      category: selectedCategory || 'Unspecified',
      improvement: improvement,
      message: message,
      page: window.location.href,
      timestamp: new Date().toISOString()
    };

    var submitBtn = document.getElementById('review-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function () { showFeedbackThanks(); })
      .catch(function () { showFeedbackThanks(); }); // still thank them
  }

  function showFeedbackThanks() {
    document.getElementById('review-submit').style.display = 'none';
    document.getElementById('review-improvement').style.display = 'none';
    document.getElementById('review-message').style.display = 'none';
    document.getElementById('review-pills').style.display = 'none';
    document.querySelector('#review-step-feedback h3').style.display = 'none';
    document.querySelector('#review-step-feedback > p').style.display = 'none';
    document.getElementById('review-feedback-thanks').style.display = 'block';
    setTimeout(closeReviewModal, 3000);
  }

  /* ---------- Public API ---------- */
  window.openReviewModal = function () {
    buildModal();
    // Reset state
    selectedRating = 0;
    selectedCategory = null;
    highlightStars(0);
    document.getElementById('review-step-rating').style.display = 'block';
    document.getElementById('review-step-thanks').style.display = 'none';
    document.getElementById('review-step-feedback').style.display = 'none';
    document.getElementById('review-feedback-thanks').style.display = 'none';

    var submitBtn = document.getElementById('review-submit');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Feedback';
    submitBtn.style.display = '';

    var imp = document.getElementById('review-improvement');
    imp.value = '';
    imp.style.display = '';

    var msg = document.getElementById('review-message');
    msg.value = '';
    msg.style.display = '';

    document.getElementById('review-pills').style.display = '';
    document.getElementById('review-pills').querySelectorAll('.review-pill').forEach(function (p) {
      p.classList.remove('active');
    });

    overlay.classList.add('open');
    document.body.classList.add('modal-open');
  };

  window.closeReviewModal = function () {
    if (overlay) {
      overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  };
})();

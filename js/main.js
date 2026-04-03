/* ============================================
   SmartGrid Integrations — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Menu Toggle ---- */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      });
    });
  }

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Hero Entrance Animation ---- */
  document.querySelectorAll('.hero-animate').forEach(el => {
    setTimeout(() => el.classList.add('active'), 100);
  });

  /* ---- Navbar Scroll Effect ---- */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('shadow-lg');
        header.style.background = 'rgba(13,27,62,0.98)';
      } else {
        header.classList.remove('shadow-lg');
        header.style.background = 'rgba(13,27,62,1)';
      }
    });
  }

  /* ---- Counter Animation ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = prefix + Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  /* ---- Chatbot Widget ---- */
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('hidden');
      chatWindow.classList.toggle('flex');
      if (!chatWindow.classList.contains('hidden') && chatInput) chatInput.focus();
    });
    if (chatClose) {
      chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        chatWindow.classList.remove('flex');
      });
    }
    if (chatForm && chatMessages) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        const userBubble = document.createElement('div');
        userBubble.className = 'flex justify-end';
        userBubble.innerHTML = '<div class="bg-red-700 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%] text-sm">' + msg + '</div>';
        chatMessages.appendChild(userBubble);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(() => {
          const botBubble = document.createElement('div');
          botBubble.className = 'flex justify-start';
          botBubble.innerHTML = '<div class="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%] text-sm">Thanks for reaching out! A SmartGrid representative will be in touch shortly. For immediate help, call <strong>+1 (855) 746-4744</strong>.</div>';
          chatMessages.appendChild(botBubble);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
      });
    }
  }

  /* ---- Contact Form Handling ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent!';
        btn.classList.remove('bg-red-700', 'hover:bg-red-800');
        btn.classList.add('bg-green-600');
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = origText;
          btn.disabled = false;
          btn.classList.remove('bg-green-600');
          btn.classList.add('bg-red-700', 'hover:bg-red-800');
        }, 3000);
      }, 1500);
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

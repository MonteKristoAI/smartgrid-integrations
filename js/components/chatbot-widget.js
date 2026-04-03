/* ============================================================
   SmartGrid Integrations — chatbot-widget.js
   Floating chatbot widget (dynamically injected)
   ============================================================ */

(function () {
  'use strict';

  var PHONE = '+1 (855) 746-4744';
  var isOpen = false;

  function initChatbot() {
    if (document.getElementById('sg-chatbot-btn')) return;

    // ---- Floating button ----
    var btn = document.createElement('button');
    btn.id = 'sg-chatbot-btn';
    btn.setAttribute('aria-label', 'Open chat');
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
      '</svg>';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: '9998',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      background: '#0d1b3e',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      transition: 'transform 0.2s ease'
    });
    btn.addEventListener('mouseenter', function () { btn.style.transform = 'scale(1.08)'; });
    btn.addEventListener('mouseleave', function () { btn.style.transform = 'scale(1)'; });

    // ---- Chat modal ----
    var modal = document.createElement('div');
    modal.id = 'sg-chatbot-modal';
    Object.assign(modal.style, {
      position: 'fixed',
      bottom: '6rem',
      right: '1.5rem',
      zIndex: '9999',
      width: '360px',
      maxWidth: 'calc(100vw - 2rem)',
      maxHeight: '480px',
      borderRadius: '16px',
      background: '#ffffff',
      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      display: 'none',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    });

    modal.innerHTML =
      // Header
      '<div style="background:#0d1b3e;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between">' +
        '<span style="font-weight:600;font-size:15px">SmartGrid Chat</span>' +
        '<button id="sg-chatbot-close" aria-label="Close chat" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1">&times;</button>' +
      '</div>' +
      // Messages
      '<div id="sg-chatbot-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px"></div>' +
      // Input
      '<form id="sg-chatbot-form" style="display:flex;border-top:1px solid #e5e7eb;padding:10px 12px;gap:8px">' +
        '<input id="sg-chatbot-input" type="text" placeholder="Type a message..." autocomplete="off" style="flex:1;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;font-size:14px;outline:none" />' +
        '<button type="submit" style="background:#0d1b3e;color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:14px;cursor:pointer;font-weight:600">Send</button>' +
      '</form>';

    document.body.appendChild(btn);
    document.body.appendChild(modal);

    // ---- Welcome message ----
    addBotMessage("Hi! I'm SmartGrid's assistant. How can I help you today?");

    // ---- Events ----
    btn.addEventListener('click', toggleChat);
    document.getElementById('sg-chatbot-close').addEventListener('click', closeChat);

    document.getElementById('sg-chatbot-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('sg-chatbot-input');
      var msg = input.value.trim();
      if (!msg) return;
      addUserMessage(msg);
      input.value = '';

      setTimeout(function () {
        addBotMessage('Thanks for reaching out! A SmartGrid representative will be in touch shortly. For immediate help, call <strong>' + PHONE + '</strong>.');
      }, 800);
    });

    // Escape to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });

    // Backdrop click (outside modal)
    document.addEventListener('click', function (e) {
      if (isOpen && !modal.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        closeChat();
      }
    });

    // Mobile: bump button above mobile CTA bar
    applyMobilePosition();
    window.addEventListener('resize', applyMobilePosition);
  }

  function applyMobilePosition() {
    var btn = document.getElementById('sg-chatbot-btn');
    var modal = document.getElementById('sg-chatbot-modal');
    if (!btn) return;

    if (window.innerWidth <= 768) {
      btn.style.bottom = '5rem';
      if (modal) modal.style.bottom = '9rem';
    } else {
      btn.style.bottom = '1.5rem';
      if (modal) modal.style.bottom = '6rem';
    }
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    var modal = document.getElementById('sg-chatbot-modal');
    if (modal) {
      modal.style.display = 'flex';
      isOpen = true;
      var input = document.getElementById('sg-chatbot-input');
      if (input) input.focus();
    }
  }

  function closeChat() {
    var modal = document.getElementById('sg-chatbot-modal');
    if (modal) {
      modal.style.display = 'none';
      isOpen = false;
    }
  }

  function addBotMessage(html) {
    var container = document.getElementById('sg-chatbot-messages');
    if (!container) return;
    var bubble = document.createElement('div');
    bubble.style.cssText = 'background:#f3f4f6;color:#1f2937;padding:10px 14px;border-radius:14px 14px 14px 4px;max-width:85%;font-size:14px;line-height:1.5;align-self:flex-start';
    bubble.innerHTML = html;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  function addUserMessage(text) {
    var container = document.getElementById('sg-chatbot-messages');
    if (!container) return;
    var bubble = document.createElement('div');
    bubble.style.cssText = 'background:#0d1b3e;color:#fff;padding:10px 14px;border-radius:14px 14px 4px 14px;max-width:85%;font-size:14px;line-height:1.5;align-self:flex-end';
    bubble.textContent = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  /* ---------- Boot ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

  window.initChatbot = initChatbot;
})();

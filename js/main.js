// Minimal, clean JS for menu + tabs + year + overlay guard

// Nav toggle
const nav = document.getElementById('siteNav');
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.setAttribute('aria-expanded', String(!expanded));
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Tabs
document.querySelectorAll('.tabs__tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs__tab').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const target = btn.getAttribute('data-target');
    document.querySelectorAll('#sd, #mp').forEach(sec => sec.classList.add('is-hidden'));
    document.getElementById(target).classList.remove('is-hidden');
  });
});




// Remove injected overlays (defensive)
(function killOverlays(){
  const kill = el => { try{ el.remove(); }catch(e){} };
  const scan = () => { document.querySelectorAll('div.content.scroll, input[type="search"], form[role="search"], [role="search"], [class*="search" i], [id*="search" i]').forEach(kill); };
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true}); scan();
})();


// Floating labels for contact form
(function () {
  const fields = document.querySelectorAll('#contact .form .field');
  if (!fields.length) return;

  fields.forEach(field => {
    const input = field.querySelector('.input');
    if (!input) return;

    const update = () => {
      const hasValue = input.value.trim() !== '';
      field.classList.toggle('focus', input === document.activeElement || hasValue);
    };

    ['focus', 'blur', 'input'].forEach(evt => input.addEventListener(evt, update));
    update(); // run once on load for prefilled/autofill
  });
})();

// Animated <details> for Skills
(function(){
  const details = document.querySelector('.skills-details');
  if (!details) return;

  const summary = details.querySelector('summary');
  const panel   = details.querySelector('.skills-panel');

  const EASING = 'cubic-bezier(0.25, 1, 0.3, 1)';
  const DUR    = 450; // ms

  // Open with height animation
  function openAnim() {
    details.classList.add('is-opening');
    details.setAttribute('open', '');           // mark as open for accessibility
    details.classList.add('is-open');

    panel.style.height = '0px';
    panel.style.opacity = '0';

    const h = panel.scrollHeight + 'px';
    requestAnimationFrame(() => {
      panel.style.transition = `height ${DUR}ms ${EASING}, opacity 350ms ease`;
      panel.style.height = h;
      panel.style.opacity = '1';
    });

    panel.addEventListener('transitionend', function te(e){
      if (e.propertyName !== 'height') return;
      panel.style.height = 'auto';              // unlock height
      details.classList.remove('is-opening');
      panel.removeEventListener('transitionend', te);
    });
  }

  // Close with height animation (then remove open)
  function closeAnim() {
    details.classList.add('is-closing');
    const h = panel.scrollHeight + 'px';
    panel.style.height = h;                     // set fixed height first

    requestAnimationFrame(() => {
      panel.style.transition = `height ${DUR}ms ${EASING}, opacity 300ms ease`;
      panel.style.height = '0px';
      panel.style.opacity = '0';
      details.classList.remove('is-open');
    });

    panel.addEventListener('transitionend', function tc(e){
      if (e.propertyName !== 'height') return;
      details.removeAttribute('open');          // actually close after anim
      details.classList.remove('is-closing');
      panel.removeEventListener('transitionend', tc);
    });
  }

  // Intercept native toggle so we can animate both ways
  summary.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = details.hasAttribute('open');
    if (!isOpen) openAnim(); else closeAnim();
  });
})();




// --- form Toast helper ---------------------------------------------------------
(function initToast() {
  if (document.getElementById('toastWrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'toast-wrap';
  wrap.id = 'toastWrap';
  // ARIA live region for screen readers
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('aria-live', 'polite');
  wrap.setAttribute('aria-atomic', 'true');
  document.body.appendChild(wrap);
})();

function showToast(message, type = 'success', timeout = 3500) { //change timeout to make it longer or shorter
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');

  const icon = document.createElement('span');
  icon.className = 'toast__icon';

  // Use your FA icons if loaded; fall back to emoji
  if (type === 'success') {
    icon.innerHTML = `<i class="fa-solid fa-check"></i>`; // ✅
  } else {
    icon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`; // ⚠️
  }

  const text = document.createElement('div');
  text.className = 'toast__text';
  text.textContent = message;

  const close = document.createElement('button');
  close.className = 'toast__close';
  close.type = 'button';
  close.textContent = 'Close';
  close.addEventListener('click', () => dismiss());

  toast.append(icon, text, close);
  wrap.appendChild(toast);

  const dismiss = () => {
    toast.style.animation = 'toastOut 220ms ease forwards';
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  if (timeout > 0) setTimeout(dismiss, timeout);
  return dismiss;
}

// --- Formspree AJAX submission (stay on page) -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        showToast("Thanks! Your message was sent. I wll get back to you soon.", "success");
        form.reset();
      } else {
        showToast("Hmm, something went wrong. Please try again or email me directly.", "error", 5000);
      }
    } catch (err) {
      showToast("Network error. Check your connection and try again.", "error", 5000);
    }
  });
});






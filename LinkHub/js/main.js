// Theme toggle (light/dark)
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'light') root.classList.add('light');
  if (toggle){
    toggle.addEventListener('click', () => {
      root.classList.toggle('light');
      localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    });
  }
})();

// Year
(function(){ const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); })();

// UTM auto-tagging: adds ?utm_source=...&utm_medium=linkhub
(function(){
  const params = new URLSearchParams(location.search);
  const src = params.get('src'); // allow ?src=instagram etc.
  document.querySelectorAll('.btn[data-source]').forEach(a => {
    try{
      if (!a.getAttribute('href') || a.getAttribute('href') === '#') return;
      const platform = a.getAttribute('data-source');
      const url = new URL(a.href, location.origin);
      url.searchParams.set('utm_source', src || platform || 'linkhub');
      url.searchParams.set('utm_medium', 'linkhub');
      url.searchParams.set('utm_campaign', 'album');
      a.href = url.toString();
    } catch(e){}
  });
})();

// Copy/share
(function(){
  const copyBtn = document.getElementById('copyBtn');
  const shareBtn = document.getElementById('shareBtn');
  const shareUrl = location.origin + location.pathname;
  if (location.hash) {
    history.replaceState(null, '', shareUrl);
  }
  if (copyBtn){
    copyBtn.addEventListener('click', async () => {
      try{ await navigator.clipboard.writeText(shareUrl);
        copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy Link',1200);
      }catch(e){ alert('Copy failed'); }
    });
  }
  if (shareBtn){
    shareBtn.addEventListener('click', async () => {
      if (navigator.share){
        try { await navigator.share({ title: document.title, url: shareUrl }); } catch(e){}
      } else {
        alert('Sharing not supported here. Copy the link instead.');
      }
    });
  }
})();

// Tracklist toggle (matches Skills approach: slide + fade + glow icon)
(function () {
  const wrap = document.getElementById('tracks');
  const btn  = wrap?.querySelector('.tracks__summary');
  const panel = document.getElementById('tracksPanel');
  if (!wrap || !btn || !panel) return;

  let isOpen = false;

  // helper: animate max-height for smooth slide
  const openPanel = () => {
    wrap.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    // reset to get accurate scrollHeight
    panel.style.maxHeight = '0px';
    panel.style.opacity = '0';
    // allow style flush
    requestAnimationFrame(() => {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      panel.style.opacity = '1';
      // retrigger list fade each time it opens
      const items = panel.querySelectorAll('.tracks__list li');
      items.forEach(li => { li.style.animation = 'none'; li.offsetHeight; li.style.animation = ''; });
    });
  };

  const closePanel = () => {
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
    panel.style.opacity = '0';
  };

  btn.addEventListener('click', () => {
    isOpen ? closePanel() : openPanel();
    isOpen = !isOpen;
  });

  // optional: close on Esc when focused inside
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closePanel(); isOpen = false; btn.focus();
    }
  });
})();

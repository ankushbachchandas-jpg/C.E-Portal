// ====== DOM Ready ======
document.addEventListener('DOMContentLoaded', () => {
  initSearchFilter();
  initTabs();
  initSmoothScroll();
  initCopyButtons();
  initBackToTop();
  initMobileMenu();
  initThemeToggle();
  initLazyLoad();
  initDownloadLinks();
  console.log('✅ CE Portal JS Loaded');
});

// ====== 1. Search + Filter Logic ======
function initSearchFilter() {
  const searchInput = document.getElementById('search');
  const semFilter = document.getElementById('sem');
  const typeFilter = document.getElementById('type');
  const cards = document.querySelectorAll('.card, .list li');

  if (!searchInput && !semFilter && !typeFilter) return;

  function filterCards() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedSem = semFilter ? semFilter.value : 'all';
    const selectedType = typeFilter ? typeFilter.value : 'all';

    let visibleCount = 0;

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const cardSem = card.dataset.sem || 'all';
      const cardType = card.dataset.type || 'all';

      const matchQuery = text.includes(query);
      const matchSem = selectedSem === 'all' || cardSem === selectedSem;
      const matchType = selectedType === 'all' || cardType === selectedType;

      if (matchQuery && matchSem && matchType) {
        card.style.display = '';
        card.classList.add('fade-in');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    showNoResultMessage(visibleCount);
  }

  if (searchInput) searchInput.addEventListener('input', filterCards);
  if (semFilter) semFilter.addEventListener('change', filterCards);
  if (typeFilter) typeFilter.addEventListener('change', filterCards);
}

// ====== 2. No Result Message ======
function showNoResultMessage(count) {
  let noResult = document.getElementById('no-result');
  
  if (count === 0) {
    if (!noResult) {
      noResult = document.createElement('div');
      noResult.id = 'no-result';
      noResult.innerHTML = '<h3>❌ Koi result nahi mila</h3><p>Search term ya filter badal ke dekho</p>';
      const container = document.querySelector('.container');
      if (container) container.appendChild(noResult);
    }
    noResult.style.display = 'block';
  } else if (noResult) {
    noResult.style.display = 'none';
  }
}

// ====== 3. Tab Switching ======
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const tabs = tabContainer.querySelectorAll('.tab');
    const targetId = tabContainer.dataset.target;
    const targetGrid = document.getElementById(targetId);

    if (!targetGrid) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filterValue = tab.dataset.filter;
        const cards = targetGrid.querySelectorAll('.card');

        cards.forEach(card => {
          const cardValue = card.dataset.subject || card.dataset.lang || card.dataset.type;
          if (filterValue === 'all' || cardValue === filterValue) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
}

// ====== 4. Smooth Scroll for Anchor Links ======
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ====== 5. Copy Code Button ======
function initCopyButtons() {
  document.querySelectorAll('.code-block').forEach(block => {
    if (block.querySelector('.copy-btn')) return;
    
    const btn = document.createElement('button');
    btn.innerText = 'Copy';
    btn.className = 'copy-btn';
    btn.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 10px;font-size:12px;background:#38bdf8;color:#0f172a;border:none;border-radius:4px;cursor:pointer;font-weight:bold;';
    
    block.style.position = 'relative';
    block.appendChild(btn);

    btn.addEventListener('click', () => {
      const text = block.innerText.replace('Copy', '').trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = 'Copy', 2000);
      });
    });
  });
}

// ====== 6. Back to Top Button ======
function initBackToTop() {
  if (document.getElementById('back-to-top')) return;
  
  const btn = document.createElement('button');
  btn.innerText = '↑';
  btn.id = 'back-to-top';
  btn.title = 'Back to Top';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:12px 16px;background:#38bdf8;color:#0f172a;border:none;border-radius:50%;font-size:20px;cursor:pointer;display:none;z-index:99;box-shadow:0 4px 12px rgba(56,189,248,0.3);transition:0.3s;';
  
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ====== 7. Mobile Menu Toggle ======
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

// ====== 8. Dark/Light Theme Toggle ======
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  const body = document.body;

  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    themeBtn.innerText = theme === 'light' ? '🌙' : '☀️';
  });

  themeBtn.innerText = body.classList.contains('light-theme') ? '🌙' : '☀️';
}

// ====== 9. Lazy Load Images ======
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  if (images.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  });

  images.forEach(img => observer.observe(img));
}

// ====== 10. Auto Download Attribute for PDFs ======
function initDownloadLinks() {
  document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
    link.setAttribute('download', '');
    link.setAttribute('target', '_blank');
  });
}

// ====== 11. Dynamic Fade In Animation ======
const fadeStyle = document.createElement('style');
fadeStyle.innerHTML = `
  .fade-in {
    animation: fadeIn 0.4s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  #no-result {
    text-align: center;
    padding: 40px;
    color: #94a3b8;
  }

  .light-theme {
    background: #f8fafc;
    color: #1e293b;
  }
  .light-theme .card,
  .light-theme .navbar,
  .light-theme footer,
  .light-theme .list li {
    background: #fff;
    color: #1e293b;
    border-color: #cbd5e1;
  }
  .light-theme h1,
  .light-theme h2,
  .light-theme h3 {
    color: #0f172a;
  }
  .light-theme .code-block {
    background: #f1f5f9;
    color: #334155;
  }
`;
document.head.appendChild(fadeStyle);





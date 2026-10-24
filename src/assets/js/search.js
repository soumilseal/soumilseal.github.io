// Lazy load Pagefind UI when search modal opens
(function () {
  let isPagefindLoaded = false;

  function initPagefind() {
    if (isPagefindLoaded) return;
    const searchContainer = document.getElementById('pagefind-search');
    if (!searchContainer) return;

    const metaPrefix = document.querySelector('meta[name="site-path-prefix"]')?.getAttribute('content') || '/';
    const cleanPrefix = metaPrefix.replace(/\/$/, '');

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${cleanPrefix}/pagefind/pagefind-ui.css`;
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = `${cleanPrefix}/pagefind/pagefind-ui.js`;
    script.onload = () => {
      if (window.PagefindUI) {
        new window.PagefindUI({
          element: '#pagefind-search',
          bundlePath: `${cleanPrefix}/pagefind/`,
          showSubResults: true,
          showImages: false,
          resetStyles: false,
          autofocus: true,
        });
        isPagefindLoaded = true;
      }
    };
    document.body.appendChild(script);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('search-modal');
    if (modal) {
      // Preline overlay event
      modal.addEventListener('open.hs.overlay', () => {
        initPagefind();
      });
    }

    // Direct click trigger fallback
    document.querySelectorAll('[data-hs-overlay="#search-modal"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        initPagefind();
      });
    });
  });
})();

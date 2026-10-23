// Lazy load Pagefind UI when search modal opens
(function () {
  let isPagefindLoaded = false;

  function initPagefind(callback) {
    if (isPagefindLoaded) {
      if (typeof callback === 'function') callback();
      return;
    }

    const searchContainer = document.getElementById('pagefind-search');
    if (!searchContainer) return;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/pagefind/pagefind-ui.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = '/pagefind/pagefind-ui.js';
    script.onload = () => {
      if (window.PagefindUI) {
        window.pagefindInstance = new window.PagefindUI({
          element: '#pagefind-search',
          showSubResults: true,
          showImages: false,
          resetStyles: false,
          autofocus: true,
        });
        isPagefindLoaded = true;
        if (typeof callback === 'function') callback();
      }
    };
    document.body.appendChild(script);
  }

  // Global helper to open search modal with optional search query
  window.openSearchModalWithQuery = function (query) {
    const modalTrigger = document.querySelector('[data-hs-overlay="#search-modal"]');
    if (modalTrigger) {
      modalTrigger.click();
    }
    initPagefind(() => {
      if (query) {
        setTimeout(() => {
          const input = document.querySelector('#pagefind-search input');
          if (input) {
            input.value = query;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.focus();
          }
        }, 200);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('search-modal');
    if (modal) {
      modal.addEventListener('open.hs.overlay', () => {
        initPagefind();
      });
    }

    document.querySelectorAll('[data-hs-overlay="#search-modal"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        initPagefind();
      });
    });
  });
})();

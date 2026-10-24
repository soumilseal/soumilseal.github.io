// Pagefind Search Integration with preloading, focus handling, and error recovery
(function () {
  let isPagefindLoaded = false;
  let isPagefindLoading = false;
  let shouldFocusOnLoad = false;

  function getCleanPrefix() {
    const metaPrefix = document.querySelector('meta[name="site-path-prefix"]')?.getAttribute('content') || '/';
    return metaPrefix.replace(/\/$/, '');
  }

  function focusSearchInput() {
    const searchContainer = document.getElementById('pagefind-search');
    if (!searchContainer) return;
    const input = searchContainer.querySelector('.pagefind-ui__search-input');
    if (input) {
      input.focus();
      if (input.select) input.select();
    }
  }

  function renderError(message) {
    const searchContainer = document.getElementById('pagefind-search');
    if (!searchContainer) return;

    searchContainer.innerHTML = `
      <div class="py-10 text-center font-mono">
        <div class="inline-flex items-center justify-center size-10 border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 mb-3">
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h4 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Search Unavailable</h4>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
          ${message || 'Could not load search index assets. In development, run npm run build:pagefind.'}
        </p>
        <button
          type="button"
          id="pagefind-retry-btn"
          class="mt-4 px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          [ Retry Loading ]
        </button>
      </div>
    `;

    const retryBtn = document.getElementById('pagefind-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isPagefindLoading = false;
        isPagefindLoaded = false;
        initPagefind(true);
      });
    }
  }

  function initPagefind(focusAfterLoad = false) {
    if (focusAfterLoad) {
      shouldFocusOnLoad = true;
    }

    const searchContainer = document.getElementById('pagefind-search');
    if (!searchContainer) return;

    // Check if Pagefind is already loaded or input already exists in the container
    if (isPagefindLoaded || searchContainer.querySelector('.pagefind-ui') || searchContainer.querySelector('.pagefind-ui__search-input')) {
      isPagefindLoaded = true;
      isPagefindLoading = false;
      if (focusAfterLoad) {
        requestAnimationFrame(() => focusSearchInput());
      }
      return;
    }

    if (isPagefindLoading) {
      return;
    }

    isPagefindLoading = true;
    const cleanPrefix = getCleanPrefix();

    // Ensure CSS is loaded once
    if (!document.querySelector('link[data-pagefind-ui-css]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.setAttribute('data-pagefind-ui-css', 'true');
      link.href = `${cleanPrefix}/pagefind/pagefind-ui.css`;
      document.head.appendChild(link);
    }

    function instantiateUI() {
      try {
        if (window.PagefindUI) {
          // If already mounted, avoid duplicate mounting
          if (searchContainer.querySelector('.pagefind-ui') || searchContainer.querySelector('.pagefind-ui__search-input')) {
            isPagefindLoaded = true;
            isPagefindLoading = false;
            if (shouldFocusOnLoad) {
              setTimeout(focusSearchInput, 50);
            }
            return;
          }

          // Clear any skeleton before mount
          searchContainer.innerHTML = '';
          window.__pagefindUIInstance = new window.PagefindUI({
            element: '#pagefind-search',
            bundlePath: `${cleanPrefix}/pagefind/`,
            showSubResults: true,
            showImages: false,
            resetStyles: false,
            autofocus: false, // Explicit focus management avoids overlay race conditions
          });
          isPagefindLoaded = true;
          isPagefindLoading = false;

          if (shouldFocusOnLoad) {
            setTimeout(focusSearchInput, 50);
          }
        } else {
          throw new Error('PagefindUI is not defined on window');
        }
      } catch (err) {
        console.error('[Pagefind] Initialization failed:', err);
        isPagefindLoading = false;
        isPagefindLoaded = false;
        renderError('Pagefind UI could not be initialized: ' + err.message);
      }
    }

    // Check if PagefindUI already globally available
    if (window.PagefindUI) {
      instantiateUI();
      return;
    }

    const existingScript = document.querySelector('script[data-pagefind-ui-js]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.setAttribute('data-pagefind-ui-js', 'true');
    script.src = `${cleanPrefix}/pagefind/pagefind-ui.js`;

    script.onload = () => {
      instantiateUI();
    };

    script.onerror = () => {
      isPagefindLoading = false;
      isPagefindLoaded = false;
      renderError('Unable to load Pagefind search index. If running locally, check that the search index was built.');
    };

    document.body.appendChild(script);
  }

  function setup() {
    const modal = document.getElementById('search-modal');

    // Trigger preload on idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => initPagefind(false));
    } else {
      setTimeout(() => initPagefind(false), 1000);
    }

    // Preload on mouse hover or focus of search triggers
    document.querySelectorAll('[data-hs-overlay="#search-modal"]').forEach((btn) => {
      btn.addEventListener('mouseenter', () => initPagefind(false), { once: true });
      btn.addEventListener('focus', () => initPagefind(false), { once: true });
      btn.addEventListener('click', () => {
        initPagefind(true);
        setTimeout(focusSearchInput, 150);
      });
    });

    if (modal) {
      // Preline overlay open event
      modal.addEventListener('open.hs.overlay', () => {
        initPagefind(true);
        setTimeout(focusSearchInput, 100);
      });

      // MutationObserver as fallback for when Preline modifies modal classes
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && m.attributeName === 'class') {
            const isOpen = modal.classList.contains('open') ||
                           modal.classList.contains('hs-overlay-open') ||
                           !modal.classList.contains('hidden');
            if (isOpen) {
              initPagefind(true);
              setTimeout(focusSearchInput, 100);
            }
          }
        }
      });
      observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

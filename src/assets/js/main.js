// Theme management adhering to Modern Web Guidance & Preline UI
(function () {
  const THEME_KEY = 'hs_theme';
  const COLOR_SCHEME_KEY = 'color-scheme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function disableTransitionsTemporarily() {
    const css = document.createElement('style');
    css.id = 'theme-transition-disable';
    css.textContent = `
      *, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(css);

    return function restore() {
      // Force a synchronous reflow so all DOM elements commit the new theme colors simultaneously
      void document.documentElement.offsetHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById('theme-transition-disable');
          if (el) el.remove();
        });
      });
    };
  }

  function applyTheme(theme, persist = false) {
    const restoreTransitions = disableTransitionsTemporarily();

    const html = document.documentElement;
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    const isDark = theme === 'dark' || (theme === 'auto' && getSystemTheme() === 'dark');

    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    if (metaColorScheme) {
      metaColorScheme.content = theme === 'auto' ? 'light dark' : theme;
    }

    if (persist) {
      if (theme === 'auto') {
        localStorage.removeItem(THEME_KEY);
        localStorage.removeItem(COLOR_SCHEME_KEY);
      } else {
        localStorage.setItem(THEME_KEY, theme);
        localStorage.setItem(COLOR_SCHEME_KEY, theme);
      }
    }

    // Update toggle icons and aria-label
    document.querySelectorAll('[data-hs-theme-click-value]').forEach((btn) => {
      const targetVal = btn.getAttribute('data-hs-theme-click-value');
      const isSelected = (theme === targetVal);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    const simpleToggles = document.querySelectorAll('.theme-toggle-btn');
    simpleToggles.forEach((btn) => {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });

    restoreTransitions();
  }

  window.toggleTheme = function () {
    const currentTheme = localStorage.getItem(THEME_KEY) || getSystemTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  };

  // Listen to OS theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme('auto', false);
    }
  });

  // Sync state across multiple tabs
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY || e.key === COLOR_SCHEME_KEY) {
      const updatedTheme = localStorage.getItem(THEME_KEY) || 'auto';
      applyTheme(updatedTheme, false);
    }
  });

  // DOM ready handlers
  document.addEventListener('DOMContentLoaded', () => {
    // Re-verify theme state
    const savedTheme = localStorage.getItem(THEME_KEY) || 'auto';
    applyTheme(savedTheme, false);

    // Initialize Preline if available
    if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
      window.HSStaticMethods.autoInit();
    }

    // Bind theme toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.toggleTheme();
      });
    });

    // Code block copy buttons
    document.querySelectorAll('.prose pre').forEach((pre) => {
      // Don't add twice
      if (pre.querySelector('.code-copy-btn')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'relative group';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const copyBtn = document.createElement('button');
      copyBtn.className =
        'code-copy-btn absolute top-3 right-3 px-2 py-1 text-xs bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity border border-neutral-700 flex items-center gap-1';
      copyBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText;
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = `
            <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            <span class="text-emerald-400">Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code: ', err);
        }
      });

      wrapper.appendChild(copyBtn);
    });

    // Global keyboard shortcut: Ctrl+K or / to open search modal
    document.addEventListener('keydown', (e) => {
      if (
        (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName))
      ) {
        e.preventDefault();
        const searchModalTrigger = document.querySelector('[data-hs-overlay="#search-modal"]');
        if (searchModalTrigger) {
          searchModalTrigger.click();
        }
      }
    });

    // Initialize Programming Languages GSAP Infinite Scroll Ticker
    function initLanguagesTicker() {
      const tickerTrack = document.getElementById('languages-ticker-track');
      const tickerWrapper = document.getElementById('languages-ticker-wrapper');

      if (!tickerTrack || !tickerWrapper) return;
      if (typeof window.gsap === 'undefined') {
        setTimeout(initLanguagesTicker, 50);
        return;
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const duration = parseFloat(tickerTrack.dataset.speed) || 32;
      const loopTween = window.gsap.to(tickerTrack, {
        xPercent: -50,
        repeat: -1,
        duration: duration,
        ease: 'none',
      });

      tickerWrapper.addEventListener('mouseenter', () => loopTween.pause());
      tickerWrapper.addEventListener('mouseleave', () => loopTween.play());
      tickerWrapper.addEventListener('touchstart', () => loopTween.pause(), { passive: true });
      tickerWrapper.addEventListener('touchend', () => loopTween.play(), { passive: true });
    }

    initLanguagesTicker();

    // Universal Contact Form submission handler (Home & Contact pages)
    document.querySelectorAll('.contact-dispatch-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        const action = form.getAttribute('action');
        if (action && action.trim() !== '') {
          return; // Let standard form submission occur if an action URL is defined
        }
        e.preventDefault();
        const feedback = form.querySelector('.form-feedback') || form.nextElementSibling;
        const nameInput = form.querySelector('input[name="name"]');
        const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'there';

        if (feedback) {
          feedback.className =
            'form-feedback p-3.5 text-xs font-mono bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/80 my-3 block';
          feedback.innerHTML =
            `Thank you <strong>${name}</strong>! Your message payload has been recorded. You can also connect directly via LinkedIn or GitHub below.`;
          feedback.classList.remove('hidden');
        }
        form.reset();
      });
    });
  });
})();

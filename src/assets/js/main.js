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

  // Initialize Code Blocks with Technical Headers and Copy Triggers
  function initCodeBlocks() {
    document.querySelectorAll('.prose pre, pre[class*="language-"]').forEach((pre) => {
      if (pre.dataset.hasCopyHeader || pre.closest('.code-block-wrapper')) return;
      pre.dataset.hasCopyHeader = 'true';

      const langMatch =
        pre.className.match(/language-([a-z0-9_+-]+)/i) ||
        pre.querySelector('code')?.className.match(/language-([a-z0-9_+-]+)/i);
      let rawLang = langMatch ? langMatch[1].toLowerCase() : 'code';
      const langNames = {
        js: 'javascript',
        ts: 'typescript',
        sh: 'bash',
        py: 'python',
        yml: 'yaml',
        html: 'html',
        css: 'css',
        json: 'json',
        go: 'golang',
        md: 'markdown',
        text: 'plaintext'
      };
      const displayLang = (langNames[rawLang] || rawLang).toUpperCase();

      const wrapper = document.createElement('div');
      wrapper.className =
        'code-block-wrapper my-6 border border-neutral-300 dark:border-neutral-800 bg-neutral-950 overflow-hidden relative';

      const header = document.createElement('div');
      header.className =
        'code-block-header px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs font-mono select-none';

      // Technical Square Marker (Strictly no dots) + Language Label
      const langLabel = document.createElement('div');
      langLabel.className = 'flex items-center gap-2 text-neutral-400';
      langLabel.innerHTML = `
        <span class="w-2 h-2 bg-primary-500 inline-block" aria-hidden="true"></span>
        <span class="uppercase tracking-wider font-semibold text-[11px] text-neutral-300">${displayLang}</span>
      `;

      // Copy Button with Phosphor SVG icon
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className =
        'code-copy-btn inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors cursor-pointer focus:outline-none';
      copyBtn.setAttribute('aria-label', `Copy ${displayLang} code`);
      copyBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
          <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/>
        </svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener('click', async () => {
        const codeElement = pre.querySelector('code');
        const codeText = codeElement ? codeElement.innerText : pre.innerText;
        try {
          await navigator.clipboard.writeText(codeText);
          copyBtn.innerHTML = `
            <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
            </svg>
            <span class="text-emerald-400 font-semibold">Copied!</span>
          `;
          copyBtn.classList.add('border-emerald-500/50');
          setTimeout(() => {
            copyBtn.innerHTML = `
              <svg class="w-3.5 h-3.5" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/>
              </svg>
              <span>Copy</span>
            `;
            copyBtn.classList.remove('border-emerald-500/50');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code: ', err);
        }
      });

      header.appendChild(langLabel);
      header.appendChild(copyBtn);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  // DOM ready handlers
  const onReady = () => {
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

    // Initialize code blocks
    initCodeBlocks();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

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
})();

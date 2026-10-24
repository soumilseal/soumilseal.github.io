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

  // Interactive Background Grid Cursor Trail (Starts strictly below the navbar)
  function initBackgroundGridTrail() {
    const container = document.getElementById('bg-grid-container');
    const canvas = document.getElementById('bg-grid-canvas');
    const header = document.getElementById('site-header');

    if (!container || !canvas || !header) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CELL_SIZE = 32;
    const TRAIL_DURATION = 750; // ms

    let width = 0;
    let height = 0;
    let dpr = 1;
    let offsetX = 0;
    let animId = null;
    let isRunning = false;
    let lastPos = null;

    // Active illuminated cells map: key = `${col},${row}`
    const activeCells = new Map();

    function getHeaderBottom() {
      const rect = header.getBoundingClientRect();
      const bottom = Math.max(0, Math.round(rect.bottom));
      container.style.setProperty('--header-bottom', `${bottom}px`);
      return bottom;
    }

    function resize() {
      const headerBottom = getHeaderBottom();
      const rect = container.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      // Align vertical grid lines with the central 950px bento container
      const containerWidth = Math.min(950, width);
      const containerLeft = Math.max(0, (width - containerWidth) / 2);
      offsetX = Math.round(containerLeft % CELL_SIZE);
      container.style.setProperty('--grid-offset-x', `${offsetX}px`);

      // Clear the CSS static background image now that the canvas handles synced rendering
      container.style.backgroundImage = 'none';

      render(true);
    }

    function addCell(canvasX, canvasY, baseIntensity = 1.0) {
      if (canvasY < 0 || canvasY >= height || canvasX < 0 || canvasX >= width) return;
      const col = Math.floor((canvasX - offsetX) / CELL_SIZE);
      const row = Math.floor(canvasY / CELL_SIZE);
      const key = `${col},${row}`;

      activeCells.set(key, {
        x: offsetX + col * CELL_SIZE,
        y: row * CELL_SIZE,
        born: performance.now(),
        intensity: baseIntensity,
        life: TRAIL_DURATION,
      });

      // Subtle ambient glow on 4 orthogonal neighbor cells
      if (baseIntensity >= 0.8) {
        const neighbors = [
          { c: col + 1, r: row },
          { c: col - 1, r: row },
          { c: col, r: row + 1 },
          { c: col, r: row - 1 },
        ];
        neighbors.forEach((n) => {
          if (n.r >= 0) {
            const nKey = `${n.c},${n.r}`;
            if (!activeCells.has(nKey)) {
              activeCells.set(nKey, {
                x: offsetX + n.c * CELL_SIZE,
                y: n.r * CELL_SIZE,
                born: performance.now(),
                intensity: 0.35,
                life: TRAIL_DURATION * 0.8,
              });
            }
          }
        });
      }
    }

    function render(forceRedraw = false) {
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');

      // 1. Draw static grid lines (starting from y = 0, flush below the navbar)
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';

      ctx.beginPath();
      // Vertical grid lines
      for (let x = offsetX; x <= width; x += CELL_SIZE) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      // Horizontal grid lines (row 0 starts flush at y=0 below the navbar)
      for (let y = 0; y <= height; y += CELL_SIZE) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // 2. Draw active glowing grid trail boxes
      const now = performance.now();
      let hasActive = false;

      for (const [key, cell] of activeCells.entries()) {
        const elapsed = now - cell.born;
        if (elapsed >= cell.life) {
          activeCells.delete(key);
          continue;
        }

        hasActive = true;
        const progress = elapsed / cell.life;
        const alpha = Math.max(0, 1 - Math.pow(progress, 0.75)) * cell.intensity;

        if (isDark) {
          // Dark Mode: Electric Cyan/Blue Cyber Grid Highlight
          ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.22})`;
          ctx.fillRect(cell.x + 1, cell.y + 1, CELL_SIZE - 1, CELL_SIZE - 1);

          ctx.strokeStyle = `rgba(96, 165, 250, ${alpha * 0.7})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);

          // Technical Corner Squares (strictly square, NO circular dots)
          const cSize = 3;
          ctx.fillStyle = `rgba(147, 197, 253, ${alpha * 0.95})`;
          ctx.fillRect(cell.x, cell.y, cSize, cSize);
          ctx.fillRect(cell.x + CELL_SIZE - cSize, cell.y, cSize, cSize);
          ctx.fillRect(cell.x, cell.y + CELL_SIZE - cSize, cSize, cSize);
          ctx.fillRect(cell.x + CELL_SIZE - cSize, cell.y + CELL_SIZE - cSize, cSize, cSize);
        } else {
          // Light Mode: Technical Blueprint Cobalt Highlight
          ctx.fillStyle = `rgba(37, 99, 235, ${alpha * 0.12})`;
          ctx.fillRect(cell.x + 1, cell.y + 1, CELL_SIZE - 1, CELL_SIZE - 1);

          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cell.x + 0.5, cell.y + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);

          // Technical Corner Squares
          const cSize = 3;
          ctx.fillStyle = `rgba(37, 99, 235, ${alpha * 0.85})`;
          ctx.fillRect(cell.x, cell.y, cSize, cSize);
          ctx.fillRect(cell.x + CELL_SIZE - cSize, cell.y, cSize, cSize);
          ctx.fillRect(cell.x, cell.y + CELL_SIZE - cSize, cSize, cSize);
          ctx.fillRect(cell.x + CELL_SIZE - cSize, cell.y + CELL_SIZE - cSize, cSize, cSize);
        }
      }

      ctx.restore();

      if (hasActive) {
        animId = requestAnimationFrame(() => render());
        isRunning = true;
      } else {
        isRunning = false;
        animId = null;
      }
    }

    function startLoop() {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(() => render());
      }
    }

    function onMouseMove(e) {
      const headerBottom = getHeaderBottom();
      const canvasY = e.clientY - headerBottom;
      const canvasX = e.clientX;

      // Only interact with grid boxes that are below the navbar
      if (canvasY < 0) {
        lastPos = null;
        return;
      }

      if (lastPos) {
        // Interpolate points between rapid mouse moves so fast sweeps don't skip grid boxes
        const dist = Math.hypot(canvasX - lastPos.x, canvasY - lastPos.y);
        const steps = Math.max(1, Math.min(10, Math.floor(dist / (CELL_SIZE / 2))));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          addCell(lastPos.x + (canvasX - lastPos.x) * t, lastPos.y + (canvasY - lastPos.y) * t, 1.0);
        }
      } else {
        addCell(canvasX, canvasY, 1.0);
      }

      lastPos = { x: canvasX, y: canvasY };
      startLoop();
    }

    function onMouseLeave() {
      lastPos = null;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', getHeaderBottom, { passive: true });

    // Dynamic header height tracking via ResizeObserver
    const observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(header);

    // Watch dark/light theme switch to redraw grid colors instantly
    const themeObserver = new MutationObserver(() => {
      render(true);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Initial setup
    resize();
  }

  initBackgroundGridTrail();
})();

const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const pluginTOC = require('eleventy-plugin-toc');
const Image = require('@11ty/eleventy-img');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const { EleventyHtmlBasePlugin } = require('@11ty/eleventy');

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'nav',
    wrapperClass: 'toc font-mono text-xs',
    ul: true,
    flat: false,
  });

  // Responsive Image Shortcode via @11ty/eleventy-img
  eleventyConfig.addAsyncShortcode('image', async function (src, alt, sizes = '100vw', className = '') {
    if (!src) return '';
    let inputPath = src;
    if (src.startsWith('/')) {
      inputPath = path.join(__dirname, 'src', src);
    }
    if (!fs.existsSync(inputPath)) {
      return `<img src="${src}" alt="${alt || ''}" class="${className}" loading="lazy" decoding="async">`;
    }
    try {
      const metadata = await Image(inputPath, {
        widths: [600, 1000, 1400],
        formats: ['avif', 'webp', 'jpeg'],
        outputDir: './_site/assets/images/optimized/',
        urlPath: '/assets/images/optimized/',
      });
      return Image.generateHTML(metadata, {
        alt: alt || '',
        sizes,
        loading: 'lazy',
        decoding: 'async',
        class: className,
      });
    } catch {
      return `<img src="${src}" alt="${alt || ''}" class="${className}" loading="lazy" decoding="async">`;
    }
  });

  // Passthrough File Copy
  eleventyConfig.addPassthroughCopy({ 'src/assets/js': 'assets/js' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/images': 'assets/images' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/preline/dist/preline.js': 'assets/js/preline.js',
  });
  eleventyConfig.addPassthroughCopy({
    'node_modules/gsap/dist/gsap.min.js': 'assets/js/gsap.min.js',
  });
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon.ico': 'favicon.ico' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon.svg': 'favicon.svg' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon-32x32.png': 'favicon-32x32.png' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon-16x16.png': 'favicon-16x16.png' });
  eleventyConfig.addPassthroughCopy({ 'src/apple-touch-icon.png': 'apple-touch-icon.png' });

  // Watch targets
  eleventyConfig.addWatchTarget('./src/assets/css/');
  eleventyConfig.addWatchTarget('./src/assets/js/');

  // Markdown Configuration
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      symbol: '#',
      placement: 'after',
      class: 'header-anchor',
    }),
    level: [2, 3, 4],
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s+~]/g, '-')
        .replace(/[.?+=&:#%!/,_]/g, '')
        .replace(/-+/g, '-'),
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  // Filters
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLLL dd, yyyy');
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('currentYear', () => {
    return new Date().getFullYear();
  });

  eleventyConfig.addFilter('readingTime', (content) => {
    if (!content) return '1 min read';
    const clean = content.replace(/<\/?[^>]+(>|$)/g, '');
    const words = clean.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addFilter('filterTagList', (tags) => {
    return (tags || []).filter(
      (tag) => !['all', 'nav', 'post', 'posts'].includes(tag)
    );
  });

  // WebP Image Path Resolver Filter
  eleventyConfig.addFilter('webp', (imgSrc) => {
    if (!imgSrc || typeof imgSrc !== 'string') return imgSrc;
    const ext = path.extname(imgSrc).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const webpCandidate = imgSrc.slice(0, -ext.length) + '.webp';
      const diskPath = path.join(__dirname, 'src', webpCandidate);
      if (fs.existsSync(diskPath)) {
        return webpCandidate;
      }
    }
    return imgSrc;
  });

  // Phosphor Icons Loader & Filter
  const phosphorCache = new Map();
  const phosphorAliases = {
    'sun': 'sun',
    'moon': 'moon',
    'moon-stars': 'moon-stars',
    'search': 'magnifying-glass',
    'github': 'github-logo',
    'linkedin': 'linkedin-logo',
    'twitter': 'x-logo',
    'twitter-x': 'x-logo',
    'twitter-logo': 'x-logo',
    'rss': 'rss',
    'mail': 'envelope',
    'envelope': 'envelope',
    'external-link': 'arrow-square-out',
    'box-arrow-up-right': 'arrow-square-out',
    'calendar': 'calendar',
    'calendar3': 'calendar',
    'clock': 'clock',
    'tag': 'tag',
    'arrow-right': 'arrow-right',
    'arrow-left': 'arrow-left',
    'arrow-up-right': 'arrow-up-right',
    'arrow-ne': 'arrow-up-right',
    'arrow-up': 'arrow-up',
    'arrow-down': 'arrow-down',
    'menu': 'list',
    'list': 'list',
    'x': 'x',
    'x-lg': 'x',
    'close': 'x',
    'code': 'code',
    'code-slash': 'code',
    'folder': 'folder',
    'folder2': 'folder',
    'terminal': 'terminal',
    'cpu': 'cpu',
    'layers': 'stack',
    'check': 'check',
    'check2': 'check',
    'journal-text': 'article',
    'journal': 'article',
    'copy': 'copy'
  };

  function renderPhosphorIcon(name, className = 'w-5 h-5', weight = 'regular') {
    const iconName = phosphorAliases[name] || name;
    const cacheKey = `${weight}:${iconName}:${className}`;
    if (phosphorCache.has(cacheKey)) {
      return phosphorCache.get(cacheKey);
    }

    const validWeights = ['regular', 'bold', 'duotone', 'fill', 'light', 'thin'];
    const chosenWeight = validWeights.includes(weight) ? weight : 'regular';
    const filePath = path.join(__dirname, 'node_modules/@phosphor-icons/core/assets', chosenWeight, `${iconName}.svg`);

    let svg = '';
    if (fs.existsSync(filePath)) {
      svg = fs.readFileSync(filePath, 'utf8').trim();
      svg = svg.replace('<svg ', `<svg class="${className}" aria-hidden="true" `);
    } else {
      // Fallback: technical square icon (no circles, strict rule)
      svg = `<svg class="${className}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><rect x="48" y="48" width="160" height="160" fill="none" stroke="currentColor" stroke-width="16"/></svg>`;
    }

    phosphorCache.set(cacheKey, svg);
    return svg;
  }

  eleventyConfig.addFilter('phosphor', (name, className, weight) => {
    return renderPhosphorIcon(name, className, weight);
  });

  eleventyConfig.addShortcode('phosphor', (name, className, weight) => {
    return renderPhosphorIcon(name, className, weight);
  });

  // Previous & Next Post Navigation Filters
  eleventyConfig.addFilter('getPrevPost', (currentUrl, collection) => {
    if (!collection || !currentUrl) return null;
    const idx = collection.findIndex((item) => item.url === currentUrl);
    return idx !== -1 && idx + 1 < collection.length ? collection[idx + 1] : null;
  });

  eleventyConfig.addFilter('getNextPost', (currentUrl, collection) => {
    if (!collection || !currentUrl) return null;
    const idx = collection.findIndex((item) => item.url === currentUrl);
    return idx > 0 ? collection[idx - 1] : null;
  });

  // Automatically optimize and convert uploaded images to WebP before building
  eleventyConfig.on('eleventy.before', async () => {
    try {
      const { optimizeImages } = require('./scripts/optimize-images');
      await optimizeImages();
    } catch (err) {
      console.warn('[eleventy.before] Image optimization notice:', err.message);
    }
  });

  // Collections
  const isProd = process.env.NODE_ENV === 'production';

  eleventyConfig.addCollection('posts', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('./src/posts/*.md')
      .filter((item) => (isProd ? !item.data.draft : true))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection('featuredPosts', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('./src/posts/*.md')
      .filter((item) => (isProd ? !item.data.draft : true))
      .filter((item) => item.data.featured === true)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection('projects', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('./src/projects/*.md')
      .filter((item) => (isProd ? !item.data.draft : true))
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99) || b.date - a.date);
  });

  eleventyConfig.addCollection('featuredProjects', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('./src/projects/*.md')
      .filter((item) => (isProd ? !item.data.draft : true))
      .filter((item) => item.data.featured === true)
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99) || b.date - a.date);
  });

  // Paged collections that always guarantee at least 1 page (so /blog/ and /projects/ always generate)
  eleventyConfig.addCollection('pagedBlogPosts', (collectionApi) => {
    const posts = collectionApi
      .getFilteredByGlob('./src/posts/*.md')
      .filter((item) => (isProd ? !item.data.draft : true))
      .sort((a, b) => b.date - a.date);
    if (posts.length === 0) {
      return [{ isEmpty: true, posts: [] }];
    }
    const chunks = [];
    for (let i = 0; i < posts.length; i += 4) {
      chunks.push({ isEmpty: false, posts: posts.slice(i, i + 4) });
    }
    return chunks;
  });

  eleventyConfig.addCollection('pagedProjectList', (collectionApi) => {
    const list = collectionApi
      .getFilteredByGlob('./src/projects/*.md')
      .filter((item) => (isProd ? !item.data.draft : true))
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99) || b.date - a.date);
    if (list.length === 0) {
      return [{ isEmpty: true, projects: [] }];
    }
    const chunks = [];
    for (let i = 0; i < list.length; i += 6) {
      chunks.push({ isEmpty: false, projects: list.slice(i, i + 6) });
    }
    return chunks;
  });

  eleventyConfig.addCollection('tagList', (collectionApi) => {
    const tagSet = new Set();
    collectionApi
      .getFilteredByGlob('./src/posts/*.md')
      .filter((item) => (isProd ? !item.data.draft : true))
      .forEach((item) => {
        if ('tags' in item.data) {
          let tags = item.data.tags;
          if (typeof tags === 'string') {
            tags = [tags];
          }
          tags = tags.filter((tag) => !['all', 'nav', 'post', 'posts'].includes(tag));
          for (const tag of tags) {
            tagSet.add(tag);
          }
        }
      });
    return [...tagSet].sort();
  });

  // Build Pagefind search index automatically after Eleventy finishes writing output
  eleventyConfig.on('eleventy.after', async () => {
    try {
      const { execSync } = require('child_process');
      execSync('npx pagefind --site _site', { stdio: 'inherit' });
    } catch (err) {
      console.warn('[Pagefind] Search index generation error:', err.message);
    }
  });

  let pathPrefix = process.env.ELEVENTY_PATH_PREFIX || '/';
  if (pathPrefix && pathPrefix !== '/') {
    if (!pathPrefix.startsWith('/')) pathPrefix = '/' + pathPrefix;
    if (!pathPrefix.endsWith('/')) pathPrefix = pathPrefix + '/';
  }

  return {
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    pathPrefix,
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};

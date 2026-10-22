const { DateTime } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Passthrough File Copy
  eleventyConfig.addPassthroughCopy({ 'src/assets/js': 'assets/js' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/images': 'assets/images' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/preline/dist/preline.js': 'assets/js/preline.js',
  });
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });

  // Watch targets
  eleventyConfig.addWatchTarget('./src/assets/css/');
  eleventyConfig.addWatchTarget('./src/assets/js/');

  // Markdown Configuration
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
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

  return {
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};

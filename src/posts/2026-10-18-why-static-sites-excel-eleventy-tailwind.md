---
title: "Why Static Sites Still Win: Building Fast, Minimal Portfolios with Eleventy and Tailwind"
description: "Rejecting unnecessary JavaScript bloat in favor of instant page loads, zero client runtime dependencies, and effortless static hosting."
date: 2026-10-18
tags:
  - posts
  - web
  - eleventy
  - css
featured: true
layout: layouts/post.njk
---

In modern frontend web development, it has become standard practice to reach for full-stack JavaScript frameworks—Next.js, Remix, Astro, or complex client-side single page applications (SPAs)—even for simple personal portfolios, documentation hubs, and blogs.

While dynamic server-side rendering (SSR) and client-side hydrations are indispensable for interactive SaaS applications, using them for editorial content introduces severe tradeoffs: client hydration overhead, security surface area, and complex hosting requirements.

This portfolio and blog is built on a simpler, battle-tested philosophy: **pure static site generation with Eleventy (11ty), Tailwind CSS, and vanilla JavaScript.**

## The Hidden Cost of Client-Side Hydration

When a user visits a typical SPA-driven blog:
1. The server renders the initial HTML.
2. The browser downloads several hundred kilobytes of JavaScript bundles.
3. The JavaScript executes, recreating the Virtual DOM and attaching event listeners (hydration).
4. The page becomes truly interactive, often after noticeable CPU churn and input latency (INP).

For a blog post consisting of paragraphs, headings, code snippets, and images, 95% of the page is completely static. Downloading and executing a massive JavaScript framework to display text is an inefficient use of client computing power and battery.

## The Eleventy Architecture

Eleventy (11ty) takes an uncompromisingly clean approach:
- **Zero client-side JavaScript by default:** Your templates (Nunjucks, Liquid, Markdown) compile strictly to clean, semantic HTML and CSS at build time.
- **Instant TTFB & Global CDN Distribution:** Because the build produces flat static files, they can be deployed directly to Cloudflare Pages, GitHub Pages, or Netlify with infinite scalability and virtually zero hosting costs.
- **True Content Independence:** Content lives in plain Markdown files with front matter. If I ever decide to change tools five years from now, my content remains standard, portable Markdown.

```text
src/
├── _data/          # Structured site data & collections
├── _includes/      # Reusable Nunjucks layouts & macros
├── posts/          # Plain Markdown blog articles
└── assets/         # Pure CSS and progressive enhancement JS
```

## Progressive Enhancement with Preline UI and Pagefind

Minimalism does not mean sacrificing modern UX. By applying **progressive enhancement**, we achieve modern interactivity without framework bloat:

- **Tailwind CSS v4:** Provides utility-first styling with zero runtime cost, fully compiling to optimized static CSS.
- **Preline UI & Vanilla JS:** Handles accessible UI components (collapsible mobile menus, modals, and persistent dark mode toggles) using lightweight vanilla JavaScript.
- **Pagefind Static Search:** Rather than connecting to an external search API or running an Elasticsearch cluster, Pagefind builds a lightweight, chunked WebAssembly static search index over the compiled HTML files directly.

## Performance Verification

The result is instant page navigation, perfect Core Web Vitals (sub-50ms Largest Contentful Paint, zero cumulative layout shift), and complete accessibility for all devices and network conditions.

Sometimes, the most sophisticated architectural decision is knowing what *not* to include.

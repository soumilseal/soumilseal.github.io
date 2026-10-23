# Soumil Seal — Engineering Portfolio & Editorial Publication

> A minimalist, high-performance developer portfolio and technical blog built with **Eleventy 3.x**, **Tailwind CSS v4**, **GSAP**, **Pagefind**, and headless content management via **Pages CMS**.

---

## ⚡ Architecture & Design Philosophy

This portfolio is engineered like a precision technical blueprint rather than a generic marketing template:

- **Strict 8pt Grid System**: Layout boundaries align to an 8pt spatial grid with contiguous, zero-margin border dividers (`border-neutral-300 dark:border-neutral-800`).
- **Contiguous Bento Layouts**: Multi-column responsive bento cells that cleanly divide into 1-column layouts on mobile and 12-column / 3-column split grids on desktop.
- **Infinite GSAP Marquee**: Smooth, hardware-accelerated continuous infinite scroll for technical competencies, powered by GSAP.
- **Instant Client-Side Search**: Fully offline search index compiled at build time by [Pagefind](https://pagefind.app/), accessible globally via `<kbd>Ctrl</kbd> + <kbd>K</kbd>`.
- **Pages CMS Headless Integration**: Every piece of content—from hero headlines and live metrics to resume credentials and blog articles—is managed through a visual GUI at [pagescms.org](https://pagescms.org) without touching code.
- **Accessible & Fast**: 100% static HTML delivery, zero tracking bloat, full keyboard navigation, ARIA semantics, and dark/light mode toggle with `localStorage` persistence.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Static Site Generator** | [Eleventy v3.1](https://www.11ty.dev/) | Ultra-fast templating with Nunjucks and Markdown parsing |
| **CSS & Design System** | [Tailwind CSS v4.3](https://tailwindcss.com/) | Cutting-edge CSS compilation, custom theme tokens, typography |
| **Motion & Animation** | [GSAP v3.15](https://gsap.com/) | Continuous marquee ticker and micro-animations |
| **Full-Text Search** | [Pagefind v1.5](https://pagefind.app/) | Low-bandwidth static search indexing with instant modal UI |
| **Content Management** | [Pages CMS](https://pagescms.org/) | Headless, Git-based CMS configured via `.pages.yml` |
| **Icons & Vectors** | Inline SVG & Preline / Bootstrap | Scalable vector icons with zero render blocking |
| **Syndication & SEO** | RSS / Atom & Sitemap XML | Automatic feed generation and canonical SEO tags |

---

## 📁 Repository Structure

```
soumilseal/
├── .pages.yml                  # Pages CMS content models & editing schema
├── .eleventy.js                # Eleventy configuration, plugins & custom filters
├── package.json                # NPM scripts and dependencies
├── README.md                   # Primary project documentation
├── docs/                       # Comprehensive documentation
│   ├── ADMIN_GUIDE.md          # Step-by-step content editor guide for Pages CMS
│   └── ARCHITECTURE.md         # Deep-dive engineering & styling documentation
├── src/
│   ├── _data/                  # Global structured data files (Pages CMS targets)
│   │   ├── site.json           # Site metadata, navigation, ticker, footer
│   │   ├── home.json           # Homepage hero, bento stats, marquee, headers
│   │   ├── about.json          # About story narrative, skills, education
│   │   ├── resume.json         # Executive summary, proficiencies, credentials
│   │   ├── contact.json        # Communication channels, form labels & actions
│   │   └── projects.json       # Array of software projects and highlights
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk        # Root HTML envelope, meta tags, theme script
│   │   │   ├── page.njk        # Standard single page container layout
│   │   │   └── post.njk        # Editorial blog post article layout
│   │   └── components/
│   │       ├── header.njk      # Sticky top navbar with active route indicator
│   │       ├── footer.njk      # Contiguous bottom metadata and links
│   │       ├── ticker-banner.njk # Dismissible terminal status banner
│   │       ├── project-card.njk# Bento project showcase card
│   │       ├── post-card.njk   # Editorial article listing row
│   │       ├── pagination.njk  # Universal grid pagination component
│   │       ├── search-modal.njk# Pagefind search overlay dialog
│   │       └── icons.njk       # Centralized vector icon macro library
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css        # Tailwind CSS entrypoint with custom tokens
│   │   └── images/             # Uploaded cover exhibits, project screenshots
│   ├── posts/                  # Markdown editorial blog posts
│   ├── index.njk               # Homepage template
│   ├── about.njk               # About page template
│   ├── projects.njk            # Paginated projects directory template
│   ├── blog.njk                # Paginated articles archive template
│   ├── resume.njk              # Printable resume sheet template
│   ├── contact.njk             # Interactive contact template
│   ├── tags.njk                # Dynamic tag taxonomy template
│   ├── feed.njk                # RSS / Atom XML feed template
│   └── sitemap.njk             # Search engine XML sitemap template
```

---

## 🚀 Quick Start & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **NPM**: v9.0.0 or later

### Installation
```bash
# Clone the repository
git clone https://github.com/soumilseal/soumilseal.git
cd soumilseal

# Install dependencies
npm install
```

### Development Server
Run Eleventy and Tailwind in watch mode concurrently:
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser. Live reloading is automatically enabled.

### Production Build
To create an optimized production build (Eleventy + Tailwind minified + Pagefind search index):
```bash
npm run build
```
The compiled, deployable static site will be generated in `./_site/`.

---

## 📝 Content Management via Pages CMS

This repository is configured with a complete **Pages CMS** (`.pages.yml`) schema. Pages CMS is an open-source, Git-based content management system that operates directly on your GitHub repository with no database or server required.

### How to Access the CMS:
1. Navigate to **[pagescms.org](https://pagescms.org/)**.
2. Sign in with your **GitHub account**.
3. Select this repository (`soumilseal/soumilseal`) and your target branch (`main`).
4. You will see dedicated editing dashboards for:
   - 📝 **Blog Posts**: Create, edit, draft, and publish technical articles.
   - 💼 **Projects Showcase**: Add new projects, upload screenshots, specify tech tags and demo links.
   - 🏠 **Home Page**: Edit hero copy, availability pill, live metric values, principles, and section titles.
   - 👤 **About Page**: Update avatar image, biographical story paragraphs, and skill categories.
   - 📄 **Resume Page**: Adjust summary, technical proficiencies, education coursework, and printable settings.
   - 📬 **Contact Page**: Update contact email, message form labels, and action webhook URL.
   - ⚙️ **Site Settings & Navigation**: Edit site metadata, top dismissible ticker, footer text, and header links.

*For detailed instructions on editing each field, consult the [docs/ADMIN_GUIDE.md](file:///c:/Users/amite/Development/Experiments/soumilseal/docs/ADMIN_GUIDE.md).*

---

## 🌐 Deploying to Production

Because the output in `_site/` is 100% static HTML, CSS, and JS, this site can be hosted anywhere for free:

### 1. Cloudflare Pages (Recommended)
- **Framework preset**: None
- **Build command**: `npm run build`
- **Build output directory**: `_site`
- **Environment variables**: `NODE_VERSION=20`

### 2. Vercel
- **Framework preset**: Other
- **Build command**: `npm run build`
- **Output directory**: `_site`

### 3. Netlify
- **Build command**: `npm run build`
- **Publish directory**: `_site`

### 4. GitHub Pages
Add a `.github/workflows/deploy.yml` GitHub Actions workflow to run `npm run build` and deploy the `_site` artifact to GitHub Pages on push to `main`.

---

## 📄 License

This project is licensed under the [MIT License](file:///c:/Users/amite/Development/Experiments/soumilseal/package.json).
Design and content © 2026 [Soumil Seal](https://soumilseal.dev).

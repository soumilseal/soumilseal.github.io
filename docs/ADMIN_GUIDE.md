# Content Administrator & Editor Guide

> A non-technical reference guide for managing, updating, and publishing all content across the portfolio and blog using **Pages CMS** ([pagescms.org](https://pagescms.org)).

---

## 📑 Table of Contents
1. [Introduction to Pages CMS](#1-introduction-to-pages-cms)
2. [Connecting Your Repository](#2-connecting-your-repository)
3. [Managing Blog Posts](#3-managing-blog-posts)
4. [Managing the Projects Showcase](#4-managing-the-projects-showcase)
5. [Customizing the Home Page](#5-customizing-the-home-page)
6. [Updating the About Page](#6-updating-the-about-page)
7. [Editing the Resume & Credentials](#7-editing-the-resume--credentials)
8. [Configuring the Contact Page](#8-configuring-the-contact-page)
9. [Global Site Settings, Ticker & Navigation](#9-global-site-settings-ticker--navigation)
10. [Media & Image Uploads](#10-media--image-uploads)
11. [Publishing Workflow & Automatic Builds](#11-publishing-workflow--automatic-builds)

---

## 1. Introduction to Pages CMS

**Pages CMS** is a modern, web-based content management dashboard that connects directly to your GitHub repository. It reads the `.pages.yml` schema file in this repository and turns all your data files, pages, and blog articles into an intuitive, user-friendly editor interface.

- **Zero Database Required**: All changes are committed directly into your Git repository as clean JSON or Markdown files.
- **Immediate Live Previews**: Whenever you save a change in Pages CMS, your hosting provider (Cloudflare Pages, Vercel, or Netlify) automatically detects the commit, rebuilds the site, and deploys the updates within seconds.
- **Safe & Structured**: Form fields, toggles, dropdowns, and date pickers prevent syntax errors and protect the site's layout.

---

## 2. Connecting Your Repository

1. Open your web browser and navigate to **[https://pagescms.org](https://pagescms.org)**.
2. Click **Sign in with GitHub** and authorize Pages CMS to access your repositories.
3. In the repository selection list, choose **`soumilseal/soumilseal`**.
4. Select the target branch (typically `main`).
5. You are now inside the admin dashboard. The left sidebar displays all editable sections:
   - **Blog Posts**
   - **Projects Showcase**
   - **Home Page**
   - **About Page**
   - **Resume Page**
   - **Contact Page**
   - **Site Settings & Navigation**

---

## 3. Managing Blog Posts

### Creating a New Article
1. In the sidebar, click on **Blog Posts**.
2. Click **+ New item**.
3. Fill in the following fields:
   - **Title**: The main headline of the post (e.g. `Understanding Concurrency in Go`).
   - **Short Description / Excerpt**: 1–2 sentences summarizing the article. This appears on social share cards and post listing rows.
   - **Publication Date**: Choose the date you want displayed on the post.
   - **Last Updated Date** *(Optional)*: Set if revising an older article.
   - **Tags & Categories**: Add topic badges (e.g. `go`, `systems`, `concurrency`). These automatically generate tag archive pages.
   - **Cover / Preview Image**: Upload a high-resolution banner image.
   - **Featured on Homepage**: Toggle **ON** to pin this article to the top of the homepage feed.
   - **Draft (Hide from production)**: Toggle **ON** to keep the article hidden until you are ready to publish.
   - **Article Body Content**: Write in rich text or standard Markdown. Supports code syntax blocks (` ```go ... ``` `), quotes, images, and lists.
4. Click **Save** in the top right. Pages CMS will commit the file to `src/posts/{year}-{month}-{day}-{slug}.md`.

---

## 4. Managing the Projects Showcase

The **Projects Showcase** controls the projects grid displayed on both the homepage and the `/projects/` index.

### Adding or Modifying a Project
1. In the sidebar, click on **Projects Showcase**.
2. You will see a list of existing software projects. Click on any project to edit, or click **+ Add item** to create a new one.
3. Configure the fields:
   - **Project Identifier / Slug**: A short lowercase string (e.g. `cloudpulse`, `devvault`).
   - **Project Title**: Name and subtitle of the project.
   - **Short Description**: 1–2 sentences explaining what the project does and its engineering significance.
   - **Category**: Select from `Cloud & Infrastructure`, `Developer Tools`, `Web & Fullstack`, or `Systems`.
   - **Showcase on Homepage**: Toggle **ON** to include this project in the 3-column bento grid on the home page.
   - **Project Card Preview Image**: Upload a 16:9 screenshot or architectural graphic.
   - **Technology Badges**: Add tags (e.g. `Go`, `Docker`, `Prometheus`).
   - **GitHub Repository URL**: Link to source code on GitHub.
   - **Live Demo / Project URL**: Link to running demo or documentation.
   - **Key Architectural Highlights**: 2–3 bullet points highlighting technical achievements (e.g. `Sub-15MB RAM footprint`, `Sub-100ms latency`).
4. Click **Save**. The changes will update `src/_data/projects.json`.

---

## 5. Customizing the Home Page

Click on **Home Page** in the sidebar. This file controls all dynamic text and sections on the homepage:

### 1. Status & Availability Micro-Bar
- **Left Blueprint Tag**: The top-left tag (default: `soumilseal // portfolio '26`).
- **Availability Pill Text**: The pulsing status indicator text (e.g. `open for opportunities` or `booked for Q3`).
- **Show Open Status Indicator**: Toggle **OFF** if you want to temporarily hide the availability badge.

### 2. Hero Section Bento Cell
- **Eyebrow Subtitle**: The monospaced kicker text above the name (e.g. `developer & systems builder`).
- **Full Name**: Main large heading text (default: `SOUMIL SEAL`).
- **Academic & Professional Role**: Role subtitle (default: `BCA Undergraduate • Developer • Systems Builder`).
- **Editorial Narrative Bio**: The bio paragraph describing your background and engineering interests.
- **Hero Portrait Photo**: Upload your portrait photo (default: `/assets/images/me.jpg`). Fills the right side of the hero bento cell.
- **Primary Action Button**: Custom text and destination link (default: `View Resume & Credentials` -> `/resume/`).
- **Secondary Action Button**: Custom text and destination link (default: `Explore Projects` -> `/projects/`).
- **Terminal Status Badge**: Micro badge (default: `terminal // ready`).
- **Location Label**: Geographic label (default: `India // remote-friendly`).

### 3. Live Architecture Metrics Bento Grid
A repeater list of metrics. You can add, edit, or reorder stats:
- **Metric Value**: The prominent number (e.g. `4+`, `100%`, `24/7`, `<100ms`).
- **Metric Label**: Short title (e.g. `production projects`, `test coverage`).
- **Descriptive Subtitle**: Context detail (e.g. `distributed daemons, cli tools & web apps`).

### 4. Systems Architecture Principles
- **Header Bar Title & Subtitle**: Blueprint section labels.
- **Guiding Principles**: A list of engineering standards (e.g. *Minimal Footprints*, *Telemetry-Driven*, *Resilient CI/CD*).

### 5. Languages & Tooling Infinite Marquee (100% Admin Editable)
The homepage features a high-performance, seamless infinite ticker scroll powered by GSAP. Everything inside this ticker is completely customizable from Pages CMS:
- **Section Title & Subtitle**: Customize the header label (e.g. `languages-and-tooling/` and `active-stack // infinite scroll`).
- **Scroll Animation Duration in Seconds**: Speed control (default: `32`). Lower numbers scroll faster (e.g. `20` for quick pace, `45` for slow, subtle motion).
- **Infinite Scroll Items**: A repeater list of technologies, tools, or badges. You can reorder, add new tools, or remove existing ones. Each item contains:
  - **Technology / Tool Name** *(Text)*: The name of the language, framework, or platform (e.g. `Python`, `Rust`, `Docker`).
  - **Category / Index Badge** *(Text)*: The numeric index or category label shown next to the name (e.g. `01/`, `12/`, or `Systems`).
  - **Target Link URL** *(Link)*: Optional link destination. If provided (e.g. `https://www.python.org` or `/projects/`), the item becomes an interactive clickable card with hover effects and an external link indicator. If left blank, it renders as a clean static badge.
  - **Icon / Logo Image** *(Image)*: Optional image upload or asset path (e.g. `/assets/images/icons/python.svg` or any uploaded PNG/SVG/WebP logo). Renders neatly aligned beside the technology name in both light and dark mode.

### 6. Section Header Titles & Descriptions
- **Featured Projects Title**: Custom title for projects section (default: `featured-projects/`).
- **Writing & Notes Title**: Custom title for articles section (default: `writing-and-notes/`).
- **Contact Section Title & Subtitle**: Custom contact labels.
- **Contact Invitation Text**: The paragraph inviting recruiters or collaborators to reach out.

---

## 6. Updating the About Page

Click on **About Page** in the sidebar to customize `/about/`:

- **Page Header**: Title (`About`), Eyebrow (`section // about/`), and introductory description.
- **Profile Portrait Image**: Upload your avatar/portrait photo. (Stored in `/assets/images/`).
- **Narrative Profile & Backstory**:
  - **Story Subtitle**: Section tag (default: `developer-profile // narrative`).
  - **Story Paragraphs**: A list of narrative paragraphs detailing your software journey and engineering interests.
- **Technical Skills & Technologies**:
  - Add or edit categories (e.g. *Languages*, *Cloud & Infrastructure*, *Backend & Data*, *Frontend & Tooling*) and list the specific technologies.
- **Academic Background**: Degree title, graduation status (`Present`), major, and coursework description.

---

## 7. Editing the Resume & Credentials

Click on **Resume Page** in the sidebar to modify `/resume/`:

- **Top Action Bar**: Index label, location/availability (`India • Remote`), and button labels.
- **Executive Focus Profile Summary**: Professional summary paragraph highlighting backend and cloud experience.
- **Technical Proficiencies Bento**: Proficiency categories with category titles, badge chips (`core`, `infrastructure`, `persistence`, `workflows`), and technologies.
- **Academic Credentials**: Degree name, status, institution, and core coursework curriculum.
- **Technical Publications**: Section title and link text to the blog.
- **Verification Channels**: Social links and email dispatch.

---

## 8. Configuring the Contact Page

Click on **Contact Page** in the sidebar to manage `/contact/`:

- **Page Header**: Title and subtitle.
- **Direct Communication Channels**:
  - **Prompt**: Intro text (e.g. `The easiest way to reach me is directly by email:`).
  - **Display Email**: The email address shown on page.
  - **Copy Button Text**: Label for clipboard copy button (`Copy`).
- **Message Dispatch Form**:
  - **Form Endpoint URL**: Set to your form backend endpoint (such as [Formspree](https://formspree.io), [Formspark](https://formspark.io), or a custom serverless webhook). If left blank, the frontend demonstrates interactive client-side submission feedback.
  - **Field Labels & Placeholders**: Customize the name, email, and message inputs.
  - **Submit Button Text**: Custom label (e.g. `Send message` or `Dispatch Message`).

---

## 9. Global Site Settings, Ticker & Navigation

Click on **Site Settings & Navigation** in the sidebar to update global defaults:

### Branding & SEO
- **Site Title**: Appears in browser tabs and search engine results.
- **Author Name**: Global name used in footers, titles, and copyright lines.
- **Role & Bio**: Global tagline and short biography.
- **SEO Meta Description**: Fallback search description across all pages.
- **Canonical Website URL**: Your live production domain (e.g. `https://soumilseal.dev`).
- **Social URLs**: Direct links to GitHub, LinkedIn, and Twitter/X.

### Top Status Ticker Banner
- **Enable Top Banner**: Toggle to show or hide the top black-and-sky status strip.
- **Status Indicator Text**: Custom ticker text (default: `soumilseal2026-systems-in/`).
- **Runtime Subtitle**: Custom system description (default: `runtime: node • bca student • india`).

### Footer Metadata
- **Footer Role Summary**: Short role label.
- **Technical Description**: Engineering philosophy tagline.
- **Copyright Line**: Copyright statement.
- **Technology Credits Note**: Credit line (default: `Eleventy • Tailwind CSS • Pagefind`).

### Navigation Menu
- Manage the list of links appearing in the top navigation bar. You can rename links, change target paths, or add new navigation items.

---

## 10. Media & Image Uploads

- When editing any image field (such as blog cover images, project cards, or author portraits), click the **Upload** button in Pages CMS.
- Images are automatically saved to `src/assets/images/` and served at `/assets/images/`.
- **Recommended Formats**: `.jpg`, `.png`, or `.webp`.
- **Recommended Resolutions**:
  - Blog post exhibits: `1200 x 630 px`
  - Project preview cards: `800 x 450 px` (16:9 aspect ratio)
  - Profile portrait: `800 x 1000 px` (4:5 vertical aspect ratio)

---

## 11. Publishing Workflow & Automatic Builds

Whenever you click **Save** in Pages CMS:
1. Pages CMS generates a clean Git commit formatted as:
   `content: update {path} (via Pages CMS)`
2. The commit is pushed directly to your GitHub repository's `main` branch.
3. Your deployment platform (e.g. Cloudflare Pages or Vercel) immediately triggers an automated build:
   ```bash
   npm run build
   ```
4. Within 15–30 seconds, your updates are live worldwide on the edge CDN!

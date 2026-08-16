# Kxbroker — Landing Page

This repository contains a responsive, accessible static landing page for "Kxbroker" (index.html), with styles in `styles.css` and progressive JavaScript in `script.js`.

What I changed and included:
- Rebranded the original template to **Kxbroker** (title, logo text, meta tags, JSON-LD, footer, README).
- Split the original single-file HTML into index.html + styles.css + script.js.
- Added meta description, Open Graph basics, and Organization JSON-LD.
- Added a skip link, improved keyboard focus styles, ARIA attributes for nav and tabs.
- Mobile nav (hamburger) and tab controls implemented in script.js.
- Images use `loading="lazy"`.
- Basic accessibility + responsiveness improvements.

How to use
1. Create a new repository on GitHub named `Kxbroker` (or use an existing one).
2. Copy these files into the repository root.

Quick local preview:
- Option A: Open `index.html` in a browser.
- Option B (recommended): run a local static server:
  - Python 3: `python -m http.server 8000` then open `http://localhost:8000`
  - Node.js: `npx serve .` (requires npm/tools)

Publish to Vercel
1. Create a GitHub repo named `Kxbroker` and push these files (commands below).
2. On Vercel: New Project → Import Git Repository → choose `Scepter70/Kxbroker`.
   - Application Preset: Other
   - Root Directory: `./` (leave blank if index.html is at repo root)
   - Build Command: leave empty
   - Output Directory: leave empty
3. Click Deploy — Vercel will provide a free `.vercel.app` URL and automatic HTTPS.

Example git commands
```bash
# inside the project folder (after you create the repo on GitHub)
git init
git add .
git commit -m "Initial commit — Kxbroker landing page"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/Kxbroker.git
git push -u origin main# Kxbroker

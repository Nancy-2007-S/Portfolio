# Nancy — Developer Portfolio

A cinematic, fully responsive developer portfolio with scroll-driven animation, a light / dark theme toggle, interactive carousels, and a working direct contact form. Built with plain HTML, CSS, and modern JavaScript, featuring **no build step** and instant deployment to Vercel.

**Live site:** _add your Vercel URL here after deploying_

---

## Features

- **Light / Dark Mode:** Native theme toggle in the navigation bar. Dark mode is the default; preferences are persisted in `localStorage` without flash of unstyled content.
- **Cinematic Entrance & Motion:** Staggered headline reveals, 3D card tilt, magnetic action buttons, and Lenis smooth inertial scrolling orchestrated via GSAP ScrollTrigger.
- **Interactive Projects Arc:** 3D perspective carousel with dynamic video preview synchronization and GitHub source links.
- **Achievements Flow:** Interactive coverflow gallery with video playback controls and mute toggle.
- **Direct Mailbox:** In-place AJAX contact submission powered by FormSubmit with instant feedback and visual loading states.
- **Fully Responsive:** Custom layout adaptations across desktop, tablet, and mobile with full touch gesture support and an animated navigation menu.
- **Accessibility & Performance:** Respects `prefers-reduced-motion` and optimized for 60fps hardware-accelerated transitions.

## Project Structure

```
index.html            Page markup & structure
style.css             Core design system & typography tokens
responsive.css        Responsive breakpoints & mobile polish
theme-light.css       Curated light theme palette
theme.js              Light / dark theme switcher logic
script.js             Carousels, interaction handlers & contact form
motion.js             GSAP ScrollTrigger choreographies & entrance motion
tools/build-theme.js  Utility to regenerate light theme variables
assets/               Media assets (images, posters, and optimized videos)
vercel.json           Production caching & security headers
```

## Run Locally

Because the page loads media and modules, run a local web server:

```powershell
# Python
python -m http.server 8080

# Or Node (npx)
npx serve .
```

Then visit `http://localhost:8080` in your browser.

## Deploy on Vercel

### 1. Initialize Git & Push to GitHub

```powershell
git init
git add .
git commit -m "Initial commit: Nancy portfolio"
git remote add origin https://github.com/Nancy-2007-S/portfolio.git
git branch -M main
git push -u origin main
```

*(Make sure to create an empty repository named `portfolio` on GitHub first without initializing a README.)*

### 2. Deploy via Vercel

- **Via Dashboard:** Import the GitHub repo on [vercel.com](https://vercel.com) (Framework Preset: **Other**, defaults for everything). Click **Deploy**.
- **Via CLI:**
  ```powershell
  npm install -g vercel
  vercel --prod
  ```

### Activate Contact Form (One-Time Setup)

The contact form uses [FormSubmit](https://formsubmit.co). On the first submission from your live site, FormSubmit sends an activation email to **nancy54200717@gmail.com**. Click the confirmation link in that email to begin receiving direct messages.

---

## Tech Stack

HTML5 · CSS3 · Modern JavaScript (ES6+) · [GSAP](https://gsap.com) + ScrollTrigger · [Lenis](https://lenis.darkroom.engineering) · [Simple Icons](https://simpleicons.org) · [FormSubmit](https://formsubmit.co) · [Vercel](https://vercel.com)

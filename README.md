# Nancy — Developer Portfolio

A cinematic, fully responsive developer portfolio with a 3D Earth background, scroll-driven animation, a light / dark theme toggle and a working contact form. Plain HTML, CSS and JavaScript, so there is **no build step** and it deploys to Vercel in about a minute.

**Live site:** _add your Vercel URL here after deploying_

---

## Features

- **Light / dark mode** toggle in the navigation bar. Dark is the default, the visitor's choice is remembered, and there is no flash on reload.
- **Fully responsive** layout for phones, tablets and laptops, with a smooth animated hamburger menu on small screens.
- **Cinematic entrance:** intro title, then the portrait rises in 3D and "Software Developer" slides in from the left.
- **Scroll animations** (GSAP + ScrollTrigger) that replay in both scroll directions, plus mouse-driven 3D tilt on cards, magnetic icon buttons and a scroll-progress bar.
- **3D Earth background** (Three.js), automatically lighter on phones.
- **Projects carousel** where only the visible video plays, and each restarts from the beginning when you scroll back to it.
- **Achievements carousel** with an intro video: unmute and it keeps playing while the carousel holds still; tap to pause or resume.
- **Contact form** that emails the message to your inbox and shows an honest success or error message.
- Links to **GitHub, LinkedIn, Codolio** and email in the header and footer.
- Respects `prefers-reduced-motion`.

## Project structure

```
index.html          page markup
style.css           base design
responsive.css      responsive layout + extra motion styles
theme-light.css     light theme (generated, see below)
script.js           3D scene, carousels, contact form
motion.js           entrance + scroll animations, video control
theme.js            light / dark toggle
tools/build-theme.js  regenerates theme-light.css
assets/             images and videos (web-optimised, with poster frames)
vercel.json         caching + security headers
```

## Run locally

Because the page loads libraries and video, serve it over HTTP instead of opening the file directly:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

(`npx serve` or the VS Code **Live Server** extension work too.)

## Deploy on Vercel

1. Push this repository to GitHub (including the `assets/` folder).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and click **Add New → Project**.
3. Import the **Portfolio** repository.
4. Keep the defaults: **Framework Preset: Other**, no Build Command, no Output Directory. Click **Deploy**.
5. Every `git push` to `main` now redeploys automatically. Every other branch gets its own preview URL, which is handy for trying changes before merging.

### Activate the contact form (one-time, important)

The form sends through [FormSubmit](https://formsubmit.co). The **first** time anyone submits it on the live site, FormSubmit emails **nancy54200717@gmail.com** an activation link. Open the live site, send yourself a test message, then click **Activate** in that email. Until you do, messages are not delivered (the site will show "Couldn't send" instead of a false success). To use a different address, change `targetEmail` in `script.js`.

## Customising

| What | Where |
| --- | --- |
| Name, text, projects, links | `index.html` |
| Colours (dark) | `:root` variables at the top of `style.css` |
| Light theme colours | `INK` / `PAPER` in `tools/build-theme.js`, then run the command below |
| Contact email | `targetEmail` in `script.js` |
| Videos / images | `assets/world/` (keep videos under about 5 MB for fast loading) |

Regenerate the light theme after changing dark colours:

```bash
npm i --no-save postcss
node tools/build-theme.js
```

## Troubleshooting

- **Videos black or slow:** make sure the `.mp4` files were committed. Git LFS is not needed, as each file is only a few MB.
- **Old version still showing after a deploy:** hard-refresh (`Ctrl/Cmd + Shift + R`). CSS and JS links carry a `?v=` number; increase it when you change those files.
- **Contact form says "Couldn't send":** complete the one-time activation above, and check you are online.

## Tech

HTML5 · CSS3 · JavaScript (ES6) · [Three.js](https://threejs.org) · [GSAP](https://gsap.com) + ScrollTrigger · [Lenis](https://lenis.darkroom.engineering) smooth scroll · [Simple Icons](https://simpleicons.org) · FormSubmit · deployed on [Vercel](https://vercel.com)

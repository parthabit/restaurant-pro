# Resturent — Website

A static, multi-page luxury restaurant website (no build step, no server required).

## Folder structure
```
high-garden-website/
├── index.html            Home page
├── menu.html              Full menu (search + filters)
├── gallery.html           Photo gallery (masonry + lightbox)
├── events.html            Event types
├── reservation.html       Booking form
├── contact.html           Map + contact form
├── manifest.json          PWA manifest
├── sw.js                  Service worker (offline shell, not auto-registered)
├── admin/
│   ├── login.html         Admin login (demo credentials below)
│   └── index.html         Admin dashboard
└── assets/
    ├── css/
    │   ├── style.css      Shared design system
    │   └── admin.css      Admin panel styles
    └── js/
        ├── main.js        Shared front-end behaviour
        └── admin.js        Admin dashboard logic
```

## Deploy — pick one

**Netlify / Vercel (drag & drop)**
Drag the whole `high-garden-website` folder onto app.netlify.com/drop (or `vercel deploy` from inside the folder). No build command, no output directory setting needed — it's already static.

**GitHub Pages**
1. Push this folder's contents to a repo (root, or a `/docs` folder).
2. Repo Settings → Pages → set source to that branch/folder.
3. Your site is live at `https://<username>.github.io/<repo>/`.

**Any traditional host (cPanel, FTP, etc.)**
Upload the contents of this folder into `public_html/` (or your web root) as-is, preserving the folder structure.

## Admin dashboard
Visit `/admin/login.html`.
Demo credentials (pre-filled): `admin@highgarden.in` / `highgarden123`

This is a **front-end-only demo**: reservations, menu edits, gallery uploads, and newsletter sign-ups are stored in the visitor's own browser (`localStorage`), not a shared database. Data will differ per browser/device and won't sync across visitors. To make this a real multi-user system, connect a backend (Firebase is a natural fit — ask and I can wire it in).

## Before going live, swap out
- Menu items/prices in `menu.html` and `assets/js/admin.js` (`DEFAULT_DISHES`) — currently representative placeholders.
- Google Maps embed API key in `contact.html` and `reservation.html` (currently a shared demo key).
- Admin login credentials in `admin/login.html` — hardcoded for demo purposes only, not secure for production.
- Social links (Facebook placeholder `#` in the footer) and the newsletter/contact form actions — currently client-side only, no email actually gets sent.

## No dependencies to install
Fonts, icons, and charts load from CDNs (Google Fonts, Font Awesome, Chart.js) at runtime — just open `index.html` in a browser or deploy the folder as static files.

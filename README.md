# The Wedding Reception | Jassim Hashim & Shifa Anis Khan
*Sunday, 17th January 2027 — Welcome Lawns and Banquet, Ghodbunder Road, Thane*

An immersive, dark-mode digital celebration invitation designed with the **"Nocturnal Luxury & Golden Hour"** design philosophy.

---

## 🌟 Design & Aesthetic Identity
- **Visual Metaphor:** An evening gala celebration beneath starry skies.
- **Palette Tokens:**
  - Velvet Obsidian (`#0B0E14`)
  - Deep Midnight Blue (`#101726`)
  - Liquid Brushed Gold (`#E5C378` / `#F7E5B5`)
  - Warm Pearl (`#F3EFE6`)
- **Atmospheric Elements:**
  - GPU-accelerated nocturnal canvas starfield with drifting golden dust.
  - Frosted dark glassmorphism cards (`backdrop-filter: blur(16px)`).
  - Gold hairline dividers with diamond emblems.
  - Elegant ambient background music with intelligent browser autoplay and persistent playback.

---

## 🏛️ Event Specifications
- **Groom:** Jassim Hashim (S/o Mr. Muhamed Hashim & Mrs. Mumtaz Muhamed Hashim)
- **Bride:** Shifa Anis Khan (D/o Mr. Anis Asgar Khan & Mrs. Shabana Anis Khan)
- **Sacred Inscription:** Quran Verse 78:8 (وَخَلَقْنَاكُمْ أَزْوَاجًا — *"And We created you in pairs"*)
- **Event:** Wedding Reception & Dinner
- **Date:** Sunday, 17th January 2027
- **Timing:** 07:00 PM Onwards
- **Venue:** Welcome Lawns and Banquet, Ghodbunder Road, Thane
- **Map Target:** [Welcome Lawns and Banquet Ghodbunder Road Thane](https://www.google.com/maps/search/?api=1&query=Welcome+lawns+and+Banquet+Ghodbunder+Road+Thane)
- **Copyright Year:** 2027

---

## 🎵 Background Music Architecture
- **Track:** *"Water Lily"* composed, arranged, and performed by Kevin MacLeod ([incompetech.com](https://incompetech.com)).
- **Aesthetic Identity:** Serene acoustic guitar and warm orchestral strings designed for nocturnal gala celebrations.
- **Licensing:** Licensed under Creative Commons: By Attribution 3.0 / 4.0 International ([CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)). Royalty-free and authorized for public performance.
- **File Asset:** `assets/audio/water-lily.mp3` (4.4 MB high-fidelity MP3 stream, non-blocking `preload="auto"`).
- **Audio Experience Features:**
  - **Immediate Autoplay Attempt:** Triggers playback automatically on site entry.
  - **Instant Gesture Unlock:** Browser autoplay limitations gracefully activate on the very first screen interaction (`pointerdown`, `click`, `touchstart`, `keydown`).
  - **Audible Master Volume:** Calibrated to `0.70` (70%) with smooth fade-in curve for clear, comfortable listening across all device speakers.
  - **Cross-Navigation State Persistence:** Playback timestamp, volume, and mute status are preserved in `sessionStorage` across internal jump links, page refreshes, and transitions between `index.html` and `404.html`.
  - **No Duplicate Audio Instances:** Managed as a global singleton audio engine.
  - **Comprehensive Multi-Device Controls:** Accessible controls in the top navigation bar (desktop & mobile), inside the mobile drawer, and via a floating bottom-right luxury capsule with animated equalizer bars.

---

## 🚫 404 Fallback Routing & Navigation
- **Navigation Menu Audit:** All navigation menus (desktop, mobile drawer, footer) are completely free of any links to error pages. All menu items point to valid sections (`#sacred-blessing`, `#honored-families`, `#evening-itinerary`, `#venue-showcase`) or valid external maps.
- **Custom 404 Route (`404.html`):** Displays a polished *"Page Not Found"* badge, starlit canvas, warm guidance copy, audio controls, and a clear *"Return to Homepage"* button (`index.html`).
- **Production Server Fallbacks:**
  - `_redirects`: Fallback configuration for Netlify & Cloudflare Pages (`/* /404.html 404`).
  - `vercel.json`: Fallback configuration for Vercel returning HTTP 404 status.
  - `.htaccess`: Fallback configuration for Apache & LiteSpeed servers (`ErrorDocument 404 /404.html`).
  - `server.js`: Native zero-dependency Node.js static server supporting byte-range audio streaming and genuine HTTP 404 responses.

---

## 📁 Project Architecture
```
wedding-reception-only/
├── index.html          # Main celebration invitation & interactive suites
├── 404.html            # Matching midnight starlit 404 error screen ("Page Not Found")
├── assets/
│   ├── favicon.svg     # Dynamic SVG favicon with golden starburst/lantern glyph
│   └── audio/
│       └── canon-in-d.mp3 # Royalty-free Canon in D background audio track
├── css/
│   └── styles.css      # Nocturnal luxury design system & audio visualizers
├── js/
│   └── main.js         # Countdown, starfield canvas, .ics export & audio engine
├── server.js           # Production & preview Node.js static server with 404 fallback
├── test.js             # Automated QA test suite (41/41 passing tests)
├── package.json        # NPM scripts ("npm start", "npm test")
├── _redirects          # Netlify / Cloudflare Pages 404 fallback rule
├── vercel.json         # Vercel 404 routing configuration
├── .htaccess           # Apache / LiteSpeed 404 error document
└── README.md           # Documentation & event details
```

---

## 🧪 Testing & Verification
To run the automated verification suite:
```bash
npm test
```
To run the local preview server:
```bash
npm start
```
Server runs at `http://localhost:3000`, returning genuine HTTP 404 for invalid URLs and serving streaming audio.

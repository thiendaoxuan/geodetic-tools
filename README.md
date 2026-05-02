# Geodetic Tools

A browser-only geodetic coordinate converter. One tap gets your GPS location and displays it in three coordinate formats — no backend, no API calls.

## Formats

- **WGS84** — Decimal degrees (latitude, longitude)
- **ISO 6709** — Degrees-minutes-seconds with hemisphere
- **ICRS** — Right ascension and declination (RA/Dec) via GMST

## Features

- Works fully offline after first visit (PWA with service worker)
- 4 color themes with Normal and Compact UI modes
- One-click copy for each coordinate component
- Settings persisted to `localStorage`

## Dev

```bash
npm run dev       # Start dev server → http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run deploy    # Build + publish to GitHub Pages
```

## Stack

React 18, Vite 6, plain CSS with custom properties. No routers, no state libraries, no CSS frameworks.

# AGENTS.md — Geodetic Tool

Instructions for AI coding agents working on this project.

## Project Summary
A browser-only geodetic coordinate converter. One button gets the device GPS location and displays it in 3 formats: WGS84 (DD), ISO 6709 (DMS), and ICRS (RA/Dec). No backend, no API calls.

## Commands
```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run deploy   # Build + publish to GitHub Pages (gh-pages branch)
```

## Tech Stack
- React 18 (no router, no state library)
- Vite 6
- CSS via single `src/App.css` with CSS custom properties for theming
- No runtime CSS framework, no Tailwind

## File Map
```
src/
  main.jsx                       # ReactDOM mount
  App.jsx                        # Root: state machine, settings, layout
  App.css                        # All styles + 4 theme definitions
  utils/coordinates.js           # Pure functions: DD ↔ DMS ↔ ICRS conversion
  components/
    LocationButton.jsx           # "Get My Location" button
    CoordinateRow.jsx            # One format row (label + values + copy buttons)
    CopyButton.jsx               # Copy-to-clipboard with "Copied!" feedback
    StatusMessage.jsx            # Loading / error states
    SettingsPanel.jsx            # Modal: UI mode (Normal/Compact) + theme picker
public/
  manifest.json                  # PWA manifest
  sw.js                          # Service worker (offline cache)
  icon-192.png, icon-512.png     # App icons
```

## Architecture Notes
- State is in `App.jsx` with a 4-state enum: `IDLE → LOADING → SUCCESS | ERROR`
- Theme is applied via `document.documentElement.className = 'theme-${name}'` and CSS custom properties
- Settings persist to `localStorage` (keys: `geodetic_theme`, `geodetic_compact`)
- ICRS conversion uses GMST formula with current Julian Date — no external ephemeris

## Conventions
- No comments unless requested
- Keep files small and flat — components are single-purpose
- Use CSS custom properties for theming (never hardcode colors in components)
- No new dependencies without strong justification

## PWA / Offline
- Service worker in `public/sw.js` uses cache-first strategy
- App works fully offline after first visit
- GitHub Pages provides HTTPS for PWA install prompt

## Deployment
1. Push to `main` branch on GitHub
2. Run `npm run deploy` → builds and pushes `dist/` to `gh-pages` branch
3. Site live at `https://<user>.github.io/geodetic-tools/`

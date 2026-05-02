import { useState, useEffect, useCallback } from 'react'
import { toDD, toISODMS, toICRS } from './utils/coordinates'
import LocationButton from './components/LocationButton'
import CoordinateRow from './components/CoordinateRow'
import StatusMessage from './components/StatusMessage'
import SettingsPanel from './components/SettingsPanel'
import InstallButton from './components/InstallButton'

const STATE = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' }

const THEMES = ['light', 'dark', 'neon', 'retro']

function errorMessage(code) {
  switch (code) {
    case 1: return 'Location access was denied. Check your browser settings and try again.'
    case 2: return 'Position unavailable. Ensure GPS is enabled or move to an area with better signal.'
    case 3: return 'Request timed out. Please try again.'
    default: return 'An unknown error occurred while getting location.'
  }
}

function loadSetting(key, fallback) {
  try {
    const v = localStorage.getItem(`geodetic_${key}`)
    return v != null ? v : fallback
  } catch {
    return fallback
  }
}

function saveSetting(key, value) {
  try { localStorage.setItem(`geodetic_${key}`, value) } catch { /* noop */ }
}

export default function App() {
  const [status, setStatus] = useState(STATE.IDLE)
  const [coords, setCoords] = useState(null)
  const [error, setError] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [theme, setTheme] = useState(() => loadSetting('theme', 'light'))
  const [compact, setCompact] = useState(() => loadSetting('compact', '0') === '1')

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`
  }, [theme])

  const handleThemeChange = useCallback((t) => {
    setTheme(t)
    saveSetting('theme', t)
  }, [])

  const handleCompactChange = useCallback((c) => {
    setCompact(c)
    saveSetting('compact', c ? '1' : '0')
  }, [])

  const handleClick = () => {
    if (!navigator.geolocation) {
      setStatus(STATE.ERROR)
      setError('Geolocation is not supported by your browser.')
      return
    }

    setStatus(STATE.LOADING)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timestamp: pos.timestamp
        })
        setStatus(STATE.SUCCESS)
      },
      (err) => {
        setStatus(STATE.ERROR)
        setError(errorMessage(err.code))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  const renderRow = (format) => {
    if (!coords) return null

    switch (format) {
      case 'dd': {
        const dd = toDD(coords.lat, coords.lon)
        return (
          <CoordinateRow
            label="WGS 84 (DD)"
            standard="Decimal Degrees"
            note="5+ decimal places for <1.1m accuracy"
            compact={compact}
            fields={[
              { label: 'Latitude', value: dd.lat },
              { label: 'Longitude', value: dd.lon },
            ]}
          />
        )
      }
      case 'dms': {
        const dms = toISODMS(coords.lat, coords.lon)
        return (
          <CoordinateRow
            label="ISO 6709 (DMS)"
            standard="Degrees, Minutes, Seconds"
            note="Best for legacy paper maps"
            compact={compact}
            fields={[
              { label: 'Latitude', value: dms.lat },
              { label: 'Longitude', value: dms.lon },
            ]}
          />
        )
      }
      case 'icrs': {
        const icrs = toICRS(coords.lat, coords.lon, new Date(coords.timestamp))
        return (
          <CoordinateRow
            label="ICRS (RA/Dec)"
            standard="Right Ascension / Declination"
            note="RA in time units (H:M:S) for celestial tracking"
            compact={compact}
            fields={[
              { label: 'RA', value: icrs.ra },
              { label: 'Dec', value: icrs.dec },
            ]}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <main className="app">
      <div className="header-row">
        <InstallButton />
        <h1 className="title">Geodetic Tool</h1>
        <button
          className="btn-settings"
          onClick={() => setSettingsOpen((o) => !o)}
          aria-label="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      {settingsOpen && (
        <SettingsPanel
          theme={theme}
          compact={compact}
          themes={THEMES}
          onThemeChange={handleThemeChange}
          onCompactChange={handleCompactChange}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {!compact && (
        <p className="subtitle">
          Get your current location in three coordinate formats
        </p>
      )}

      <LocationButton onClick={handleClick} loading={status === STATE.LOADING} />

      {status === STATE.LOADING && (
        <StatusMessage type="loading" text="Acquiring location..." />
      )}

      {status === STATE.ERROR && (
        <StatusMessage type="error" text={error} onRetry={handleClick} />
      )}

      {status === STATE.SUCCESS && coords && (
        <div className="results">
          {renderRow('dd')}
          {renderRow('dms')}
          {renderRow('icrs')}
        </div>
      )}
    </main>
  )
}

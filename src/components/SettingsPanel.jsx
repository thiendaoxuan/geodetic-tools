import { useEffect, useRef } from 'react'

const THEME_LABELS = {
  light: 'Light',
  dark: 'Dark',
  neon: 'Neon',
  retro: 'Retro',
}

export default function SettingsPanel({
  theme,
  compact,
  themes,
  onThemeChange,
  onCompactChange,
  onClose,
}) {
  const panelRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div className="settings-backdrop">
      <div className="settings-panel" ref={panelRef}>
        <div className="settings-heading">
          <span>Settings</span>
          <button className="btn-settings-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="settings-row">
          <span className="settings-label">UI Mode</span>
          <div className="settings-toggle">
            <button
              className={`toggle-option${!compact ? ' active' : ''}`}
              onClick={() => onCompactChange(false)}
            >
              Normal
            </button>
            <button
              className={`toggle-option${compact ? ' active' : ''}`}
              onClick={() => onCompactChange(true)}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-label">Theme</span>
          <div className="settings-themes">
            {themes.map((t) => (
              <button
                key={t}
                className={`theme-chip theme-chip-${t}${theme === t ? ' active' : ''}`}
                onClick={() => onThemeChange(t)}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

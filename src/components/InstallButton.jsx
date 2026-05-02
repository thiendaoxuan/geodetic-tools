import { useState, useEffect, useCallback } from 'react'

function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod/.test(navigator.userAgent || '')
}

export default function InstallButton() {
  const [ios, setIos] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return

    if (isIOS()) {
      setIos(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
    setShowPopup(false)
  }, [installPrompt])

  const handleClick = useCallback(() => {
    setShowPopup(true)
  }, [])

  const visible = ios || installPrompt

  if (!visible) return null

  return (
    <>
      <button
        className="btn-install"
        onClick={handleClick}
        aria-label={ios ? 'How to install' : 'Install app'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </button>

      {showPopup && (
        <div className="install-backdrop" onClick={() => setShowPopup(false)}>
          <div className="install-guide" onClick={(e) => e.stopPropagation()}>
            {ios ? (
              <>
                <div className="settings-heading">
                  <span>Add to Home Screen</span>
                  <button className="btn-settings-close" onClick={() => setShowPopup(false)} aria-label="Close">×</button>
                </div>
                <ol className="install-steps">
                  <li>
                    Tap the <strong>Share</strong> button
                    <span className="step-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                    </span>
                    at the bottom of Safari
                  </li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top-right corner</li>
                </ol>
                <button className="btn-guide-ok" onClick={() => setShowPopup(false)}>OK</button>
              </>
            ) : (
              <>
                <div className="settings-heading">
                  <span>Install Geodetic Tool</span>
                  <button className="btn-settings-close" onClick={() => setShowPopup(false)} aria-label="Close">×</button>
                </div>
                <p className="install-desc">
                  Get quick access to your GPS coordinates in three formats.
                  Works offline after first use — no internet needed.
                </p>
                <div className="install-actions">
                  <button className="btn-install-app" onClick={handleInstall}>Install</button>
                  <button className="btn-install-cancel" onClick={() => setShowPopup(false)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

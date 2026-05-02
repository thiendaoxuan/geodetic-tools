import { useState, useEffect, useCallback } from 'react'

function detectOS() {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

export default function InstallButton() {
  const [os, setOs] = useState('desktop')
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const detected = detectOS()
    setOs(detected)

    if (detected === 'ios') return

    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleClick = useCallback(async () => {
    if (os === 'android' && installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        setInstallPrompt(null)
      }
    }
    if (os === 'ios') {
      setShowGuide(true)
    }
  }, [os, installPrompt])

  const visible = (os === 'ios') || (os === 'android' && installPrompt)

  if (!visible) return null

  return (
    <>
      <button
        className="btn-install"
        onClick={handleClick}
        aria-label={os === 'ios' ? 'How to install' : 'Install app'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </button>

      {showGuide && (
        <div className="install-backdrop" onClick={() => setShowGuide(false)}>
          <div className="install-guide" onClick={(e) => e.stopPropagation()}>
            <div className="settings-heading">
              <span>Add to Home Screen</span>
              <button className="btn-settings-close" onClick={() => setShowGuide(false)} aria-label="Close">×</button>
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
            <button className="btn-guide-ok" onClick={() => setShowGuide(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  )
}

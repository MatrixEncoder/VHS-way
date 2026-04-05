/**
 * Home Page — E.C.H.O. Division entry point
 * Fullscreen video background, cryptic minimal text, ENTER ARCHIVE button
 * VHS timestamp, REC indicator, status bar
 */
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import GlitchText from '../components/GlitchText'
import '../styles/home.css'

// Use vid5 as background — the "interrupted broadcast" is most atmospheric
const BG_VIDEO = '/gallery/vid5.mp4'

// Live system clock formatted as VHS timestamp
function useVHSClock() {
  const [ts, setTs] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const mm = String(d.getMonth() + 1).padStart(2,'0')
      const dd = String(d.getDate()).padStart(2,'0')
      const yy = d.getFullYear()
      const hh = String(d.getHours()).padStart(2,'0')
      const min = String(d.getMinutes()).padStart(2,'0')
      const ss = String(d.getSeconds()).padStart(2,'0')
      setTs(`${mm}/${dd}/${yy}  ${hh}:${min}:${ss}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return ts
}

export default function Home() {
  const navigate = useNavigate()
  const vhsClock = useVHSClock()
  const [loaded, setLoaded] = useState(false)
  const [loadPct, setLoadPct] = useState(0)
  const videoRef = useRef(null)

  // Simulate loading bar fill
  useEffect(() => {
    let pct = 0
    const id = setInterval(() => {
      pct += Math.random() * 12
      if (pct >= 100) { pct = 100; clearInterval(id); setLoaded(true) }
      setLoadPct(pct)
    }, 120)
    return () => clearInterval(id)
  }, [])

  const enterArchive = () => navigate('/archive')

  return (
    <div className="home">
      {/* Background video */}
      <video
        ref={videoRef}
        className="home__video-bg"
        src={BG_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Dark + scanline overlay */}
      <div className="home__overlay" aria-hidden="true" />

      {/* Corner decorations */}
      <div className="home__corner home__corner--tl" aria-hidden="true" />
      <div className="home__corner home__corner--tr" aria-hidden="true" />
      <div className="home__corner home__corner--bl" aria-hidden="true" />
      <div className="home__corner home__corner--br" aria-hidden="true" />

      {/* VHS REC indicator */}
      <div className="home__rec" aria-hidden="true">
        <span className="home__rec-dot" />
        REC
      </div>

      {/* VHS timestamp */}
      <div className="home__timestamp" aria-hidden="true">{vhsClock}</div>

      {/* Main content */}
      <div className="home__content">
        <div className="home__org-tag">
          ENVIRONMENTAL CONTAINMENT &amp; HUMAN OBSERVATION DIVISION
        </div>

        <GlitchText
          as="h1"
          className="home__title"
          interval={4000}
          glitchDuration={250}
        >
          E.C.H.O.
        </GlitchText>

        <div className="home__subtitle">
          ARCHIVE TERMINAL &nbsp;/&nbsp; SITE 7 &nbsp;/&nbsp; RESTRICTED ACCESS
        </div>

        <div className="home__divider" aria-hidden="true" />

        <div className="home__status-line">
          ⚠ &nbsp; SYSTEM STATUS: DEGRADED &nbsp;/&nbsp; 7 FILES AWAITING REVIEW &nbsp; ⚠
        </div>

        {/* Loading bar */}
        <div className="home__loading-bar" aria-hidden="true">
          <div className="home__loading-fill" style={{ width: `${loadPct}%` }} />
        </div>

        {/* Access prompt */}
        <div className="home__access-text">
          {loaded ? 'ARCHIVE READY — AUTHENTICATION BYPASSED' : 'AUTHENTICATING...'}
        </div>

        {/* Enter button */}
        <button
          id="enter-archive-btn"
          className="btn-terminal home__enter-btn"
          onClick={enterArchive}
          disabled={!loaded}
          style={{ opacity: loaded ? 1 : 0.4 }}
        >
          ENTER ARCHIVE
        </button>

        <div style={{ marginTop: '24px', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-ghost)', textTransform: 'uppercase' }}>
          Unauthorized access is a federal offense under Regulation 7-C
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="home__statusbar">
        <div className="home__statusbar-item">
          <span className="home__statusbar-dot" />
          <span>NETWORK: DISCONNECTED</span>
        </div>
        <div className="home__statusbar-item">
          SITE-7 ARCHIVE &nbsp;│&nbsp; LAST SYNC: 1987-10-14 12:00:03
        </div>
        <div className="home__statusbar-item">
          <span className="home__statusbar-dot active" />
          <span>LOCAL STORAGE: INTACT</span>
        </div>
      </div>
    </div>
  )
}

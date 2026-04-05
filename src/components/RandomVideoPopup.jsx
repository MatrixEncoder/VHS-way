import { useState, useEffect } from 'react'
import GlitchText from './GlitchText'

export default function RandomVideoPopup() {
  const [active, setActive] = useState(false)
  const [vidId, setVidId] = useState(1)

  useEffect(() => {
    const scheduleNext = () => {
      // Occurs randomly very frequently so the user knows it's there
      const delay = 8000 + Math.random() * 12000
      setTimeout(() => {
        const id = Math.floor(Math.random() * 7) + 1
        setVidId(id)
        setActive(true)

        // Plays for exactly 2 seconds
        const duration = 2000
        setTimeout(() => {
          setActive(false)
          scheduleNext()
        }, duration)

      }, delay)
    }
    
    // Start timing very soon after login
    const initTimer = setTimeout(scheduleNext, 3000)
    return () => clearTimeout(initTimer)
  }, [])

  if (!active) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 8500,
      background: 'rgba(50, 0, 0, 0.5)', /* Strong red tint behind video */
      pointerEvents: 'none',
    }}>
      <video 
        autoPlay 
        loop
        muted 
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          filter: 'contrast(2.5) brightness(1.2) sepia(0.8) hue-rotate(-30deg)',
          opacity: 0.95 /* Nearly opaque, impossible to miss */
        }}
        src={`/gallery/vid${vidId}.mp4`}
      />
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '48px',
        color: 'var(--red-bright)',
        fontFamily: 'var(--font-vhs)'
      }}>
        <GlitchText text="DO NOT LOOK AWAY" active={true} />
      </div>
    </div>
  )
}

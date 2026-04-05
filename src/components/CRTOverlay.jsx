/**
 * CRTOverlay — Fixed atmospheric layer
 * Reverted to CRT look (scanlines, tears, aberration)
 */
import { useEffect, useRef } from 'react'
import '../styles/crt.css'

export default function CRTOverlay() {
  const tearRef = useRef(null)

  useEffect(() => {
    const scheduleTear = () => {
      const delay = 5000 + Math.random() * 15000
      setTimeout(() => {
        const el = tearRef.current
        if (!el) return
        const top = `${5 + Math.random() * 90}%`
        el.style.top = top
        el.style.opacity = '1'
        el.style.height = `${1 + Math.random() * 4}px`
        
        const r = Math.random()
        if (r < 0.5) el.style.background = `rgba(${140 + Math.random()*60}, ${Math.random()*10}, ${Math.random()*10}, 0.6)`
        else if (r < 0.8) el.style.background = `rgba(200, 200, 200, 0.15)`
        else el.style.background = `rgba(50, 50, 80, 0.3)`

        const duration = 40 + Math.random() * 140
        setTimeout(() => {
          if (el) el.style.opacity = '0'
          scheduleTear()
        }, duration)
      }, delay)
    }
    scheduleTear()
  }, [])

  return (
    <div className="crt-overlay" aria-hidden="true">
      <div className="crt-flicker" />
      <div className="crt-sweep" />
      <div className="crt-fringe" />
      <div className="crt-grain" />
      <div className="crt-tear" ref={tearRef} />
    </div>
  )
}

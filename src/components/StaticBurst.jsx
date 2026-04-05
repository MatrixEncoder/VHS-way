/**
 * StaticBurst — Full-screen white flash + static texture
 * Triggered on route changes to simulate signal transition
 */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function StaticBurst() {
  const location = useLocation()
  const [active, setActive] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Trigger on each navigation
    setActive(true)
    setOpacity(1)

    const fadeOut = setTimeout(() => {
      setOpacity(0)
    }, 120)

    const remove = setTimeout(() => {
      setActive(false)
    }, 400)

    return () => {
      clearTimeout(fadeOut)
      clearTimeout(remove)
    }
  }, [location.pathname])

  if (!active) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        opacity,
        transition: 'opacity 280ms ease',
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(190,30,30,0.06) 0px, transparent 1px,
            transparent 2px, rgba(190,30,30,0.03) 2px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.01) 0px, transparent 1px,
            transparent 3px
          )
        `,
        // Simulate static noise with a white flash core
        boxShadow: 'inset 0 0 200px rgba(255,255,255,0.04)',
      }}
    />
  )
}

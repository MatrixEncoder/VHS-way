import { useState, useEffect } from 'react'

const bgs = ['/boo.jpg', '/peep.jpg']

export default function GlobalBackground() {
  const [bg, setBg] = useState('')

  useEffect(() => {
    // Pick a random background on load
    const randomBg = bgs[Math.floor(Math.random() * bgs.length)]
    setBg(randomBg)
  }, [])

  if (!bg) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0, /* ensure it sits behind the page content */
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.12, /* super faint, unsettling */
      filter: 'contrast(1.6) grayscale(0.6) sepia(0.8) hue-rotate(-30deg)',
      pointerEvents: 'none'
    }} />
  )
}

/**
 * GlitchText — renders text with random character substitution
 * and occasional RGB shift. No external libs.
 */
import { useState, useEffect, useRef } from 'react'

const GLITCH_CHARS = '▓▒░█▌▐▀▄■□▪▫◆◇○●◘◙▬▲▶▼◄±²³×÷√∞∩∈∉⊥⊙⊕⊗ΨΩΔΣΠΘΛΦαβγδεζηθ0123456789ABCDEF'

function randomGlitch(text) {
  const chars = text.split('')
  const count = Math.floor(Math.random() * 4) + 1
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * chars.length)
    chars[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
  }
  return chars.join('')
}

export default function GlitchText({
  children,
  as: Tag = 'span',
  interval = 3000,
  glitchDuration = 200,
  className = '',
  style = {}
}) {
  const [display, setDisplay] = useState(children)
  const [glitching, setGlitching] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setDisplay(children)
  }, [children])

  useEffect(() => {
    const scheduleGlitch = () => {
      const wait = interval + Math.random() * interval * 0.5
      timerRef.current = setTimeout(() => {
        setGlitching(true)

        // Rapid glitch frames
        let frames = 0
        const maxFrames = Math.floor(glitchDuration / 40)
        const frameTimer = setInterval(() => {
          setDisplay(randomGlitch(String(children)))
          frames++
          if (frames >= maxFrames) {
            clearInterval(frameTimer)
            setDisplay(children)
            setGlitching(false)
            scheduleGlitch()
          }
        }, 40)
      }, wait)
    }
    scheduleGlitch()
    return () => clearTimeout(timerRef.current)
  }, [children, interval, glitchDuration])

  return (
    <Tag
      className={className}
      style={{
        ...style,
        ...(glitching ? {
          textShadow: '2px 0 #ff0000, -2px 0 #00ffff, 0 0 12px rgba(190,30,30,0.7)',
          transition: 'none',
        } : {}),
      }}
    >
      {display}
    </Tag>
  )
}

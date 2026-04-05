/**
 * AudioManager — Loop bg-music.mp3 + occasional static burst
 * Starts only after first user interaction (browser policy)
 */
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function AudioManager() {
  const ctxRef = useRef(null)
  const bgMusicRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)
  const location = useLocation()

  const startAudio = () => {
    // ── Background Music ──
    if (!bgMusicRef.current) {
      const audio = new Audio('/bg-music.mp3')
      audio.loop = true
      audio.volume = 0.45
      bgMusicRef.current = audio
    }

    const audio = bgMusicRef.current
    if (audio.paused && !muted) {
      audio.play().then(() => {
        setStarted(true)
      }).catch(err => {
        console.warn('Playback blocked by browser:', err)
      })
    }

    // ── Static Bursts (Web Audio API) ──
    if (!ctxRef.current) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        ctxRef.current = ctx

        const scheduleStatic = () => {
          const wait = 15000 + Math.random() * 30000
          setTimeout(() => {
            if (!ctxRef.current || muted) return
            // Ensure context is running
            if (ctx.state === 'suspended') ctx.resume()
            
            const staticGain = ctx.createGain()
            staticGain.gain.setValueAtTime(0, ctx.currentTime)
            staticGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02)
            staticGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15)
            staticGain.connect(ctx.destination)

            const whiteBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
            const wd = whiteBuffer.getChannelData(0)
            for (let i = 0; i < wd.length; i++) wd[i] = Math.random() * 2 - 1
            const ws = ctx.createBufferSource()
            ws.buffer = whiteBuffer
            ws.connect(staticGain)
            ws.start()

            scheduleStatic()
          }, wait)
        }
        scheduleStatic()
      } catch (e) {
        console.warn('Web Audio API not supported:', e)
      }
    } else if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
  }

  // Effect to manage interaction listeners
  useEffect(() => {
    // Try immediate start (works if component mounted from a click/interaction)
    startAudio()
    
    // Listen for any interaction to trigger/resume audio
    const handleInteraction = () => {
      startAudio()
    }

    window.addEventListener('mousedown', handleInteraction)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    
    return () => {
      window.removeEventListener('mousedown', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [muted])

  // Mute toggle
  const toggleMute = () => {
    const m = !muted
    setMuted(m)
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = m
    }
  }

  return (
    <button
      id="audio-toggle"
      onClick={toggleMute}
      aria-label={muted ? 'Unmute ambient audio' : 'Mute ambient audio'}
      title={muted ? 'AUDIO: OFF — click to enable' : 'AUDIO: ON — click to mute'}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 5000,
        background: 'rgba(5, 2, 3, 0.9)',
        border: `1px solid ${muted ? 'var(--text-ghost)' : 'var(--red-dim)'}`,
        color: muted ? 'var(--text-muted)' : 'var(--red-primary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        letterSpacing: '0.25em',
        padding: '6px 12px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'all 0.2s',
      }}
    >
      {muted ? '◼ AUDIO OFF' : '◆ AUDIO ON'}
    </button>
  )
}

/**
 * AudioManager — Robust Web Audio API Engine
 * Routes bg-music.mp3 through a master gain node.
 * Unlocks on any user interaction (Log In, click, key, touch).
 */
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function AudioManager() {
  const audioCtxRef = useRef(null)
  const masterGainRef = useRef(null)
  const bgMusicElementRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)

  // Initialize Audio Engine
  const initEngine = () => {
    if (audioCtxRef.current) return

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      // Master Gain (Master Volume)
      const masterGain = ctx.createGain()
      masterGain.gain.value = 0.45 // High default for mobile
      masterGain.connect(ctx.destination)
      masterGainRef.current = masterGain

      // Create Background Music Element
      const audio = new Audio('/bg-music.mp3')
      audio.loop = true
      audio.crossOrigin = "anonymous"
      bgMusicElementRef.current = audio

      // Route Audio Element to the Context
      const source = ctx.createMediaElementSource(audio)
      source.connect(masterGain)

      // Start the static burst scheduler
      const scheduleStatic = () => {
        const wait = 15000 + Math.random() * 30000
        setTimeout(() => {
          if (!audioCtxRef.current || muted) return
          if (ctx.state === 'suspended') ctx.resume()

          const staticGain = ctx.createGain()
          staticGain.gain.setValueAtTime(0, ctx.currentTime)
          staticGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02)
          staticGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15)
          staticGain.connect(masterGain)

          const whiteBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
          const data = whiteBuffer.getChannelData(0)
          for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
          
          const ws = ctx.createBufferSource()
          ws.buffer = whiteBuffer
          ws.connect(staticGain)
          ws.start()

          scheduleStatic()
        }, wait)
      }
      scheduleStatic()

      console.log("E.C.H.O. Audio Engine Initialized.")
    } catch (err) {
      console.warn("Audio Context failure:", err)
    }
  }

  // Attempt to "Unlock" and Play
  const unlockAndPlay = async () => {
    initEngine()
    
    const ctx = audioCtxRef.current
    const audio = bgMusicElementRef.current
    
    if (!ctx || !audio) return

    // Force resume the context (crucial for browsers)
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    if (audio.paused && !muted) {
      try {
        await audio.play()
        setStarted(true)
      } catch (err) {
        console.warn("Playback prevented:", err)
      }
    }
  }

  useEffect(() => {
    // Initial attempt (may fail due to browser policy)
    unlockAndPlay()

    // Persistent listeners to "Unlock" audio on user interaction
    const listeners = ['mousedown', 'keydown', 'touchstart', 'click']
    listeners.forEach(type => window.addEventListener(type, unlockAndPlay))

    return () => {
      listeners.forEach(type => window.removeEventListener(type, unlockAndPlay))
    }
  }, [muted])

  // Volume/Mute Toggle
  const toggleMute = () => {
    const m = !muted
    setMuted(m)
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(m ? 0 : 0.45, audioCtxRef.current.currentTime, 0.1)
    }
    if (bgMusicElementRef.current) {
      bgMusicElementRef.current.muted = m
    }
  }

  return (
    <button
      id="audio-toggle"
      onClick={toggleMute}
      aria-label={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'fixed', bottom: '16px', right: '16px', zIndex: 5000,
        background: 'rgba(5, 2, 3, 0.9)',
        border: `1px solid ${muted ? 'var(--text-ghost)' : 'var(--red-dim)'}`,
        color: muted ? 'var(--text-muted)' : 'var(--red-primary)',
        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em',
        padding: '6px 12px', cursor: 'pointer', textTransform: 'uppercase',
        transition: 'all 0.2s',
      }}
    >
      {muted ? '◼ AUDIO OFF' : '◆ AUDIO ON'}
    </button>
  )
}

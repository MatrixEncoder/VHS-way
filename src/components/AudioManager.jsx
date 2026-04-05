import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { VHS_EVENT_VIDEO_STATUS } from '../utils/vhs_events'

export default function AudioManager() {
  const audioCtxRef = useRef(null)
  const masterGainRef = useRef(null)
  const bgMusicElementRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  // Initialize Audio Engine
  const initEngine = () => {
    if (audioCtxRef.current) return
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      const masterGain = ctx.createGain()
      masterGain.gain.value = 0.45 
      masterGain.connect(ctx.destination)
      masterGainRef.current = masterGain

      const audio = new Audio('/bg-music.mp3')
      audio.loop = true
      audio.crossOrigin = "anonymous"
      bgMusicElementRef.current = audio
      const source = ctx.createMediaElementSource(audio)
      source.connect(masterGain)

      const scheduleStatic = () => {
        const wait = 15000 + Math.random() * 30000
        setTimeout(() => {
          if (!audioCtxRef.current || muted || videoPlaying) return
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
    } catch (err) { console.warn("Audio Context failure:", err) }
  }

  const unlockAndPlay = async () => {
    initEngine()
    const ctx = audioCtxRef.current
    const audio = bgMusicElementRef.current
    if (!ctx || !audio) return
    if (ctx.state === 'suspended') await ctx.resume()
    if (audio.paused && !muted && !videoPlaying) {
      try {
        await audio.play()
        setStarted(true)
      } catch (err) { console.warn("Playback prevented:", err) }
    }
  }

  useEffect(() => {
    unlockAndPlay()
    const listeners = ['mousedown', 'keydown', 'touchstart', 'click']
    listeners.forEach(type => window.addEventListener(type, unlockAndPlay))
    return () => listeners.forEach(type => window.removeEventListener(type, unlockAndPlay))
  }, [muted, videoPlaying])

  // Listen for ducking events
  useEffect(() => {
    const handleVideoStatus = (e) => {
      const isPlaying = e.detail.isPlaying
      setVideoPlaying(isPlaying)
      
      if (masterGainRef.current && audioCtxRef.current) {
        // If the user manually muted, keep it muted.
        // Otherwise, duck the volume to 0 during video play and restore to 0.45 when stopped.
        const targetGain = (isPlaying || muted) ? 0 : 0.45
        masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.1)
      }
    }
    window.addEventListener(VHS_EVENT_VIDEO_STATUS, handleVideoStatus)
    return () => window.removeEventListener(VHS_EVENT_VIDEO_STATUS, handleVideoStatus)
  }, [muted])

  const toggleMute = () => {
    const m = !muted
    setMuted(m)
    if (masterGainRef.current && audioCtxRef.current) {
      // Manual mute always takes precedence. 
      // If we are unmuting BUT a video is playing, stay at 0 gain.
      const targetGain = (m || videoPlaying) ? 0 : 0.45
      masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.1)
    }
    if (bgMusicElementRef.current) {
      bgMusicElementRef.current.muted = m || videoPlaying
    }
  }

  return createPortal(
    <button
      id="audio-toggle"
      onClick={toggleMute}
      aria-label={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'fixed', bottom: '16px', right: '16px', zIndex: 10000,
        background: 'rgba(5, 2, 3, 0.9)',
        border: `1px solid ${muted ? 'var(--text-ghost)' : 'var(--red-dim)'}`,
        color: muted ? 'var(--text-muted)' : 'var(--red-primary)',
        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em',
        padding: '6px 12px', cursor: 'pointer', textTransform: 'uppercase',
        transition: 'all 0.2s',
      }}
    >
      {muted ? '◼ AUDIO OFF' : '◆ AUDIO ON'}
    </button>,
    document.body
  )
}

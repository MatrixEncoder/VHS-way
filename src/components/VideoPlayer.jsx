/**
 * VideoPlayer — Custom HTML5 video player with terminal UI
 * No browser default controls. Classification watermark overlay.
 * Features: play/pause, scrubber, volume, time display, fullscreen
 */
import { useRef, useState, useEffect, useCallback } from 'react'
import { dispatchVHSVideoEvent } from '../utils/vhs_events'

export default function VideoPlayer({ src, classification = 'RESTRICTED', videoId = '' }) {
  const videoRef = useRef(null)
  const scrubRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  
  // Audio ducking signal
  useEffect(() => {
    dispatchVHSVideoEvent(playing)
  }, [playing])

  // Cleanup on unmount
  useEffect(() => {
    return () => dispatchVHSVideoEvent(false)
  }, [])

  const [currentTime, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [buffered, setBuffered] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showScrub, setShowScrub] = useState(false)
  const containerRef = useRef(null)

  // Format seconds → MM:SS
  const fmt = s => {
    if (!isFinite(s)) return '--:--'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onLoaded = () => setDuration(v.duration)
    const onTime = () => {
      setCurrent(v.currentTime)
      if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1))
    }
    const onEnded = () => setPlaying(false)
    v.addEventListener('loadedmetadata', onLoaded)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('ended', onEnded)
    return () => {
      v.removeEventListener('loadedmetadata', onLoaded)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('ended', onEnded)
    }
  }, [src])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }, [])

  const seek = useCallback((e) => {
    const v = videoRef.current
    if (!v || !scrubRef.current) return
    const rect = scrubRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    v.currentTime = pct * (v.duration || 0)
  }, [])

  const changeVolume = (val) => {
    const v = videoRef.current
    if (!v) return
    const vol = parseFloat(val)
    v.volume = vol
    setVolume(vol)
  }

  const toggleFullscreen = () => {
    const c = containerRef.current
    if (!document.fullscreenElement) {
      c?.requestFullscreen?.()
      setFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setFullscreen(false)
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const buffPct   = duration > 0 ? (buffered / duration) * 100 : 0

  // Class badge color
  const classColor = classification === 'TOP SECRET' ? 'var(--red-bright)'
    : classification === 'CLASSIFIED' ? 'var(--red-bright)'
    : classification === 'RESTRICTED' ? 'var(--amber)'
    : 'var(--red-mid)'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        background: '#000',
        width: '100%',
        margin: '0 auto',
        userSelect: 'none',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Video wrapper to contain overlays */}
      <div style={{ position: 'relative', width: '100%', background: '#000', display: 'flex', justifyContent: 'center' }}>
        <video
          ref={videoRef}
          src={src}
          onClick={togglePlay}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '60vh',
            display: 'block',
            cursor: 'pointer',
            filter: 'grayscale(0.3) contrast(1.15)',
            objectFit: 'contain',
          }}
          preload="metadata"
          playsInline
        />

      {/* Scanline overlay on video */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.1) 3px,rgba(0,0,0,0.1) 4px)',
        zIndex: 2,
      }}/>

      {/* Watermark */}
      <div style={{
        position: 'absolute',
        top: '10px', right: '12px',
        zIndex: 3, pointerEvents: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        color: classColor,
        opacity: 0.7,
        textTransform: 'uppercase',
      }}>
        {classification} &nbsp;/&nbsp; {videoId}
      </div>

      {/* VHS timestamp watermark */}
      <div style={{
        position: 'absolute',
        bottom: '52px', left: '12px',
        zIndex: 3, pointerEvents: 'none',
        fontFamily: 'var(--font-vhs)',
        fontSize: '18px',
        color: 'rgba(190,30,30,0.6)',
        letterSpacing: '0.06em',
      }}>
        {fmt(currentTime)}
      </div>

      {/* Paused overlay */}
      {!playing && (
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 4, cursor: 'pointer',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          <div style={{
            width: '52px', height: '52px',
            border: '1px solid var(--red-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--red-bright)',
            fontSize: '20px',
            textShadow: '0 0 16px var(--red-bright)',
            boxShadow: '0 0 24px rgba(190,30,30,0.2)',
          }}>
            ▶
          </div>
        </div>
      )}
      </div>

      {/* Controls bar */}
      <div style={{
        background: 'rgba(2,2,2,0.97)',
        borderTop: '1px solid var(--border)',
        padding: '8px 12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        zIndex: 5,
      }}>
        {/* Scrubber */}
        <div
          ref={scrubRef}
          onClick={seek}
          style={{
            position: 'relative',
            height: '6px',
            background: 'var(--surface-2)',
            cursor: 'pointer',
            border: '1px solid var(--border)',
          }}
        >
          {/* Buffered */}
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${buffPct}%`,
            background: 'var(--red-ghost)',
            transition: 'width 0.5s',
          }}/>
          {/* Progress */}
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--red-dim), var(--red-bright))',
            boxShadow: '0 0 6px rgba(190,30,30,0.6)',
            transition: 'width 0.1s linear',
          }}/>
          {/* Head */}
          <div style={{
            position: 'absolute', top: '-3px',
            left: `${progress}%`,
            transform: 'translateX(-50%)',
            width: '10px', height: '12px',
            background: 'var(--red-bright)',
            boxShadow: '0 0 8px var(--red-bright)',
          }}/>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            style={{
              background: 'transparent',
              border: '1px solid var(--red-dim)',
              color: 'var(--red-bright)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '4px 10px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              minWidth: '36px',
            }}
          >
            {playing ? '⏸' : '▶'}
          </button>

          {/* Time */}
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            minWidth: '90px',
          }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>VOL</span>
            <input
              type="range"
              min="0" max="1" step="0.01"
              value={volume}
              onChange={e => changeVolume(e.target.value)}
              style={{
                width: '70px',
                accentColor: 'var(--red-mid)',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            {fullscreen ? '⊡' : '⊞'}
          </button>
        </div>
      </div>
    </div>
  )
}

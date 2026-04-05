/**
 * VideoModal — Archive video modal player
 * Opens with "signal acquire" animation
 * Closes on overlay click, Escape key, or close button
 */
import { useEffect, useCallback } from 'react'
import VideoPlayer from './VideoPlayer'
import '../styles/archive.css'

export default function VideoModal({ video, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  if (!video) return null

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-header-title">PLAYBACK — {video.id}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className={`badge ${video.badgeClass}`}>{video.classification}</span>
            <button className="modal-close" onClick={onClose}>✕ CLOSE</button>
          </div>
        </div>

        {/* Player */}
        <div className="modal-body" style={{ padding: '0' }}>
          <VideoPlayer
            src={video.file}
            classification={video.classification}
            videoId={video.id}
          />
        </div>

        {/* Narrative Story Section */}
        <div className="modal-story">
          <div className="modal-story-header">
            <span className="blink">●</span> SIGNAL TRANSCRIPTION / RECOVERED DATA
          </div>
          <p className="modal-story-text">
            {video.redditStory}
          </p>
        </div>

        {/* Metadata */}
        <div className="modal-info">
          <div className="modal-info-row">
            <span className="modal-info-label">FILE</span>
            <span id="modal-title">{video.title}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">TIMESTAMP</span>
            <span>{video.timestamp}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">RECORDER</span>
            <span>{video.recorder}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">INTEGRITY</span>
            <span style={{
              color: video.integrity === 'CORRUPTED' ? 'var(--red-bright)'
                : video.integrity === 'COMPROMISED' ? 'var(--amber)'
                : video.integrity === 'UNKNOWN' ? 'var(--red-bright)'
                : 'var(--red-mid)',
            }}>
              {video.integrity}
            </span>
          </div>
          <div className="modal-info-row" style={{ gridColumn: '1 / -1' }}>
            <span className="modal-info-label">SIZE</span>
            <span style={{ color: 'var(--amber)', fontSize: '11px' }}>{video.fileSize}</span>
          </div>
          <div className="modal-info-row" style={{ gridColumn: '1 / -1' }}>
            <span className="modal-info-label">NOTE</span>
            <span style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '11px' }}>{video.description}</span>
          </div>
        </div>
      </div>

      {/* Scanline overlay on modal */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.04) 4px,rgba(0,0,0,0.04) 5px)',
      }}/>
    </div>
  )
}

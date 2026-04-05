/**
 * Archive Page — E.C.H.O. Division video archive
 * Grid of 7 classified tape files with custom modal player
 * Each card shows classification, cryptic title, metadata
 */
import { useState, useCallback, useRef } from 'react'
import VideoModal from '../components/VideoModal'
import GlitchText from '../components/GlitchText'
import { archiveData } from '../data/archiveData'
import '../styles/archive.css'

function ArchiveCard({ video, onClick }) {
  const videoRef = useRef(null)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause()
  }

  // Integrity status color
  const integrityColor = video.integrity === 'CORRUPTED' ? 'var(--red-bright)'
    : video.integrity === 'COMPROMISED' ? 'var(--amber)'
    : video.integrity === 'UNKNOWN' ? 'var(--red-bright)'
    : 'var(--red-mid)'

  return (
    <div
      className="archive-card"
      onClick={() => onClick(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(video)}
      aria-label={`Open ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="archive-card__thumb">
        <video
          ref={videoRef}
          src={video.file}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="archive-card__scan" aria-hidden="true" />

        {/* Play overlay */}
        <div className="archive-card__play-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="6,3 20,12 6,21" fill="currentColor" />
          </svg>
        </div>

        {/* Classification badge */}
        <div className="archive-card__class-overlay">
          <span className={`badge ${video.badgeClass}`}>{video.classification}</span>
        </div>

        {/* Duration placeholder */}
        <div className="archive-card__duration">--:--</div>
      </div>

      {/* Card body */}
      <div className="archive-card__body">
        <div className="archive-card__id">{video.id}</div>
        <div className="archive-card__title">{video.title}</div>
        <div className="archive-card__desc">{video.description}</div>

        <div className="archive-card__footer">
          <span className="archive-card__timestamp">{video.timestamp}</span>
          <span style={{ color: integrityColor, fontSize: '10px', letterSpacing: '0.15em' }}>
            ◆ {video.integrity}
          </span>
        </div>
      </div>
    </div>
  )
}

// Modal
import { createPortal } from 'react-dom'

export default function Archive() {
  const [activeVideo, setActiveVideo] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const openModal = useCallback((video) => setActiveVideo(video), [])
  const closeModal = useCallback(() => setActiveVideo(null), [])

  const filters = ['ALL', 'CLASSIFIED', 'RESTRICTED', 'LEVEL-3', 'TOP SECRET']

  const filtered = filter === 'ALL'
    ? archiveData
    : archiveData.filter(v => v.classification === filter)

  return (
    <div className="archive page-container">
      {/* Header */}
      <div className="archive__header">
        <div className="archive__breadcrumb">
          E.C.H.O DIVISION &nbsp;/&nbsp; <span>SITE-7 ARCHIVE</span>
        </div>
        <div className="archive__title-row">
          <GlitchText as="h1" className="archive__title" interval={6000}>
            TAPE ARCHIVE
          </GlitchText>
          <div className="archive__meta">
            <div>FILES: 7 OF 7 RECOVERED</div>
            <div>INTEGRITY: VARIES</div>
            <div>DATE: 1987-10-14</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="archive__filter-bar">
          <span>FILTER BY CLASSIFICATION:</span>
          {filters.map(f => (
            <button
              key={f}
              className={`archive__filter-badge ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="terminal-divider" style={{ margin: '12px 0 0' }} />
      </div>

      {/* Grid */}
      <div className="archive__grid" role="list">
        {filtered.map(video => (
          <div key={video.id} role="listitem">
            <ArchiveCard video={video} onClick={openModal} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            padding: '60px 0',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.3em',
          }}>
            NO FILES MATCHING CLASSIFICATION LEVEL
          </div>
        )}
      </div>

      {/* Portal-rendered Modal */}
      {activeVideo && createPortal(
        <VideoModal video={activeVideo} onClose={closeModal} />,
        document.body
      )}
    </div>
  )
}

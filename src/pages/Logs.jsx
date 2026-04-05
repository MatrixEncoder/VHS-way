/**
 * Logs Page — E.C.H.O. Division system log terminal
 * Scrollable log feed with corrupted/redacted entries
 * Terminal input that accepts "ECHO" command → navigate to classified
 * Hidden encoded message in source comment
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GlitchText from '../components/GlitchText'
import { logsData } from '../data/logsData'
import '../styles/logs.css'

// Counts by level
const levelCounts = logsData.reduce((acc, e) => {
  if (e.type === 'separator') return acc
  acc[e.level] = (acc[e.level] || 0) + 1
  return acc
}, {})

function LogEntry({ entry, visible }) {
  const [shown, setShown] = useState(false)

  // Staggered reveal animation
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setShown(true), Math.random() * 200)
      return () => clearTimeout(t)
    }
  }, [visible])

  // Occasionally flash and dim corrupted entries
  const [flashOut, setFlashOut] = useState(false)
  useEffect(() => {
    if (!entry.corrupted) return
    const schedule = () => {
      const wait = 8000 + Math.random() * 20000
      setTimeout(() => {
        setFlashOut(true)
        setTimeout(() => { setFlashOut(false); schedule() }, 300)
      }, wait)
    }
    schedule()
  }, [entry.corrupted])

  if (entry.type === 'separator') {
    return <div className="log-separator" data-label={entry.label} />
  }

  const levelClass = `log-entry__level--${entry.level.toLowerCase()}`

  return (
    <div
      className="log-entry"
      style={{
        opacity: shown ? (flashOut ? 0.1 : 1) : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <span className="log-entry__time">{entry.time}</span>
      <span className={`log-entry__level ${levelClass}`}>[{entry.level}]</span>
      <span className={`log-entry__msg ${entry.corrupted ? 'corrupted' : ''}`}>
        {entry.msg}
      </span>
    </div>
  )
}

export default function Logs() {
  const navigate = useNavigate()
  const feedRef = useRef(null)
  const [termInput, setTermInput] = useState('')
  const [visibleCount, setVisibleCount] = useState(0)
  const [termHistory, setTermHistory] = useState([])
  const [cmdOutput, setCmdOutput] = useState(null)

  // Stagger-reveal log entries
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setVisibleCount(i)
      if (i >= logsData.length) clearInterval(id)
    }, 35)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll to bottom as entries reveal
  useEffect(() => {
    const el = feedRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visibleCount])

  const handleTermSubmit = useCallback((e) => {
    e.preventDefault()
    const cmd = termInput.trim().toUpperCase()
    setTermHistory(h => [...h, cmd])
    setTermInput('')

    if (cmd === 'ECHO') {
      setCmdOutput('ECHO_11 PROTOCOL RECOGNIZED — ROUTING TO CLASSIFIED SEGMENT...')
      setTimeout(() => navigate('/classified'), 1400)
    } else if (cmd === 'HELP') {
      setCmdOutput('AVAILABLE: HELP, CLEAR, STATUS, ECHO')
    } else if (cmd === 'CLEAR') {
      setCmdOutput(null)
      setTermHistory([])
    } else if (cmd === 'STATUS') {
      setCmdOutput('TERMINAL: ACTIVE  |  NETWORK: OFFLINE  |  CLEARANCE: L-2  |  ANOMALIES: DETECTED')
    } else if (cmd) {
      setCmdOutput(`COMMAND NOT RECOGNIZED: "${cmd}" — type HELP for available commands`)
    }
  }, [termInput, navigate])

  return (
    <div className="logs page-container">
      {/* Header */}
      <div className="logs__header">
        <div className="logs__breadcrumb">
          E.C.H.O DIVISION &nbsp;/&nbsp; <span>INCIDENT LOGS</span>
        </div>
        <GlitchText as="h1" className="logs__title" interval={8000}>
          SYSTEM LOGS
        </GlitchText>
        <div className="logs__warning">
          ⚠ &nbsp; SOME ENTRIES CONTAIN ENCODING ERRORS — DO NOT ATTEMPT MANUAL REPAIR
        </div>
      </div>

      {/* Body */}
      <div className="logs__body">
        {/* Feed */}
        <div className="logs__feed" ref={feedRef}>
          {logsData.map((entry, i) => (
            <LogEntry key={entry.id} entry={entry} visible={i < visibleCount} />
          ))}

          {/* Terminal command output */}
          {cmdOutput && (
            <div style={{
              margin: '12px 0',
              padding: '8px 12px',
              borderLeft: '2px solid var(--red-mid)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--red-bright)',
              background: 'rgba(0,20,0,0.3)',
              letterSpacing: '0.06em',
            }}>
              {cmdOutput}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="logs__sidebar">
          <div className="logs__sidebar-label">LOG SUMMARY</div>
          {Object.entries(levelCounts).map(([level, count]) => (
            <div key={level} className={`logs__sidebar-item ${level === 'ERROR' ? 'active' : ''}`}>
              [{level}] &nbsp; {count}
            </div>
          ))}
          <div style={{ marginTop: '20px' }}>
            <div className="logs__sidebar-label">SITE STATUS</div>
            <div className="logs__sidebar-item active">SITE-7: SEALED</div>
            <div className="logs__sidebar-item">NETWORK: OFFLINE</div>
            <div className="logs__sidebar-item">PERSONNEL: 31 / 47</div>
            <div className="logs__sidebar-item active">ANOMALIES: ACTIVE</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="logs__sidebar-label">ARCHIVE INFO</div>
            <div className="logs__sidebar-item">ENTRIES: {logsData.filter(e => !e.type).length}</div>
            <div className="logs__sidebar-item active">CORRUPTED: {logsData.filter(e => e.corrupted).length}</div>
            <div className="logs__sidebar-item">LAST ENTRY: ████-██-██</div>
          </div>
          <div style={{ marginTop: '28px', fontSize: '9px', color: 'var(--text-ghost)', letterSpacing: '0.15em', lineHeight: 1.8 }}>
            HINT: TERMINAL ACCEPTS COMMANDS. TYPE CAREFULLY.
          </div>
        </div>
      </div>

      {/* Terminal input */}
      <form className="logs__terminal" onSubmit={handleTermSubmit}>
        <span className="logs__terminal-prompt">ECHO-TERMINAL:~$</span>
        <input
          id="terminal-input"
          className="logs__terminal-input cursor"
          type="text"
          value={termInput}
          onChange={e => setTermInput(e.target.value)}
          placeholder=""
          autoComplete="off"
          spellCheck="false"
          aria-label="Terminal command input"
        />
        <span className="logs__terminal-hint">PRESS ENTER TO EXECUTE</span>
      </form>
    </div>
  )
}

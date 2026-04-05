/**
 * ErrorPopup — Fake system integrity warning
 * Appears randomly at long intervals (90s+)
 * Feels like a real OS dialog, not a horror popup
 */
import { useState, useEffect } from 'react'

const ERRORS = [
  {
    code: '0x000000E2',
    title: 'MEMORY INTEGRITY CHECK FAILED',
    body: 'The archive index has detected an unauthorized read on sector 7-E. This may indicate data tampering or media degradation. Recommend immediate backup.',
    severity: 'WARN',
  },
  {
    code: '0xDEAD0047',
    title: 'CHECKSUM MISMATCH — ECH-S7-007',
    body: 'File ECH-S7-007 does not match stored hash. Expected: 00000000  Actual: F1E7D0A3. Automatic quarantine has been disabled. Reason: unknown.',
    severity: 'ERROR',
  },
  {
    code: '0x00110011',
    title: 'NETWORK: UNEXPECTED PING',
    body: 'An unsolicited connection attempt was received from address 0.0.0.0:7777. Firewall engagement: FAILED. Connection closed manually. Log entry suppressed.',
    severity: 'WARN',
  },
  {
    code: '0xFFFFFFFE',
    title: 'PROCESS ANOMALY DETECTED',
    body: 'Unknown process ECHO_11.exe has been found in memory at offset 0xFF. Process origin: untraced. Attempting termination... FAILED.',
    severity: 'ERROR',
  },
]

export default function ErrorPopup() {
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState(null)
  const [dismissed, setDismissed] = useState(0)

  useEffect(() => {
    const schedule = () => {
      const wait = 90000 + Math.random() * 60000
      const timer = setTimeout(() => {
        const e = ERRORS[Math.floor(Math.random() * ERRORS.length)]
        setError(e)
        setVisible(true)
      }, wait)
      return timer
    }

    const t = schedule()
    return () => clearTimeout(t)
  }, [dismissed])

  const dismiss = () => {
    setVisible(false)
    setDismissed(d => d + 1)
  }

  if (!visible || !error) return null

  const color = error.severity === 'ERROR' ? 'var(--red-bright)' : 'var(--amber)'
  const border = error.severity === 'ERROR' ? 'var(--red-warn)' : 'var(--amber-dim)'

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={error.title}
      style={{
        position: 'fixed',
        bottom: '48px',
        right: '16px',
        zIndex: 7500,
        width: '340px',
        background: 'var(--surface)',
        border: `1px solid ${border}`,
        fontFamily: 'var(--font-mono)',
        animation: 'signal-in 0.3s ease-out',
        boxShadow: `0 0 30px rgba(${error.severity === 'ERROR' ? '139,0,0' : '200,134,10'},0.15)`,
      }}
    >
      {/* Header */}
      <div style={{
        background: 'var(--surface-2)',
        borderBottom: `1px solid ${border}`,
        padding: '8px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ color, fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          ▲ SYSTEM ALERT
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.1em' }}>
          {error.code}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px' }}>
        <div style={{ color, fontSize: '12px', letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' }}>
          {error.title}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: '1.7', marginBottom: '14px' }}>
          {error.body}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={dismiss}
            style={{
              flex: 1,
              background: 'transparent',
              border: `1px solid ${border}`,
              color,
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              padding: '6px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            ACKNOWLEDGE
          </button>
          <button
            onClick={dismiss}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: '8px', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-ghost)' }}>
          LOG ENTRY SUPPRESSED — THIS EVENT WAS NOT SAVED
        </div>
      </div>
    </div>
  )
}

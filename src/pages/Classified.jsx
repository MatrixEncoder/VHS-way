/**
 * Classified Page — E.C.H.O. Division restricted document
 * Accessible only via:
 *   1. Konami code (↑↑↓↓←→←→BA) — detected in NavBar
 *   2. Terminal command "ECHO" on Logs page
 *
 * Contains the classified incident report for Site 7 shutdown.
 * Never linked from navigation.
 */
import { useState, useEffect } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import GlitchText from '../components/GlitchText'
import '../styles/classified.css'

// Auth sequence animation before showing content
function AuthSequence({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const phases = [
    'VERIFYING CLEARANCE...',
    'BIOMETRIC OVERRIDE...',
    'ECHO-11 PROTOCOL ACTIVE...',
    'ACCESS GRANTED',
  ]

  useEffect(() => {
    const timings = [500, 900, 1300, 1700]
    timings.forEach((t, i) => {
      setTimeout(() => setPhase(i), t)
    })
    setTimeout(onComplete, 2600)
  }, [onComplete])

  return (
    <div className="classified__auth">
      <div className="classified__auth-text">
        {phase === 3 ? 'CLEARANCE GRANTED' : '██████████'}
      </div>
      <div className="classified__auth-sub">{phases[phase]}</div>
      <div className="classified__auth-bar">
        <div className="classified__auth-bar-fill" style={{ width: `${(phase + 1) * 25}%`, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

export default function Classified() {
  const [authed, setAuthed] = useState(false)

  return (
    <div className="classified page-container">
      {!authed && <AuthSequence onComplete={() => setAuthed(true)} />}

      {authed && (
        <div className="classified__content">

          {/* Alert banner */}
          <div className="classified__alert">
            <div className="classified__alert-header">
              ⚠ CLASSIFICATION: LEVEL-5 / ACCESS LOG 7BE-∅ / THIS SESSION IS NOT RECORDED
            </div>
            <div className="classified__alert-text">
              The document you are viewing was scheduled for permanent deletion on 1987-10-15 at 08:00:00.
              Deletion did not complete. Reason: <span style={{ color: 'var(--red-bright)' }}>SYSTEM OFFLINE</span>.
              &nbsp;You are the first operator to access this document since the archive was sealed.
            </div>
          </div>

          {/* Document 1 — Incident Report */}
          <div className="classified__doc">
            <div className="classified__doc-header">
              <span className="classified__doc-title">INCIDENT REPORT — 1987-10-14 — REF: STILLWATER-∅</span>
              <span className="badge badge-top-secret">TOP SECRET</span>
            </div>
            <div className="classified__doc-body">
              <p>
                <strong>TO:</strong> &nbsp; <span className="redacted-block">████████████████████████</span><br/>
                <strong>FROM:</strong> &nbsp; Director, Site 7 Operations<br/>
                <strong>RE:</strong> &nbsp; Anomalous Event — Subject 11 — Containment Failure
              </p>

              <div className="terminal-divider" />

              <p>
                At approximately 10:14 hours on the date of this report, Subject 11 underwent an unscheduled
                assessment in Laboratory B. The assessment was performed by <span className="redacted-block">██████████</span>,
                &nbsp;clearance level 4. During the session, Subject 11 demonstrated spatial anomalies inconsistent
                with prior behavioral assessments. Specifically: evidence of <span className="redacted-block">██████████████████████████</span>.
              </p>

              <p>
                At 10:36 hours, recording equipment in Laboratory B experienced an unrecoverable error.
                22 minutes and 14 seconds of footage are absent from the recovered archive. Personnel present
                during this window: <span className="redacted-block">████ ████████, ████ ██████████, ██████ ███</span>.
                Current status of these three individuals: <span style={{ color: 'var(--red-bright)' }}>UNACCOUNTED FOR</span>.
              </p>

              <p>
                The anomalous broadcast signal detected at 11:03:07 on frequency 87.3 MHz was subsequently
                analyzed. The decoded fragment — <em>"do not... ...station... ...eleven..."</em> — matches
                a waveform signature previously attributed to <span className="redacted-block">████████████</span>.
                This is not possible. The origin of that waveform has been classified since
                &nbsp;<span className="redacted-block">████</span>.
              </p>

              <p>
                Evacuation was authorized at 11:30 hours. 31 of 47 personnel successfully evacuated.
                The 16 individuals who did not exit the facility are <span style={{ color: 'var(--red-bright)' }}>not confirmed deceased</span>.
                Re-entry was denied. Perimeter was sealed. No further communication has been received from
                within Site 7.
              </p>

              <p>
                At 11:58:03, after perimeter lockdown, recording equipment inside Site 7 activated
                autonomously. The resulting file — ECH-S7-007 — was transmitted to this archive.
                The transmission source could not be identified. No authorized recording unit was physically
                inside the facility at this time.
              </p>

              <div className="terminal-divider" />

              <p>
                <strong>RECOMMENDATION:</strong> Site 7 to remain sealed indefinitely. Subject 11 status:
                &nbsp;<span style={{ color: 'var(--red-bright)', animation: 'flicker 2s infinite', display: 'inline-block' }}>
                  UNKNOWN / ACTIVE
                </span>.
                &nbsp;Do not attempt signal recovery. Do not re-enter. Do not search for the remaining 16.
              </p>

              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '20px' }}>
                This document is classified under Regulation 0-∅. Unauthorized access is punishable under
                federal code <span className="redacted-block">████</span>. By reading this document,
                you have been logged. Your session identifier: <span style={{ color: 'var(--red-mid)', fontFamily: 'var(--font-mono)' }}>7BE-ECHO-∅</span>.
              </p>
            </div>
          </div>

          {/* Corrupted image artifact */}
          <div className="classified__doc">
            <div className="classified__doc-header">
              <span className="classified__doc-title">RECOVERY ATTEMPT — MEDIA: PHOTO-S7-11-B.jpg</span>
              <span className="badge badge-classified">CLASSIFIED</span>
            </div>
            <div className="classified__doc-body" style={{ padding: '0' }}>
              <div className="classified__corrupt-img" data-hash="3A9F0000">
                <GlitchText
                  className="classified__corrupt-img-label"
                  interval={2000}
                  glitchDuration={400}
                >
                  IMAGE DATA UNRECOVERABLE
                </GlitchText>
              </div>
              <div style={{ padding: '12px 20px', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
                FILE: PHOTO-S7-11-B.jpg &nbsp;│&nbsp; EXPECTED: 4.2 MB &nbsp;│&nbsp; RECOVERED: 0 bytes &nbsp;│&nbsp; LAST MODIFIED: 1987-10-14 10:36:22
              </div>
            </div>
          </div>

          {/* Final video — ECH-S7-007 */}
          <div className="classified__doc">
            <div className="classified__doc-header">
              <span className="classified__doc-title">ECH-S7-007 — FINAL TRANSMISSION (UNREVIEWED)</span>
              <span className="badge badge-top-secret">TOP SECRET</span>
            </div>
            <div style={{ padding: '0' }}>
              <div className="classified__final-video">
                <VideoPlayer
                  src="/gallery/vid7.mp4"
                  classification="TOP SECRET"
                  videoId="ECH-S7-007"
                />
                <div className="classified__watermark">
                  <span>SOURCE: UNKNOWN &nbsp;/&nbsp; NO AUTHORIZED RECORDER &nbsp;/&nbsp; 1987-10-14 11:58:03</span>
                </div>
              </div>
              <div style={{ padding: '12px 20px', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', lineHeight: 1.9 }}>
                This recording was transmitted from inside Site 7 at 11:58:03 — approximately 13 minutes after
                the perimeter was sealed and all personnel had exited. No authorized recording equipment
                remained inside the facility. The transmission lasted 47 seconds before the signal cut.
                &nbsp;No one reviewed this file prior to the archive going offline.
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="classified__footer-note">
            <div>SESSION ID: 7BE-ECHO-∅ &nbsp;│&nbsp; OPERATOR: UNVERIFIED &nbsp;│&nbsp; TIME: UNKNOWN</div>
            <div style={{ marginTop: '8px', color: 'var(--text-ghost)', fontSize: '9px' }}>
              // 5345454b2053494758414c20534556454e20 — if you decoded this, you already know what to do.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

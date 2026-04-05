import { useState, useEffect } from 'react'

export default function LoginOverlay({ onLogin }) {
  const [name, setName] = useState('')
  const [typedMsg, setTypedMsg] = useState('')
  const [step, setStep] = useState(0)

  const message = "SUBJECT IDENTIFICATION REQUIRED.\n\nTHE ARCHIVE HAS OBSERVED YOU.\nIT KNOWS YOU ARE LYING.\n\nIDENTIFY :"

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      setTypedMsg(message.slice(0, i))
      i++
      if (i > message.length) {
        clearInterval(t)
        setStep(1) // show input
      }
    }, 40)
    return () => clearInterval(t)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    localStorage.setItem('echo_subject_id', name)
    onLogin(name)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'black',
      zIndex: 8000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      color: 'var(--red-primary)',
    }}>
      
      {/* Scary background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/HELLO.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.25, /* keeps text readable */
        filter: 'contrast(1.5) grayscale(0.5) sepia(0.5) hue-rotate(-50deg)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ width: '400px', maxWidth: '90%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        <p style={{
          whiteSpace: 'pre-wrap',
          fontSize: '14px',
          letterSpacing: '0.15em',
          lineHeight: '1.8',
          marginBottom: '20px',
          minHeight: '150px'
        }}>
          {typedMsg}
        </p>

        {step === 1 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: 'transparent',
                border: '1px solid var(--red-dim)',
                color: 'var(--text-white)',
                fontFamily: 'var(--font-vhs)',
                fontSize: '24px',
                padding: '8px 16px',
                textAlign: 'center',
                outline: 'none',
                textTransform: 'uppercase',
                width: '100%',
                marginBottom: '24px'
              }}
            />
            <button className="btn-terminal" type="submit">LOG IN</button>
          </form>
        )}
      </div>

    </div>
  )
}

/**
 * NavBar — Terminal-style navigation
 * Looks like a classified system shell menu
 * Includes breadcrumb path, status indicator, Konami code listener
 */
import { useEffect, useState, useCallback } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

const navLinks = [
  { path: '/',         label: 'HOME',    code: '[H]' },
  { path: '/archive',  label: 'ARCHIVE', code: '[A]' },
  { path: '/logs',     label: 'LOGS',    code: '[L]' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [konamiBuffer, setKonamiBuffer] = useState([])
  const [showKonamiHint, setShowKonamiHint] = useState(false)
  const [time, setTime] = useState('')

  // Live clock display
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2,'0')
      const mm = String(now.getMinutes()).padStart(2,'0')
      const ss = String(now.getSeconds()).padStart(2,'0')
      setTime(`${hh}:${mm}:${ss}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Konami code detection
  const handleKey = useCallback((e) => {
    setKonamiBuffer(prev => {
      const next = [...prev, e.key].slice(-KONAMI.length)
      if (next.join(',') === KONAMI.join(',')) {
        navigate('/classified')
        return []
      }
      return next
    })
  }, [navigate])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Hide nav on home page to keep it fullscreen
  if (location.pathname === '/') return null

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        .echonav {
          position: sticky; top: 0; z-index: 1000;
          background: rgba(2,2,2,0.97); border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 44px; backdrop-filter: blur(2px);
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.25em;
        }
        .echonav-right {
          display: flex; align-items: center; gap: 20px; color: var(--text-muted); font-size: 10px;
        }
        @media (max-width: 768px) {
          .echonav { padding: 0 16px; flex-direction: column; height: auto; text-align: center; gap: 8px; padding-top: 8px; padding-bottom: 8px; }
          .echonav-right { display: none; } /* Hide complex system status on small mobile screens */
        }
      `}}/>
    <nav className="echonav">

      {/* Left: org tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ color: 'var(--text-muted)', letterSpacing: '0.3em', fontSize: '10px', textTransform: 'uppercase' }}>
          E.C.H.O
        </span>
        <span style={{ color: 'var(--border)', fontSize: '10px' }}>│</span>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {navLinks.map(({ path, label, code }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                padding: '0 14px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: isActive ? 'var(--red-bright)' : 'var(--text-muted)',
                borderBottom: isActive ? '2px solid var(--red-bright)' : '2px solid transparent',
                letterSpacing: '0.25em',
                fontSize: '11px',
                textTransform: 'uppercase',
                textShadow: isActive ? '0 0 10px rgba(190,30,30,0.6)' : 'none',
                transition: 'all 0.15s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right: status */}
      <div className="echonav-right">
        <span style={{ letterSpacing: '0.15em' }}>SYS:{time}</span>
        <span style={{ color: 'var(--border)' }}>│</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: 'var(--red-bright)',
            boxShadow: '0 0 5px var(--red-bright)',
            display: 'inline-block',
          }}/>
          ONLINE
        </span>
        <span style={{ color: 'var(--border)' }}>│</span>
        <span>CLEARANCE: L-2</span>
      </div>
    </nav>
    </>
  )
}

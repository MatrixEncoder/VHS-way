/**
 * App.jsx — Root application
 * Sets up React Router with all 4 pages
 * Mounts persistent global components: CRTOverlay, NavBar, AudioManager, ErrorPopup, StaticBurst
 */
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CRTOverlay   from './components/CRTOverlay'
import NavBar        from './components/NavBar'
import AudioManager  from './components/AudioManager'
import ErrorPopup    from './components/ErrorPopup'
import StaticBurst   from './components/StaticBurst'
import LoginOverlay  from './components/LoginOverlay'
import RandomVideoPopup from './components/RandomVideoPopup'
import GlobalBackground from './components/GlobalBackground'
import Home          from './pages/Home'
import Archive       from './pages/Archive'
import Logs          from './pages/Logs'
import Classified    from './pages/Classified'

// Scroll to top on route change
function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// 404 page
function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
    }}>
      <div style={{ fontFamily: 'var(--font-vhs)', fontSize: '80px', color: 'var(--red-bright)', opacity: 0.4 }}>404</div>
      <div style={{ letterSpacing: '0.4em', fontSize: '13px', textTransform: 'uppercase', marginTop: '16px' }}>
        FILE NOT FOUND IN ARCHIVE
      </div>
    </div>
  )
}

function AppContent() {
  const [loggedUser, setLoggedUser] = useState(localStorage.getItem('echo_subject_id'))

  return (
    <>
      <CRTOverlay />
      
      {!loggedUser ? (
        <LoginOverlay onLogin={setLoggedUser} />
      ) : (
        <>
          <GlobalBackground />
          <StaticBurst />
          <NavBar />
          <ErrorPopup />
          <RandomVideoPopup />
          <ScrollReset />

          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/archive"    element={<Archive />} />
            <Route path="/logs"       element={<Logs />} />
            <Route path="/classified" element={<Classified />} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
          
          {/* Audio Engine mounts only after login so music doesn't play initially */}
          <AudioManager />
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

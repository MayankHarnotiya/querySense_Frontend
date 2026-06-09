import { useState, useEffect, useCallback } from 'react'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import { decodeJwt } from './api'

function readToken() { try { return localStorage.getItem('qs_token') } catch { return null } }
function writeToken(t) { try { t ? localStorage.setItem('qs_token', t) : localStorage.removeItem('qs_token') } catch {} }

export default function App() {
  const [auth, setAuth] = useState(null)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('qs_theme') || 'dark' } catch { return 'dark' }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('qs_theme', theme) } catch {}
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  useEffect(() => {
    const t = readToken()
    if (t) {
      const c = decodeJwt(t)
      if (c && c.exp && c.exp * 1000 > Date.now()) {
        setAuth({ token: t, username: c.sub, role: c.role || 'USER' })
      } else writeToken(null)
    }
  }, [])

  function onAuthed(token) {
    const c = decodeJwt(token) || {}
    writeToken(token)
    setAuth({ token, username: c.sub || '—', role: c.role || 'USER' })
  }
  function onLogout() { writeToken(null); setAuth(null) }

  return (
    <>
      <div className="app-backdrop" />
      {auth ? (
        <Dashboard
          token={auth.token} username={auth.username} role={auth.role}
          onLogout={onLogout} theme={theme} onToggleTheme={toggleTheme}
        />
      ) : (
        <AuthScreen onAuthed={onAuthed} theme={theme} onToggleTheme={toggleTheme} />
      )}
    </>
  )
}

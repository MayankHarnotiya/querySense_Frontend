import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sun, Moon, ShieldCheck, Zap, Database } from 'lucide-react'
import { api } from '../api'
import { Logo, Spinner } from './ui'

const ease = [0.2, 0.7, 0.2, 1]

function Preview() {
  return (
    <div className="card p-5" style={{ boxShadow: 'var(--shadow-lg)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--danger)' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--warn)' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--success)' }} />
        <span className="badge ml-2">querysense · session</span>
      </div>
      <div className="flex items-start gap-2.5 mb-3">
        <div className="h-7 w-7 rounded-lg shrink-0 grid place-items-center text-primary-fg text-[12px] font-bold"
             style={{ backgroundImage: 'linear-gradient(135deg,var(--primary),var(--primary-2))' }}>You</div>
        <div className="bg-surface2 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-[13.5px]">
          top 5 cities by total sales
        </div>
      </div>
      <div className="code-block text-[12px]">{`SELECT city, SUM(sales) AS total_sales
FROM city_sales
GROUP BY city
ORDER BY total_sales DESC
LIMIT 5;`}</div>
      <div className="flex items-center gap-2 mt-3">
        <span className="badge" style={{ color: 'var(--success)', borderColor: 'color-mix(in srgb,var(--success) 40%,transparent)' }}>✓ validated</span>
        <span className="badge">read-only</span>
        <span className="badge">5 rows · 38ms</span>
      </div>
    </div>
  )
}

export default function AuthScreen({ onAuthed, theme, onToggleTheme }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!username.trim() || !password) { setMsg({ type: 'err', text: 'Username and password are required.' }); return }
    setBusy(true); setMsg(null)
    const path = mode === 'login' ? '/auth/login' : '/auth/register'
    const r = await api(path, { method: 'POST', body: { username: username.trim(), password } })
    if (mode === 'register') {
      if (r.ok) {
        setMsg({ type: 'ok', text: 'Account created — signing you in…' })
        const lr = await api('/auth/login', { method: 'POST', body: { username: username.trim(), password } })
        setBusy(false)
        if (lr.ok && lr.data?.token) onAuthed(lr.data.token)
        else setMsg({ type: 'err', text: 'Registered, but auto sign-in failed. Try signing in.' })
      } else { setBusy(false); setMsg({ type: 'err', text: r.data?.error || 'Registration failed.' }) }
      return
    }
    setBusy(false)
    if (r.ok && r.data?.token) onAuthed(r.data.token)
    else setMsg({ type: 'err', text: r.data?.error || 'Invalid credentials.' })
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left — brand / pitch */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-line relative overflow-hidden">
        <Logo size={30} />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="max-w-[480px]">
          <div className="eyebrow mb-4">AI SQL analytics</div>
          <h1 className="text-[44px] leading-[1.07] font-extrabold tracking-[-0.03em]">
            Ask your data anything,<br />in plain English.
          </h1>
          <p className="text-[16px] text-muted mt-4 leading-relaxed">
            QuerySense turns natural-language questions into <span className="text-fg font-semibold">safe,
            validated, read-only SQL</span> — executes it, and returns clean results. Every query is checked and audited.
          </p>
          <div className="mt-7"><Preview /></div>
        </motion.div>
        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
          {[[ShieldCheck, 'JWT auth + RBAC'], [Database, 'Multi-layer SQL safety'], [Zap, 'Cached & rate-limited']].map(([Icon, t]) => (
            <div key={t} className="flex items-center gap-2 text-[13px] text-muted"><Icon size={15} className="text-primary" /> {t}</div>
          ))}
        </div>
      </div>

      {/* right — form */}
      <div className="flex flex-col items-center justify-center p-6 relative">
        <button className="icon-btn absolute top-5 right-5" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="lg:hidden mb-8"><Logo size={28} /></div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="card w-full max-w-[400px] p-7" style={{ boxShadow: 'var(--shadow-md)' }}>
          <h2 className="text-[24px] font-bold tracking-[-0.01em]">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="text-[13.5px] text-muted mt-1 mb-6">{mode === 'login' ? 'Sign in to query your data.' : 'Register to start uploading datasets.'}</p>

          <div className="flex gap-1 p-1 bg-surface2 rounded-xl mb-6">
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setMsg(null) }}
                className={`flex-1 py-2 rounded-lg text-[13.5px] font-semibold transition ${mode === m ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'}`}>
                {m === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          <div onKeyDown={(e) => e.key === 'Enter' && submit()}>
            <label className="eyebrow block mb-2">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. mayank" autoComplete="username" />
            <label className="eyebrow block mb-2 mt-4">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            <button className="btn w-full mt-6" disabled={busy} onClick={submit}>
              {busy ? <Spinner /> : null}{busy ? 'Please wait…' : (mode === 'login' ? 'Sign in' : 'Create account')}{!busy && <ArrowRight size={16} />}
            </button>
          </div>

          <div className={`text-[13px] mt-4 min-h-[18px]`} style={{ color: msg?.type === 'err' ? 'var(--danger)' : 'var(--success)' }}>{msg?.text || ''}</div>
        </motion.div>

        <p className="eyebrow mt-9 text-center">Spring Boot · PostgreSQL · Redis · JSQLParser</p>
      </div>
    </div>
  )
}

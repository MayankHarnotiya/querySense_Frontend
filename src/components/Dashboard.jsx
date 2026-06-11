import { useState, useRef, useCallback } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import Sidebar from './Sidebar'
import QueryPanel from './QueryPanel'
import ResultsTable from './ResultsTable'
import UploadModal from './UploadModal'
import AdminModal from './AdminModal'
import { Logo } from './ui'
import { api } from '../api'

function historyKey(username) { return `qs_history:${username || 'anon'}` }
function loadHistory(username) { try { return JSON.parse(localStorage.getItem(historyKey(username)) || '[]') } catch { return [] } }
function saveHistory(username, h) { try { localStorage.setItem(historyKey(username), JSON.stringify(h)) } catch {} }

export default function Dashboard({ token, username, role, onLogout, theme, onToggleTheme }) {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [size, setSize] = useState(50)
const [history, setHistory] = useState(() => loadHistory(username))
  const [dataset, setDataset] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const last = useRef(null)

  const pushHistory = useCallback((q) => {
  setHistory((h) => {
    const next = [q, ...h.filter((x) => x !== q)].slice(0, 25)
    saveHistory(username, next); return next
  })
}, [username])

  const execute = useCallback(async ({ question: q, page, size: sz }) => {
    last.current = { question: q, page, size: sz }
    setBusy(true)
    const r = await api('/api/query', { method: 'POST', token, body: { question: q, page, size: sz } })
    setBusy(false)
    if (r.status === 401) { setResult({ error: 'Session expired — please sign in again.' }); setTimeout(onLogout, 1000); return }
    if (r.status === 403) { setResult({ error: 'You are not allowed to do that.' }); return }
    if (r.status === 429) { setResult({ error: 'Rate limit exceeded — please slow down a moment.' }); return }
    if (!r.ok) { setResult({ error: r.data?.error || `Request failed (${r.status}).` }); return }
    setResult(r.data)
  }, [token, onLogout])

  function onSubmit(q) {
    const text = (q ?? question).trim()
    if (!text) return
    setQuestion(text)
    pushHistory(text)
    execute({ question: text, page: 0, size })
  }
  function onPage(dir) { if (last.current) execute({ ...last.current, page: Math.max(0, (last.current.page || 0) + dir) }) }
  function onChangeSize(s) { setSize(s); if (last.current) execute({ ...last.current, page: 0, size: s }) }
  function onPickHistory(q) { setQuestion(q); pushHistory(q); execute({ question: q, page: 0, size }) }
  function onNewQuery() { setQuestion(''); setResult(null); last.current = null }

  return (
    <div className="flex">
      <Sidebar
        username={username} role={role} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme}
        history={history} onPickHistory={onPickHistory} onNewQuery={onNewQuery}
        onOpenUpload={() => setUploadOpen(true)} onOpenAdmin={() => setAdminOpen(true)} dataset={dataset}
      />

      <div className="flex-1 min-w-0 min-h-screen">
        {/* mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 h-[60px] px-4 flex items-center gap-3 border-b border-line bg-surface">
          <Logo size={24} />
          <div className="flex-1" />
          <button className="icon-btn" onClick={onToggleTheme}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button className="btn-secondary" onClick={() => setUploadOpen(true)}>Upload</button>
        </header>

        <main className="max-w-[920px] mx-auto px-5 lg:px-8 pt-8 pb-24">
          <div className="mb-6">
            <h1 className="text-[26px] font-extrabold tracking-[-0.02em]">Query workspace</h1>
            <p className="text-[14px] text-muted mt-1">Ask a question in plain English. QuerySense writes the SQL, safely.</p>
          </div>

          <QueryPanel question={question} setQuestion={setQuestion} onSubmit={onSubmit} busy={busy} />
          <ResultsTable result={result} busy={busy} onPage={onPage} size={size} onChangeSize={onChangeSize} onExample={onSubmit} hasDataset={!!dataset} onOpenUpload={() => setUploadOpen(true)} />
        </main>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} token={token} onUploaded={(d) => { setDataset({ table: d.table, rows: d.rowsInserted, cols: (d.columns || []).length }); }} />
      {role === 'ADMIN' && <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} token={token} />}
    </div>
  )
}

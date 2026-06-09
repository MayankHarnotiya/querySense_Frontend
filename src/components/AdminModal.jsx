import { useState } from 'react'
import { Users, ScrollText } from 'lucide-react'
import { api } from '../api'
import { Modal, Skeleton } from './ui'

function Table({ rows }) {
  if (!rows || !rows.length) return <div className="text-center text-faint text-[13px] py-8 font-mono">nothing to show</div>
  const cols = Object.keys(rows[0])
  return (
    <div className="overflow-auto border border-line rounded-xl max-h-[420px]">
      <table className="w-full text-[12.5px] border-collapse">
        <thead><tr>
          {cols.map((c) => <th key={c} className="text-left font-semibold text-[10.5px] uppercase tracking-wide text-muted bg-surface2 px-3 py-2 whitespace-nowrap sticky top-0">{c}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? 'var(--surface-2)' : 'transparent' }}>
              {cols.map((c) => <td key={c} className="font-mono px-3 py-2 border-t border-line whitespace-nowrap">{r[c] === null || r[c] === undefined ? <span className="text-faint">∅</span> : String(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AdminModal({ open, onClose, token }) {
  const [tab, setTab] = useState('users')
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [loadedFor, setLoadedFor] = useState(null)

  async function load(which) {
    setTab(which); setBusy(true); setErr(null); setRows(null)
    const r = await api(which === 'users' ? '/api/admin/users' : '/api/admin/audit', { token })
    setBusy(false); setLoadedFor(which)
    if (!r.ok) { setErr(r.data?.error || 'Request failed.'); return }
    if (which === 'audit') {
      setRows((r.data || []).map((a) => ({ id: a.id, user: a.username, status: a.status, rows: a.rowCount, question: (a.question || '').slice(0, 44), at: (a.createdAt || '').slice(0, 19) })))
    } else setRows(r.data)
  }

  // load on first open
  if (open && loadedFor === null && !busy) load('users')

  return (
    <Modal open={open} onClose={() => { onClose(); setLoadedFor(null) }} title="Admin console" subtitle="Restricted to ADMIN accounts." width="max-w-3xl">
      <div className="flex gap-1 p-1 bg-surface2 rounded-xl mb-5 w-fit">
        {[['users', 'Users', Users], ['audit', 'Audit log', ScrollText]].map(([k, label, Icon]) => (
          <button key={k} onClick={() => load(k)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition ${tab === k ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {busy && <div className="space-y-2.5">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}</div>}
      {!busy && err && <div className="text-[13px] rounded-xl px-4 py-3" style={{ color: 'var(--danger)', background: 'color-mix(in srgb,var(--danger) 9%,transparent)' }}>{err}</div>}
      {!busy && !err && rows && <Table rows={rows} />}
    </Modal>
  )
}

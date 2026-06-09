import { useState, useRef } from 'react'
import { UploadCloud, FileCheck2, Table2 } from 'lucide-react'
import { uploadCsv } from '../api'
import { Modal, Spinner } from './ui'

export default function UploadModal({ open, onClose, token, onUploaded }) {
  const [file, setFile] = useState(null)
  const [table, setTable] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [drag, setDrag] = useState(false)
  const [done, setDone] = useState(null)
  const inputRef = useRef()

  function pick(f) { if (!f) return; setFile(f); setMsg(null); if (!table) setTable(f.name.replace(/\.[^.]+$/, '')) }

  async function doUpload() {
    if (!file) { setMsg({ type: 'err', text: 'Choose a CSV file first.' }); return }
    setBusy(true); setMsg(null)
    const r = await uploadCsv(file, table.trim(), token)
    setBusy(false)
    if (r.ok) {
      setDone({ table: r.data.table, rows: r.data.rowsInserted, cols: (r.data.columns || []).length })
      setMsg({ type: 'ok', text: `Loaded into "${r.data.table}".` })
      onUploaded?.(r.data)
    } else setMsg({ type: 'err', text: r.data?.error || 'Upload failed.' })
  }

  return (
    <Modal open={open} onClose={onClose} title="Upload a dataset" subtitle="QuerySense reads only what you upload. Columns are typed automatically.">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed px-4 py-10 text-center transition"
        style={{ borderColor: drag ? 'var(--primary)' : 'var(--line-strong)', background: drag ? 'var(--primary-soft)' : 'transparent' }}
      >
        <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <UploadCloud size={24} className="mx-auto mb-2.5" style={{ color: drag ? 'var(--primary)' : 'var(--faint)' }} />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-[14px] font-medium"><FileCheck2 size={16} className="text-primary" /> {file.name}</div>
        ) : (
          <div className="text-[13.5px] text-muted">Drop a CSV here, or <span className="text-primary font-semibold">browse</span></div>
        )}
      </div>

      <label className="eyebrow block mb-2 mt-5">Table name</label>
      <input className="input font-mono text-[13.5px]" value={table} onChange={(e) => setTable(e.target.value)} placeholder="e.g. city_sales" />

      <button className="btn w-full mt-5" disabled={busy} onClick={doUpload}>
        {busy ? <Spinner /> : <UploadCloud size={15} />}{busy ? 'Uploading…' : 'Upload dataset'}
      </button>

      {msg && <div className="text-[13px] mt-3" style={{ color: msg.type === 'err' ? 'var(--danger)' : 'var(--success)' }}>{msg.text}</div>}
      {done && (
        <div className="mt-4 pt-4 border-t border-line flex items-center gap-2.5 text-[13px] font-mono text-muted">
          <Table2 size={15} className="text-primary" /><span className="text-fg">{done.table}</span> · {done.rows} rows · {done.cols} cols
        </div>
      )}
    </Modal>
  )
}

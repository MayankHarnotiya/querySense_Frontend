import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Terminal, AlertTriangle, ChevronsUpDown, ChevronUp, ChevronDown, Database, Copy, Check, Sparkles } from 'lucide-react'
import { Skeleton } from './ui'

const EMPTY_EXAMPLES = ['Total sales by city', 'Top 5 products by revenue', 'Count of orders per month']

function SkeletonResult() {
  return (
    <div className="card p-6 mt-6">
      <div className="flex gap-2 mb-5">
        <Skeleton className="h-6 w-24" /><Skeleton className="h-6 w-16" /><Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-24 w-full mb-5" />
      <div className="space-y-2.5">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
      </div>
    </div>
  )
}

function EmptyState({ onExample, hasDataset, onOpenUpload }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card card-hover mt-6 p-10 text-center">
      <div className="h-12 w-12 rounded-2xl grid place-items-center mx-auto text-primary-fg"
           style={{ backgroundImage: 'linear-gradient(135deg,var(--primary),var(--primary-2))' }}>
        {hasDataset ? <Sparkles size={22} /> : <Database size={22} />}
      </div>
      <h3 className="text-[18px] font-bold mt-4">{hasDataset ? 'Ask your first question' : 'Upload a dataset to begin'}</h3>
      <p className="text-[13.5px] text-muted mt-1.5 max-w-[440px] mx-auto">
        {hasDataset
          ? 'Type a question above, or start from one of these:'
          : 'QuerySense queries the data you upload. Add a CSV, then ask questions about it in plain English.'}
      </p>
      {hasDataset ? (
        <div className="flex flex-wrap gap-2 justify-center mt-5">
          {EMPTY_EXAMPLES.map((ex) => <button key={ex} className="chip" onClick={() => onExample(ex)}>{ex}</button>)}
        </div>
      ) : (
        <button className="btn mt-5 mx-auto" onClick={onOpenUpload}>Upload a CSV</button>
      )}
    </motion.div>
  )
}

function DataTable({ rows }) {
  const [sort, setSort] = useState({ key: null, dir: 1 })
  const cols = rows.length ? Object.keys(rows[0]) : []
  const sorted = useMemo(() => {
    if (!sort.key) return rows
    const copy = [...rows]
    copy.sort((a, b) => {
      const x = a[sort.key], y = b[sort.key]
      if (x === y) return 0
      if (x === null || x === undefined) return 1
      if (y === null || y === undefined) return -1
      const nx = Number(x), ny = Number(y)
      const both = !isNaN(nx) && !isNaN(ny)
      return (both ? nx - ny : String(x).localeCompare(String(y))) * sort.dir
    })
    return copy
  }, [rows, sort])

  function toggle(k) { setSort((s) => s.key === k ? { key: k, dir: -s.dir } : { key: k, dir: 1 }) }

  if (!rows.length) return <div className="text-center text-faint text-[13.5px] py-12 font-mono border border-line rounded-xl">no rows returned</div>

  return (
    <div className="overflow-auto border border-line rounded-xl max-h-[480px]">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} onClick={() => toggle(c)}
                  className="text-left font-semibold text-[11px] uppercase tracking-wide text-muted bg-surface2 px-3.5 py-2.5 whitespace-nowrap sticky top-0 cursor-pointer select-none hover:text-fg transition">
                <span className="inline-flex items-center gap-1">{c}
                  {sort.key === c ? (sort.dir === 1 ? <ChevronUp size={13} /> : <ChevronDown size={13} />) : <ChevronsUpDown size={12} className="opacity-40" />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="transition-colors" style={{ background: i % 2 ? 'var(--surface-2)' : 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 ? 'var(--surface-2)' : 'transparent')}>
              {cols.map((c) => (
                <td key={c} className="font-mono px-3.5 py-2.5 border-t border-line whitespace-nowrap">
                  {row[c] === null || row[c] === undefined ? <span className="text-faint">∅</span> : String(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ResultsTable({ result, busy, onPage, size, onChangeSize, onExample, hasDataset, onOpenUpload }) {
  const [copied, setCopied] = useState(false)
  if (busy && !result) return <SkeletonResult />
  if (busy) return <SkeletonResult />
  if (!result) return <EmptyState onExample={onExample} hasDataset={hasDataset} onOpenUpload={onOpenUpload} />

  if (result.error) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card mt-6 p-5">
        <div className="flex items-start gap-3 text-[14px] rounded-xl px-4 py-3.5"
             style={{ color: 'var(--danger)', background: 'color-mix(in srgb,var(--danger) 9%,transparent)', border: '1px solid color-mix(in srgb,var(--danger) 30%,transparent)' }}>
          <AlertTriangle size={17} className="shrink-0 mt-0.5" /><span>{result.error}</span>
        </div>
      </motion.div>
    )
  }

  const { generatedSql, rows = [], page = 0, cached } = result
  function copySql() { navigator.clipboard?.writeText(generatedSql || ''); setCopied(true); setTimeout(() => setCopied(false), 1400) }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="card mt-6 p-6">
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="badge" style={cached
          ? { color: 'var(--warn)', borderColor: 'color-mix(in srgb,var(--warn) 40%,transparent)' }
          : { color: 'var(--success)', borderColor: 'color-mix(in srgb,var(--success) 40%,transparent)' }}>
          {cached ? '◷ cached' : '● live'}
        </span>
        <span className="badge">{rows.length} row{rows.length === 1 ? '' : 's'}</span>
        <span className="badge">page {page}</span>
      </div>

      {generatedSql && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 eyebrow"><Terminal size={13} className="text-primary" /> generated sql</span>
            <button className="btn-secondary !py-1.5 !px-2.5 text-[12px]" onClick={copySql}>
              {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
          <div className="code-block">{generatedSql}</div>
        </div>
      )}

      <DataTable rows={rows} />

      <div className="flex items-center gap-2.5 mt-4 flex-wrap">
        <button className="btn-secondary" onClick={() => onPage(-1)} disabled={page <= 0}><ChevronLeft size={15} /> Prev</button>
        <button className="btn-secondary" onClick={() => onPage(1)}>Next <ChevronRight size={15} /></button>
        <div className="flex-1" />
        <label className="text-[12.5px] text-faint">Rows / page</label>
        <select className="input !w-[88px] !py-1.5 !px-2.5 text-[13px]" value={size} onChange={(e) => onChangeSize(Number(e.target.value))}>
          {[25, 50, 100, 200].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    </motion.div>
  )
}

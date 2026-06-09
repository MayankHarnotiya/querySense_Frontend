import { useState } from 'react'
import { motion } from 'framer-motion'
import { CornerDownLeft, Sparkles } from 'lucide-react'
import { Spinner } from './ui'

const EXAMPLES = [
  'Total sales by city',
  'Top 5 products by revenue',
  'Average salary per department',
  'Monthly signups in 2024',
]

export default function QueryPanel({ question, setQuestion, onSubmit, busy }) {
  const [focused, setFocused] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div
        className="card p-2.5 transition"
        style={{ borderColor: focused ? 'var(--primary)' : 'var(--line)', boxShadow: focused ? '0 0 0 4px var(--ring)' : 'var(--shadow-sm)' }}
      >
        <div className="flex items-start gap-2.5 px-2 pt-2">
          <Sparkles size={18} className="text-primary mt-2.5 shrink-0" />
          <textarea
            className="flex-1 bg-transparent outline-none resize-none text-[16px] leading-relaxed text-fg placeholder:text-faint py-2 min-h-[64px] max-h-[220px]"
            placeholder="Ask anything about your data — e.g. “Which 10 customers spent the most last quarter?”"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onSubmit() }}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-1.5">
          <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-faint">
            <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded border border-line">⌘/Ctrl</kbd>
            <span>+</span>
            <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded border border-line inline-flex items-center"><CornerDownLeft size={11} /></kbd>
            <span>to run</span>
          </span>
          <div className="flex-1 sm:flex-none" />
          <button className="btn min-w-[148px]" disabled={busy || !question.trim()} onClick={() => onSubmit()}>
            {busy ? (
              <span className="inline-flex items-center gap-1.5 text-primary-fg"><span className="dot" /><span className="dot" /><span className="dot" /> Generating</span>
            ) : (
              <><Sparkles size={15} /> Generate SQL</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-[12.5px] text-faint self-center mr-0.5">Try:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} className="chip" onClick={() => onSubmit(ex)} disabled={busy}>{ex}</button>
        ))}
      </div>
    </motion.div>
  )
}

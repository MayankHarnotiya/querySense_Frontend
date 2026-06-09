import { Plus, History, UploadCloud, ShieldCheck, LogOut, Sun, Moon, Database, MessageSquare } from 'lucide-react'
import { Logo } from './ui'

export default function Sidebar({
  username, role, onLogout, theme, onToggleTheme,
  history, onPickHistory, onNewQuery, onOpenUpload, onOpenAdmin, dataset,
}) {
  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 h-screen sticky top-0 border-r border-line bg-surface">
      <div className="px-5 h-[64px] flex items-center border-b border-line"><Logo size={26} /></div>

      <div className="p-3">
        <button className="btn w-full" onClick={onNewQuery}><Plus size={16} /> New query</button>
      </div>

      <div className="px-3">
        <button className="navlink" onClick={onOpenUpload}><UploadCloud size={16} /> Upload dataset</button>
        {role === 'ADMIN' && (
          <button className="navlink" onClick={onOpenAdmin}><ShieldCheck size={16} /> Admin console</button>
        )}
      </div>

      {dataset && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-lg border border-line bg-surface2">
          <div className="eyebrow mb-1">active dataset</div>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <Database size={14} className="text-primary" />
            <span className="font-mono truncate">{dataset.table}</span>
          </div>
          <div className="text-[11.5px] text-faint mt-0.5 font-mono">{dataset.rows} rows · {dataset.cols} cols</div>
        </div>
      )}

      <div className="px-5 pt-5 pb-2 flex items-center gap-2 text-faint">
        <History size={13} /><span className="eyebrow">history</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {history.length === 0 ? (
          <div className="text-[12.5px] text-faint px-3 py-2">Your recent questions appear here.</div>
        ) : history.map((q, i) => (
          <button key={i} className="navlink" onClick={() => onPickHistory(q)} title={q}>
            <MessageSquare size={14} className="shrink-0 text-faint" />
            <span className="truncate">{q}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5 px-1.5 py-1.5">
          <div className="h-8 w-8 rounded-full grid place-items-center text-primary-fg text-[12px] font-bold shrink-0"
               style={{ backgroundImage: 'linear-gradient(135deg,var(--primary),var(--primary-2))' }}>
            {(username || '?').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold truncate">{username}</div>
            <div className="text-[11px] text-faint">{role}</div>
          </div>
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="icon-btn" onClick={onLogout} aria-label="Log out"><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  )
}

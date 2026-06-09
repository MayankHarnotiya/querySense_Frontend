import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" style={{ opacity: 0.25 }} />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function Logo({ size = 28 }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id="qsg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--primary-2)" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#qsg)" />
        <path d="M11 20.5 16 9l5 11.5" fill="none" stroke="white" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
        <circle cx="16" cy="22.5" r="1.7" fill="white" />
      </svg>
      <span className="font-extrabold tracking-[-0.02em] text-[18px] text-fg">QuerySense</span>
    </span>
  )
}

export function Modal({ open, onClose, title, subtitle, children, width = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" style={{ background: 'var(--overlay)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className={`relative card w-full ${width} p-6`}
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <button className="icon-btn absolute top-4 right-4" onClick={onClose} aria-label="Close"><X size={16} /></button>
            {title && <h3 className="text-[20px] font-bold tracking-[-0.01em]">{title}</h3>}
            {subtitle && <p className="text-[13.5px] text-muted mt-1">{subtitle}</p>}
            <div className="mt-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

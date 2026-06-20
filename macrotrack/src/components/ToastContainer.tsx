import { useToast } from '../context/useToast'
import type { ToastType } from '../context/ToastContext'

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
    </svg>
  )
}

const STYLES: Record<ToastType, { wrap: string; icon: string; text: string; IconComp: () => JSX.Element }> = {
  success: {
    wrap: 'border-green-200 dark:border-green-800/60',
    icon: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400',
    text: 'text-gray-800 dark:text-zinc-100',
    IconComp: CheckIcon,
  },
  error: {
    wrap: 'border-red-200 dark:border-red-800/60',
    icon: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
    text: 'text-gray-800 dark:text-zinc-100',
    IconComp: XIcon,
  },
  info: {
    wrap: 'border-blue-200 dark:border-blue-800/60',
    icon: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    text: 'text-gray-800 dark:text-zinc-100',
    IconComp: InfoIcon,
  },
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[100] pointer-events-none">
      {toasts.map(toast => {
        const s = STYLES[toast.type]
        const Icon = s.IconComp
        return (
          <div
            key={toast.id}
            style={{ animation: 'toastIn 0.28s cubic-bezier(0.34,1.56,0.64,1)' }}
            className={`pointer-events-auto flex items-center gap-3 pl-3 pr-3 py-3 rounded-2xl shadow-lg bg-stone-50 dark:bg-zinc-800 border ${s.wrap} min-w-[220px] max-w-[300px]`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${s.icon}`}>
              <Icon />
            </div>
            <span className={`text-sm font-medium flex-1 leading-snug ${s.text}`}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-300 dark:text-zinc-600 hover:text-gray-500 dark:hover:text-zinc-400 transition-colors flex-shrink-0"
            >
              <XIcon />
            </button>
          </div>
        )
      })}
    </div>
  )
}

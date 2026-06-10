import { BookOpen, Home, RefreshCw, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onClearProgress: () => void;
  onToggleExplanations: () => void;
  explanationsOn: boolean;
  isExplanationsView: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({
  onClearProgress,
  onToggleExplanations,
  explanationsOn,
  isExplanationsView,
  darkMode,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm leading-tight tracking-tight">Life in the UK</span>
                <span className="px-1.5 py-0.5 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-bold rounded tracking-wide uppercase">
                  Syllabus 2026
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-tight">Official Citizenship Simulator</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleExplanations}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                border transition-all duration-200
                ${explanationsOn
                  ? 'bg-sky-600 border-sky-500 text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {isExplanationsView ? <Home className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isExplanationsView ? 'Home' : 'Explanations'}</span>
            </button>

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onClearProgress}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Progress</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

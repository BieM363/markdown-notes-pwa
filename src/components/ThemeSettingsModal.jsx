import React from 'react';
import { Settings, Sun, Moon, BookOpen, X } from 'lucide-react';

export function ThemeSettingsModal({ isOpen, onClose, theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transition-colors duration-200">
        <div className="p-4 md:p-5 border-b border-theme-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/15 text-indigo-500 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-theme-text text-base">Pengaturan Tampilan Baca</h3>
              <p className="text-xs text-theme-muted">Kustomisasi tema warna & tipografi sesuai kenyamanan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-theme-muted hover:text-theme-text rounded-lg hover:bg-theme-surface transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
              Tema Mode
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-slate-950 text-indigo-400 shadow-md ring-2 ring-indigo-500/20 font-bold'
                    : 'border-slate-700/60 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-white text-indigo-700 shadow-md ring-2 ring-indigo-500/25 font-bold'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-white'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                onClick={() => setTheme('sepia')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition ${
                  theme === 'sepia'
                    ? 'border-amber-700 bg-[#fbf0d9] text-[#433422] shadow-md ring-2 ring-amber-500/25 font-bold'
                    : 'border-amber-900/30 bg-[#fbf0d9]/80 text-[#6b5536] hover:bg-[#fbf0d9]'
                }`}
              >
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>Sepia Mode</span>
              </button>
            </div>
          </div>

          {/* Font Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
              Ukuran Font (Reader)
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs font-medium">
              {[
                { label: 'Kecil', val: 'sm', desc: '0.875rem' },
                { label: 'Normal', val: 'base', desc: '1.0rem' },
                { label: 'Besar', val: 'lg', desc: '1.15rem' },
                { label: 'Ekstra', val: 'xl', desc: '1.35rem' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setFontSize(opt.val)}
                  className={`py-2 px-1 rounded-xl border transition flex flex-col items-center gap-0.5 ${
                    fontSize === opt.val
                      ? 'border-indigo-500 bg-indigo-600/15 text-indigo-500 dark:text-indigo-400 font-bold shadow-sm'
                      : 'border-theme-border bg-theme-subtle text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-[10px] opacity-70 font-mono">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-theme-muted uppercase tracking-wider block">
              Gaya Font Teks
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              <button
                onClick={() => setFontFamily('sans')}
                className={`py-2.5 px-3 rounded-xl border font-sans transition ${
                  fontFamily === 'sans'
                    ? 'border-indigo-500 bg-indigo-600/15 text-indigo-500 dark:text-indigo-400 font-bold shadow-sm'
                    : 'border-theme-border bg-theme-subtle text-theme-muted hover:text-theme-text'
                }`}
              >
                Sans (Inter)
              </button>

              <button
                onClick={() => setFontFamily('serif')}
                className={`py-2.5 px-3 rounded-xl border font-serif transition ${
                  fontFamily === 'serif'
                    ? 'border-indigo-500 bg-indigo-600/15 text-indigo-500 dark:text-indigo-400 font-bold shadow-sm'
                    : 'border-theme-border bg-theme-subtle text-theme-muted hover:text-theme-text'
                }`}
              >
                Serif (Novel)
              </button>

              <button
                onClick={() => setFontFamily('mono')}
                className={`py-2.5 px-3 rounded-xl border font-mono transition ${
                  fontFamily === 'mono'
                    ? 'border-indigo-500 bg-indigo-600/15 text-indigo-500 dark:text-indigo-400 font-bold shadow-sm'
                    : 'border-theme-border bg-theme-subtle text-theme-muted hover:text-theme-text'
                }`}
              >
                Monospace
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-theme-subtle border-t border-theme-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition active:scale-95"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

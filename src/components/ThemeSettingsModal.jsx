import React from 'react';
import { Settings, Sun, Moon, BookOpen, Type, X } from 'lucide-react';

export function ThemeSettingsModal({ isOpen, onClose, theme, setTheme, fontSize, setFontSize, fontFamily, setFontFamily }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Pengaturan Tampilan Baca</h3>
              <p className="text-xs text-slate-400">Kustomisasi tema warna & tipografi sesuai kenyamanan</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Tema Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-slate-950 text-indigo-400 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition ${
                  theme === 'light'
                    ? 'border-indigo-500 bg-white text-slate-900 shadow-md ring-2 ring-indigo-500/20 font-semibold'
                    : 'border-slate-800 bg-slate-100 text-slate-700 hover:bg-white'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                onClick={() => setTheme('sepia')}
                className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition ${
                  theme === 'sepia'
                    ? 'border-amber-600 bg-[#fbf0d9] text-[#433422] shadow-md ring-2 ring-amber-500/20 font-bold'
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
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Ukuran Font
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs font-medium">
              {[
                { label: 'Kecil', val: 'sm' },
                { label: 'Normal', val: 'base' },
                { label: 'Besar', val: 'lg' },
                { label: 'Ekstra', val: 'xl' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setFontSize(opt.val)}
                  className={`py-2 rounded-lg border transition ${
                    fontSize === opt.val
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Gaya Font Teks
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              <button
                onClick={() => setFontFamily('sans')}
                className={`py-2.5 px-3 rounded-xl border font-sans transition ${
                  fontFamily === 'sans'
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400 font-semibold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Sans (Inter)
              </button>

              <button
                onClick={() => setFontFamily('serif')}
                className={`py-2.5 px-3 rounded-xl border font-serif transition ${
                  fontFamily === 'serif'
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400 font-semibold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Serif (Novel)
              </button>

              <button
                onClick={() => setFontFamily('mono')}
                className={`py-2.5 px-3 rounded-xl border font-mono transition ${
                  fontFamily === 'mono'
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400 font-semibold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Monospace
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

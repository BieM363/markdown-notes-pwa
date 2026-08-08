import React, { useState } from 'react';
import { 
  Menu, BookOpen, Edit3, Columns, Settings, Download, 
  Maximize2, Minimize2, Search, Plus, Upload, Check, ChevronDown, FileCode, HardDrive
} from 'lucide-react';

export function Header({
  activeNote,
  viewMode,
  setViewMode,
  onToggleSidebar,
  onOpenSearch,
  onOpenImport,
  onOpenSettings,
  onNewNote,
  onExportMd,
  onExportHtml,
  isZenMode,
  onToggleZenMode
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 shrink-0 z-30 select-none">
      {/* Left section: Sidebar toggle & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 text-sm">
            ProjectNotes
          </span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
            {activeNote ? activeNote.title : 'Pilih Catatan'}
          </h2>
        </div>
      </div>

      {/* Middle section: View Mode Switcher */}
      <div className="hidden md:flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setViewMode('reader')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
            viewMode === 'reader'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reader</span>
        </button>

        <button
          onClick={() => setViewMode('editor')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
            viewMode === 'editor'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
            viewMode === 'split'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>
      </div>

      {/* Right section: Actions (Search, Import, Export, Settings, Zen) */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 text-xs transition"
          title="Cari Catatan (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-indigo-400" />
          <span className="hidden lg:inline">Cari...</span>
          <kbd className="hidden lg:inline text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={onNewNote}
          className="p-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl transition"
          title="Buat Catatan Baru"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenImport}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition hidden sm:flex"
          title="Import File .md"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Export Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!activeNote}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 rounded-xl transition flex items-center gap-1"
            title="Export Catatan"
          >
            <Download className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:inline" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1 z-50 animate-fadeIn text-xs">
              <button
                onClick={() => {
                  onExportMd();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>Unduh File (.md)</span>
              </button>
              <button
                onClick={() => {
                  onExportHtml();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Export Halaman (.html)</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          title="Pengaturan Tampilan Baca"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleZenMode}
          className={`p-2 rounded-xl transition ${
            isZenMode
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title={isZenMode ? 'Keluar Mode Zen' : 'Mode Fullscreen (Zen Mode)'}
        >
          {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}

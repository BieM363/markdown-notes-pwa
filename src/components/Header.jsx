import React, { useState } from 'react';
import { 
  Menu, BookOpen, Edit3, Columns, Settings, Download, 
  Maximize2, Minimize2, Search, Plus, Upload, ChevronDown, FileCode, ListTree
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
  onToggleZenMode,
  onToggleMobileToc
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-3 md:px-4 flex items-center justify-between gap-2 shrink-0 z-30 select-none">
      {/* Left section: Sidebar toggle & Brand Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition active:scale-95"
          title="Buka / Tutup Sidebar Navigasi"
        >
          <Menu className="w-5 h-5 text-indigo-400" />
        </button>

        <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
          <div className="flex flex-col">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 text-xs md:text-sm tracking-tight truncate">
              ProjectNotes
            </span>
            <span className="text-[9px] text-slate-400 font-mono hidden sm:inline">
              by <strong className="text-indigo-300 font-semibold">BieM363</strong>
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">/</span>

          <h2 className="text-xs font-semibold text-slate-200 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
            {activeNote ? activeNote.title : 'Pilih Catatan'}
          </h2>
        </div>
      </div>

      {/* Middle section: View Mode Switcher (Desktop & Mobile Segmented Control) */}
      <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setViewMode('reader')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
            viewMode === 'reader'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode Baca (Reader)"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Baca</span>
        </button>

        <button
          onClick={() => setViewMode('editor')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
            viewMode === 'editor'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode Edit (Editor)"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
            viewMode === 'split'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode Split (Editor & Reader)"
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Mobile TOC Button */}
        <button
          onClick={onToggleMobileToc}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          title="Daftar Isi (TOC)"
        >
          <ListTree className="w-4 h-4 text-indigo-400" />
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 text-xs transition"
          title="Cari Catatan (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline">Cari</span>
          <kbd className="hidden lg:inline text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={onNewNote}
          className="p-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl transition active:scale-95"
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
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 rounded-xl transition flex items-center gap-0.5"
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
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition hidden sm:flex"
          title="Pengaturan Tampilan Baca"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleZenMode}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          title="Mode Fullscreen (Zen Mode)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

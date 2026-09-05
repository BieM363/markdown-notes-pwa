import React, { useState } from 'react';
import { 
  Menu, BookOpen, Edit3, Columns, Settings, Download, 
  Maximize2, Search, Plus, Upload, ChevronDown, FileCode, ListTree
} from 'lucide-react';

export function Header({
  activeNote,
  viewMode,
  setViewMode,
  onToggleSidebar,
  onOpenSearch,
  onOpenImport,
  onOpenSettings,
  onOpenPdfExport,
  onNewNote,
  onExportMd,
  onExportHtml,
  isZenMode,
  onToggleZenMode,
  onToggleMobileToc
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 bg-theme-main border-b border-theme-border px-3 md:px-4 flex items-center justify-between gap-2 shrink-0 z-30 select-none transition-colors duration-200">
      {/* Left section: Sidebar toggle & Brand Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-theme-muted hover:text-theme-text rounded-xl hover:bg-theme-surface transition active:scale-95"
          title="Buka / Tutup Sidebar Navigasi"
        >
          <Menu className="w-5 h-5 text-indigo-500" />
        </button>

        <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
          <div className="flex flex-col">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-xs md:text-sm tracking-tight truncate">
              ProjectNotes
            </span>
            <span className="text-[9px] text-theme-muted font-mono hidden sm:inline">
              by <strong className="text-indigo-500 font-semibold">BieM363</strong>
            </span>
          </div>

          <span className="text-theme-muted/40 hidden sm:inline">/</span>

          <h2 className="text-xs font-semibold text-theme-text truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
            {activeNote ? activeNote.title : 'Pilih Catatan'}
          </h2>
        </div>
      </div>

      {/* Middle section: View Mode Switcher */}
      <div className="flex items-center p-1 bg-theme-subtle rounded-xl border border-theme-border text-xs">
        <button
          onClick={() => setViewMode('reader')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
            viewMode === 'reader'
              ? 'bg-indigo-600 text-white shadow-sm font-semibold'
              : 'text-theme-muted hover:text-theme-text'
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
              : 'text-theme-muted hover:text-theme-text'
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
              : 'text-theme-muted hover:text-theme-text'
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
          className="lg:hidden p-2 text-theme-muted hover:text-theme-text hover:bg-theme-surface rounded-xl transition"
          title="Daftar Isi (TOC)"
        >
          <ListTree className="w-4 h-4 text-indigo-500" />
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-subtle hover:bg-theme-surface text-theme-muted hover:text-theme-text rounded-xl border border-theme-border text-xs transition"
          title="Cari Catatan (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-indigo-500" />
          <span className="hidden md:inline">Cari</span>
          <kbd className="hidden lg:inline text-[9px] bg-theme-surface text-theme-muted px-1.5 py-0.5 rounded border border-theme-border">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={onNewNote}
          className="p-2 bg-indigo-600/15 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl transition active:scale-95 border border-indigo-500/20"
          title="Buat Catatan Baru"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenImport}
          className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-surface rounded-xl transition hidden sm:flex"
          title="Import File .md"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Export Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!activeNote}
            className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-surface disabled:opacity-40 rounded-xl transition flex items-center gap-0.5"
            title="Export / Unduh Catatan"
          >
            <Download className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 text-theme-muted hidden sm:inline" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-theme-card border border-theme-border rounded-xl shadow-2xl p-1.5 z-50 animate-fadeIn text-xs">
              <button
                onClick={() => {
                  if (onOpenPdfExport) onOpenPdfExport();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/10 rounded-lg flex items-center gap-2 font-semibold transition"
              >
                <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="flex flex-col">
                  <span>Unduh PDF (Format Buku)</span>
                  <span className="text-[10px] text-theme-muted font-normal">Estetik, ada logo & TOC</span>
                </div>
              </button>

              <div className="my-1 border-t border-theme-border" />

              <button
                onClick={() => {
                  onExportMd();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-theme-text hover:bg-theme-surface rounded-lg flex items-center gap-2 transition"
              >
                <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Unduh File (.md)</span>
              </button>

              <button
                onClick={() => {
                  onExportHtml();
                  setShowExportMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-theme-text hover:bg-theme-surface rounded-lg flex items-center gap-2 transition"
              >
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Export Halaman (.html)</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-surface rounded-xl transition hidden sm:flex"
          title="Pengaturan Tampilan Baca"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleZenMode}
          className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-surface rounded-xl transition"
          title="Mode Fullscreen (Zen Mode)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

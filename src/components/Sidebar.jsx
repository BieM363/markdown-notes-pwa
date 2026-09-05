import React, { useState } from 'react';
import { 
  FileText, Folder, Star, Pin, Trash2, Plus, Upload, 
  ShieldCheck, Sparkles, X, Code2
} from 'lucide-react';
import { getReadingTime } from '../db/db';

export function Sidebar({
  isOpen,
  onCloseSidebar,
  notes = [],
  folders = [],
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  onTogglePin,
  onToggleFavorite,
  onOpenImport,
  onOpenSearch
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favorites' | 'pinned'
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  // Filter notes based on tab & selected folder
  const filteredNotes = notes.filter(n => {
    if (selectedFolderId && n.folderId !== selectedFolderId) return false;
    if (activeTab === 'favorites') return n.isFavorite;
    if (activeTab === 'pinned') return n.isPinned;
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onCloseSidebar}
          className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 bg-theme-subtle flex flex-col transition-all duration-300 ease-in-out shadow-2xl md:shadow-none shrink-0 border-r border-theme-border ${
          isOpen
            ? 'w-72 translate-x-0 opacity-100'
            : '-translate-x-full md:translate-x-0 w-72 md:w-0 md:border-none overflow-hidden opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'
        }`}
      >
        {/* Inner container to keep width fixed when sidebar shrinks */}
        <div className="w-72 flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-4 border-b border-theme-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-theme-text text-sm tracking-tight flex items-center gap-1.5">
                  ProjectNotes
                  <span className="bg-indigo-500/15 text-indigo-500 dark:text-indigo-300 border border-indigo-500/30 text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold">
                    PWA
                  </span>
                </h1>
                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono flex items-center gap-1 font-semibold">
                  <Code2 className="w-3 h-3 text-cyan-500" />
                  By BieM363
                </p>
              </div>
            </div>

            <button
              onClick={onCloseSidebar}
              className="p-1.5 text-theme-muted hover:text-theme-text rounded-lg hover:bg-theme-surface transition"
              title="Tutup Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="p-2.5 border-b border-theme-border flex items-center justify-between text-xs gap-1 bg-theme-main/40">
            <button
              onClick={() => { setActiveTab('all'); setSelectedFolderId(null); }}
              className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'all' && !selectedFolderId
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              Semua ({notes.length})
            </button>

            <button
              onClick={() => setActiveTab('pinned')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
                activeTab === 'pinned'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <Pin className="w-3 h-3 text-amber-500" />
              Pin
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
                activeTab === 'favorites'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <Star className="w-3 h-3 text-amber-500" />
              Favorit
            </button>
          </div>

          {/* Folder Pills */}
          {folders.length > 0 && (
            <div className="px-3 py-2 border-b border-theme-border bg-theme-main/20">
              <p className="text-[10px] uppercase font-bold text-theme-muted tracking-wider mb-1.5 px-1">
                Folder Dokumentasi
              </p>
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition ${
                    selectedFolderId === null
                      ? 'bg-theme-surface text-theme-text font-semibold border border-theme-border'
                      : 'bg-theme-main/60 text-theme-muted hover:text-theme-text'
                  }`}
                >
                  Semua
                </button>
                {folders.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition flex items-center gap-1.5 ${
                      selectedFolderId === f.id
                        ? 'bg-indigo-600/20 text-indigo-500 dark:text-indigo-300 border border-indigo-500/40 font-semibold'
                        : 'bg-theme-main/60 text-theme-muted hover:text-theme-text border border-theme-border'
                    }`}
                  >
                    <Folder className="w-3 h-3 text-amber-500" />
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-theme-muted text-xs flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-8 h-8 text-theme-muted/50" />
                <p>Belum ada catatan pada kategori ini.</p>
              </div>
            ) : (
              filteredNotes.map(n => {
                const isActive = n.id === activeNoteId;
                const { minutes } = getReadingTime(n.content);

                return (
                  <div
                    key={n.id}
                    onClick={() => onSelectNote(n.id)}
                    className={`group relative p-3 rounded-xl cursor-pointer transition flex items-start justify-between gap-2 border ${
                      isActive
                        ? 'bg-theme-card border-indigo-500/70 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-theme-main/40 border-transparent hover:bg-theme-surface hover:border-theme-border'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-500' : 'text-theme-muted'}`} />
                        <h3 className={`text-xs font-semibold truncate ${isActive ? 'text-theme-text font-bold' : 'text-theme-text group-hover:text-indigo-500'}`}>
                          {n.title.replace(/\.md$/, '')}
                        </h3>
                      </div>

                      <p className="text-[11px] text-theme-muted line-clamp-1">
                        {n.content.replace(/[#*`_>-]/g, '').trim() || 'Tanpa konten...'}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-theme-muted pt-0.5">
                        <span>~{minutes} mnt</span>
                        <span>•</span>
                        <span>{new Date(n.updatedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                        {n.author && (
                          <span className="text-[9px] bg-theme-surface text-indigo-500 dark:text-indigo-300 px-1 py-0.2 rounded font-mono border border-theme-border">
                            {n.author}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Badges */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(n.id, n.isPinned);
                        }}
                        className={`p-1 rounded hover:bg-theme-surface ${n.isPinned ? 'text-amber-500' : 'text-theme-muted hover:text-theme-text'}`}
                        title={n.isPinned ? 'Unpin' : 'Pin Catatan'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(n.id, n.isFavorite);
                        }}
                        className={`p-1 rounded hover:bg-theme-surface ${n.isFavorite ? 'text-amber-500' : 'text-theme-muted hover:text-theme-text'}`}
                        title={n.isFavorite ? 'Hapus Favorit' : 'Tambah Favorit'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Hapus catatan "${n.title}"?`)) {
                            onDeleteNote(n.id);
                          }
                        }}
                        className="p-1 rounded hover:bg-theme-surface text-theme-muted hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-theme-border bg-theme-subtle space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={onNewNote}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Catatan Baru
              </button>

              <button
                onClick={onOpenImport}
                className="p-2 bg-theme-card hover:bg-theme-surface text-theme-muted hover:text-theme-text rounded-xl border border-theme-border transition"
                title="Import File .md"
              >
                <Upload className="w-4 h-4 text-indigo-500" />
              </button>
            </div>

            <div className="text-[10px] text-center text-theme-muted font-mono pt-1 border-t border-theme-border flex items-center justify-between">
              <span className="flex items-center gap-1 text-theme-muted">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                100% Offline
              </span>
              <span className="text-indigo-500 font-bold">Dev: BieM363</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

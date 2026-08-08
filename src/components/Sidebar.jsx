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
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
                ProjectNotes
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold">
                  PWA
                </span>
              </h1>
              <p className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 font-semibold">
                <Code2 className="w-3 h-3 text-cyan-400" />
                By BieM363
              </p>
            </div>
          </div>

          <button
            onClick={onCloseSidebar}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Tutup Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs gap-1 bg-slate-900/40">
          <button
            onClick={() => { setActiveTab('all'); setSelectedFolderId(null); }}
            className={`flex-1 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'all' && !selectedFolderId
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({notes.length})
          </button>

          <button
            onClick={() => setActiveTab('pinned')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'pinned'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pin className="w-3 h-3 text-amber-400" />
            Pin
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 ${
              activeTab === 'favorites'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400" />
            Favorit
          </button>
        </div>

        {/* Folder Pills */}
        {folders.length > 0 && (
          <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-900/20">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1.5 px-1">
              Folder Dokumentasi
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              <button
                onClick={() => setSelectedFolderId(null)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition ${
                  selectedFolderId === null
                    ? 'bg-slate-800 text-white font-medium'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
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
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-medium'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Folder className="w-3 h-3 text-amber-400" />
                  <span>{f.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-slate-600" />
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
                      ? 'bg-slate-900 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/40 border-transparent hover:bg-slate-900/60 hover:border-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <h3 className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {n.title.replace(/\.md$/, '')}
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {n.content.replace(/[#*`_>-]/g, '').trim() || 'Tanpa konten...'}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                      <span>~{minutes} mnt</span>
                      <span>•</span>
                      <span>{new Date(n.updatedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                      {n.author && (
                        <span className="text-[9px] bg-slate-800 text-indigo-300 px-1 py-0.2 rounded font-mono">
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
                      className={`p-1 rounded hover:bg-slate-800 ${n.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                      title={n.isPinned ? 'Unpin' : 'Pin Catatan'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(n.id, n.isFavorite);
                      }}
                      className={`p-1 rounded hover:bg-slate-800 ${n.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
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
                      className="p-1 rounded hover:bg-slate-800 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
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
        <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
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
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition"
              title="Import File .md"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-500 font-mono pt-1 border-t border-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              100% Offline
            </span>
            <span className="text-indigo-400 font-bold">Dev: BieM363</span>
          </div>
        </div>
      </aside>
    </>
  );
}

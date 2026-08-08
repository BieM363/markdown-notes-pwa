import React, { useState, useEffect } from 'react';
import { Search, FileText, Tag, Folder, X, ArrowRight } from 'lucide-react';

export function SearchModal({ isOpen, onClose, notes = [], onSelectNote }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(n => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const matchTitle = n.title.toLowerCase().includes(q);
    const matchContent = n.content.toLowerCase().includes(q);
    const matchTags = n.tags && n.tags.some(t => t.toLowerCase().includes(q));
    return matchTitle || matchContent || matchTags;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 md:pt-24 p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, kata kunci, tag, atau isi catatan (Ctrl+K)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm font-medium outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Tidak ditemukan catatan yang cocok dengan "{query}".
            </div>
          ) : (
            filteredNotes.map(n => {
              // Find snippet around match if content match
              let snippet = n.content.substring(0, 120);
              if (query && n.content.toLowerCase().includes(query.toLowerCase())) {
                const idx = n.content.toLowerCase().indexOf(query.toLowerCase());
                const start = Math.max(0, idx - 40);
                const end = Math.min(n.content.length, idx + 80);
                snippet = (start > 0 ? '...' : '') + n.content.substring(start, end) + '...';
              }

              return (
                <button
                  key={n.id}
                  onClick={() => {
                    onSelectNote(n.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-800/60 transition group border border-transparent hover:border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <h4 className="font-semibold text-white text-sm truncate group-hover:text-indigo-300">
                        {n.title}
                      </h4>
                      {n.tags && n.tags.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {snippet}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0 self-center transition transform group-hover:translate-x-1" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Menampilkan {filteredNotes.length} hasil</span>
          <span className="hidden sm:inline">Gunakan tombol panah & enter untuk navigasi cepat</span>
        </div>
      </div>
    </div>
  );
}

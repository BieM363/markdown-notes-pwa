import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, seedInitialData } from './db/db';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MarkdownReader } from './components/MarkdownReader';
import { MarkdownEditor } from './components/MarkdownEditor';
import { TableOfContents } from './components/TableOfContents';
import { SearchModal } from './components/SearchModal';
import { ImportModal } from './components/ImportModal';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Minimize2, BookOpen, Edit3, Search, X, ListTree } from 'lucide-react';

export function App() {
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [viewMode, setViewMode] = useState('reader'); // 'reader' | 'editor' | 'split'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState(null);

  // Settings state
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('base');
  const [fontFamily, setFontFamily] = useState('sans');

  // Fetch Dexie Live Queries
  const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray(), []) || [];
  const folders = useLiveQuery(() => db.folders.toArray(), []) || [];

  // Seed initial data once
  useEffect(() => {
    seedInitialData();
  }, []);

  // Set default active note if none selected
  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  // Apply theme class to <html> root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'sepia');
    root.classList.add(theme);
  }, [theme]);

  // Keyboard shortcut listener (Ctrl+K, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsImportOpen(false);
        setIsSettingsOpen(false);
        setIsMobileTocOpen(false);
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0] || null;

  // CRUD Actions
  const handleNewNote = async () => {
    const newId = await db.notes.add({
      title: `Catatan_Baru_${notes.length + 1}.md`,
      content: `# Catatan Baru\n\nTulis ide atau dokumentasi proyek Anda di sini...`,
      folderId: null,
      tags: ['Baru'],
      isPinned: 0,
      isFavorite: 0,
      author: 'BieM363',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setActiveNoteId(newId);
    setViewMode('editor');
  };

  const handleSaveNote = async (updatedNote) => {
    await db.notes.put(updatedNote);
    setViewMode('reader');
  };

  const handleDeleteNote = async (id) => {
    await db.notes.delete(id);
    if (activeNoteId === id) {
      const remaining = notes.filter(n => n.id !== id);
      setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleTogglePin = async (id, currentVal) => {
    await db.notes.update(id, { isPinned: currentVal ? 0 : 1 });
  };

  const handleToggleFavorite = async (id, currentVal) => {
    await db.notes.update(id, { isFavorite: currentVal ? 0 : 1 });
  };

  // Export functions
  const handleExportMd = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeNote.title.endsWith('.md') ? activeNote.title : `${activeNote.title}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHtml = () => {
    if (!activeNote) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="author" content="BieM363">
  <title>${activeNote.title} - BieM363 PWA</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f1f5f9; color: #db2777; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 16px; font-style: italic; color: #475569; }
  </style>
</head>
<body>
  <h1>${activeNote.title}</h1>
  <pre>${activeNote.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeNote.title.replace(/\.md$/, '')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Scroll smooth to Heading anchor in Reader
  const handleHeadingClick = (headingId) => {
    setActiveHeadingId(headingId);
    setIsMobileTocOpen(false);
    const el = document.getElementById(headingId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-slate-900 ${isZenMode ? 'zen-mode' : ''}`}>
      {/* Floating Control Pill in Fullscreen (Zen Mode) */}
      {isZenMode && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-1.5 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md animate-slideDown">
          <button
            onClick={() => setViewMode('reader')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition ${
              viewMode === 'reader' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mode Baca"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('editor')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition ${
              viewMode === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mode Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition"
            title="Cari"
          >
            <Search className="w-4 h-4 text-indigo-400" />
          </button>
          <button
            onClick={() => setIsZenMode(false)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-1.5"
            title="Keluar dari Fullscreen Mode (Kembali ke Toolbar)"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>
      )}

      {/* PWA Offline & Install Alert Banner */}
      {!isZenMode && <PWAInstallBanner />}

      {/* Top Header */}
      {!isZenMode && (
        <Header
          activeNote={activeNote}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenImport={() => setIsImportOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNewNote={handleNewNote}
          onExportMd={handleExportMd}
          onExportHtml={handleExportHtml}
          isZenMode={isZenMode}
          onToggleZenMode={() => setIsZenMode(!isZenMode)}
          onToggleMobileToc={() => setIsMobileTocOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Sidebar */}
        {!isZenMode && (
          <Sidebar
            isOpen={isSidebarOpen}
            onCloseSidebar={() => setIsSidebarOpen(false)}
            notes={notes}
            folders={folders}
            activeNoteId={activeNoteId}
            onSelectNote={(id) => {
              setActiveNoteId(id);
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            onNewNote={handleNewNote}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onToggleFavorite={handleToggleFavorite}
            onOpenImport={() => setIsImportOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {/* Reader / Editor Center Panel */}
        <main className="flex-1 flex overflow-hidden">
          {viewMode === 'reader' && (
            <MarkdownReader
              note={activeNote}
              fontSize={fontSize}
              fontFamily={fontFamily}
            />
          )}

          {viewMode === 'editor' && (
            <MarkdownEditor
              note={activeNote}
              folders={folders}
              onSave={handleSaveNote}
            />
          )}

          {viewMode === 'split' && (
            <div className="flex-1 flex overflow-hidden divide-x divide-slate-800">
              <div className="w-1/2 flex">
                <MarkdownEditor
                  note={activeNote}
                  folders={folders}
                  onSave={handleSaveNote}
                />
              </div>
              <div className="w-1/2 flex">
                <MarkdownReader
                  note={activeNote}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                />
              </div>
            </div>
          )}
        </main>

        {/* Desktop Table of Contents Sidebar */}
        {!isZenMode && viewMode !== 'editor' && activeNote?.content && (
          <aside className="hidden lg:block w-64 bg-slate-950/60 border-l border-slate-800/80 p-4 shrink-0 overflow-y-auto">
            <TableOfContents
              markdownContent={activeNote.content}
              activeHeadingId={activeHeadingId}
              onHeadingClick={handleHeadingClick}
            />
          </aside>
        )}
      </div>

      {/* Mobile Table of Contents Modal */}
      {isMobileTocOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl p-4 overflow-hidden space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <ListTree className="w-4 h-4" />
                <span>Daftar Isi (TOC)</span>
              </div>
              <button
                onClick={() => setIsMobileTocOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <TableOfContents
              markdownContent={activeNote?.content || ''}
              activeHeadingId={activeHeadingId}
              onHeadingClick={handleHeadingClick}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notes={notes}
        onSelectNote={(id) => setActiveNoteId(id)}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={() => {}}
      />

      <ThemeSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
      />
    </div>
  );
}

export default App;

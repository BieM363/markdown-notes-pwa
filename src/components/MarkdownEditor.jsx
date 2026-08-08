import React, { useState, useEffect } from 'react';
import { Save, Bold, Italic, Heading, Code, Quote, List, CheckSquare, Tag, Folder } from 'lucide-react';
import { getReadingTime } from '../db/db';

export function MarkdownEditor({ note, folders = [], onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [folderId, setFolderId] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setTagsInput(note.tags ? note.tags.join(', ') : '');
      setFolderId(note.folderId || '');
    }
  }, [note]);

  if (!note) return null;

  const handleSave = () => {
    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSave({
      ...note,
      title: title.trim() || 'Catatan_Tanpa_Judul.md',
      content,
      tags: tagsArr,
      folderId: folderId ? Number(folderId) : null,
      updatedAt: new Date().toISOString()
    });
  };

  const insertSnippet = (prefix, suffix = '') => {
    const textarea = document.getElementById('md-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'teks'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  const { words } = getReadingTime(content);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => insertSnippet('**', '**')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('*', '*')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('## ')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Heading 2"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('```javascript\n', '\n```')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Blok Kode"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('> ')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Kutipan (Quote)"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('- ')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Daftar List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertSnippet('- [ ] ')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
            title="Checklist"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {words} kata • {content.length} karakter
          </span>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-1.5 active:scale-95"
          >
            <Save className="w-4 h-4" />
            Simpan Catatan
          </button>
        </div>
      </div>

      {/* Editor Inputs */}
      <div className="p-4 md:p-6 space-y-4 border-b border-slate-800 bg-slate-950/40">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Catatan (contoh: Catatan_projek.md)..."
          className="w-full text-xl md:text-2xl font-bold bg-transparent text-white border-b border-slate-800 focus:border-indigo-500 outline-none pb-2 transition"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Tag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tag (pisahkan koma: PWA, React, Tip)"
              className="bg-transparent text-slate-200 outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="bg-transparent text-slate-200 outline-none w-full cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-300">Pilih Folder (Opsional)</option>
              {folders.map(f => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-slate-300">
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-4 md:p-6 overflow-hidden flex">
        <textarea
          id="md-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis konten Markdown di sini... (# Heading, **teks tebal**, ```kode```)"
          className="w-full h-full bg-transparent text-slate-200 font-mono text-sm leading-relaxed outline-none resize-none custom-scrollbar"
        />
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';
import { db } from '../db/db';

export function ImportModal({ isOpen, onClose, onImportSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [filesToImport, setFilesToImport] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFiles = (filesList) => {
    const validFiles = Array.from(filesList).filter(file => 
      file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.name.endsWith('.txt')
    );

    const filePromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            content: e.target.result,
            size: file.size
          });
        };
        reader.readAsText(file);
      });
    });

    Promise.all(filePromises).then(results => {
      setFilesToImport(prev => [...prev, ...results]);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleExecuteImport = async () => {
    if (filesToImport.length === 0) return;
    setIsImporting(true);

    try {
      const newNotes = filesToImport.map(f => ({
        title: f.name.endsWith('.md') ? f.name : `${f.name}.md`,
        content: f.content,
        folderId: null,
        tags: ['Imported'],
        isPinned: 0,
        isFavorite: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      await db.notes.bulkAdd(newNotes);
      setIsImporting(false);
      setFilesToImport([]);
      onImportSuccess();
      onClose();
    } catch (err) {
      console.error('Import failed:', err);
      setIsImporting(false);
    }
  };

  const removeFile = (idx) => {
    setFilesToImport(filesToImport.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-theme-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/15 text-indigo-500 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-theme-text text-base">Import File Markdown (.md)</h3>
              <p className="text-xs text-theme-muted">Unggah file .md lokal untuk disimpan di IndexedDB browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-theme-muted hover:text-theme-text rounded-lg hover:bg-theme-surface transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag Drop Area */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-theme-border bg-theme-subtle/50 hover:border-indigo-400 hover:bg-theme-surface'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".md,.markdown,.txt"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <UploadCloud className="w-10 h-10 text-indigo-500 animate-bounce" />
            <div>
              <p className="text-sm font-semibold text-theme-text">
                Tarik & Lepas file <span className="text-indigo-500">.md</span> di sini
              </p>
              <p className="text-xs text-theme-muted mt-1">atau klik untuk memilih file dari komputer Anda</p>
            </div>
          </div>

          {/* Selected Files List */}
          {filesToImport.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
                File Siap Diimport ({filesToImport.length})
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {filesToImport.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-theme-subtle rounded-lg border border-theme-border text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-medium text-theme-text truncate">{file.name}</span>
                      <span className="text-[10px] text-theme-muted">({Math.round(file.size / 1024)} KB)</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="p-1 text-theme-muted hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-theme-subtle border-t border-theme-border flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-theme-card hover:bg-theme-surface text-theme-muted hover:text-theme-text border border-theme-border text-xs font-medium rounded-xl transition"
          >
            Batal
          </button>
          <button
            disabled={filesToImport.length === 0 || isImporting}
            onClick={handleExecuteImport}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-2 active:scale-95"
          >
            {isImporting ? (
              <span>Mengimport...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Simpan Ke IndexedDB ({filesToImport.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

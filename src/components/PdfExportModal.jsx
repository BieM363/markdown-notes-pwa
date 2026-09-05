import React, { useState, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { 
  X, Download, Printer, BookOpen, FileText, Clock, 
  Calendar, Check, Code, Sparkles, Layout, CheckSquare, Tag
} from 'lucide-react';
import { getReadingTime } from '../db/db';

function extractTextFromChildren(children) {
  if (!children) return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join('');
  if (children.props && children.props.children) return extractTextFromChildren(children.props.children);
  return '';
}

export function PdfExportModal({ isOpen, onClose, note }) {
  const [bookFont, setBookFont] = useState('serif'); // 'serif' | 'sans'
  const [includeToc, setIncludeToc] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const printRef = useRef(null);

  // Extract headings for Book Table of Contents (always called unconditionally to satisfy Rules of Hooks)
  const headings = useMemo(() => {
    if (!note || !note.content) return [];
    const lines = note.content.split('\n').filter(line => line.match(/^#{1,3}\s+/));
    return lines.map((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return null;
      const level = match[1].length;
      const text = match[2].replace(/[*_~`]/g, '').trim();
      return { level, text };
    }).filter(Boolean);
  }, [note?.content]);

  if (!isOpen || !note) return null;

  const { words, minutes } = getReadingTime(note.content || '');

  // Direct 1-Click PDF Download via html2pdf.js
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    try {
      setIsGenerating(true);
      const element = printRef.current;
      const safeTitle = (note.title || 'Catatan').replace(/\.md$/, '').replace(/[^\w\s-]/g, '').trim();

      const opt = {
        margin: [12, 12, 14, 12],
        filename: `${safeTitle || 'Catatan'}_Edisi_Buku.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true, 
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(element).save();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to window.print if html2canvas had any issue
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  // High-res Vector Print to PDF via Browser Dialog
  const handlePrintPdf = () => {
    window.print();
  };

  const formattedDate = note.updatedAt 
    ? new Date(note.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Custom markdown renderer for clean book aesthetic
  const markdownComponents = {
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold border-b border-stone-300 pb-2 mt-6 mb-3 text-stone-900 book-break-avoid" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-bold border-b border-stone-200 pb-1.5 mt-5 mb-2.5 text-stone-800 book-break-avoid" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-semibold mt-4 mb-2 text-stone-800 book-break-avoid" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="my-2.5 leading-relaxed text-stone-800 text-[13.5px] text-left" {...props}>
        {children}
      </p>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="my-3 pl-4 py-2 border-l-4 border-indigo-600 bg-stone-100 text-stone-700 italic rounded-r-md text-[13px] book-break-avoid" {...props}>
        {children}
      </blockquote>
    ),
    ul: ({ children, ...props }) => (
      <ul className="book-unordered-list my-2.5 space-y-1.5 text-stone-800 text-[13px] leading-relaxed text-left" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="book-ordered-list my-2.5 space-y-1.5 text-stone-800 text-[13px] leading-relaxed text-left" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed text-left" {...props}>
        <div className="flex-1">{children}</div>
      </li>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        return (
          <div className="my-3 rounded-lg overflow-hidden border border-stone-300 bg-stone-900 text-stone-100 book-break-avoid">
            <div className="px-3 py-1 bg-stone-800 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 border-b border-stone-700 flex items-center justify-between">
              <span>{match[1]}</span>
              <span className="text-stone-400 font-normal">ProjectNotes Code</span>
            </div>
            <pre className="p-3 text-[12px] font-mono leading-relaxed overflow-x-auto text-stone-100">
              <code>{children}</code>
            </pre>
          </div>
        );
      }
      return (
        <code className="bg-stone-100 text-indigo-900 font-semibold px-1.5 py-0.5 rounded text-[11.5px] font-mono border border-stone-200 inline-block align-baseline my-0.5" {...props}>
          {children}
        </code>
      );
    },
    table: ({ children, ...props }) => (
      <div className="my-4 overflow-x-auto book-break-avoid">
        <table className="w-full text-left border-collapse text-[12.5px] border border-stone-300" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="bg-stone-100 border border-stone-300 px-3 py-2 font-bold text-stone-800 text-[12px]" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-stone-300 px-3 py-2 text-stone-700" {...props}>
        {children}
      </td>
    ),
    hr: () => (
      <div className="my-6 flex items-center justify-center gap-2 text-stone-300">
        <div className="h-[1px] bg-stone-300 flex-1" />
        <span className="text-xs text-stone-400 font-serif">✦ ✦ ✦</span>
        <div className="h-[1px] bg-stone-300 flex-1" />
      </div>
    )
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Download Catatan ke PDF (Format Buku)
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Edisi Estetik
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Tata letak layaknya buku terbitan lengkap dengan Logo ProjectNotes, identitas BieM363 & Daftar Isi
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Toolbar */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Tipografi:</span>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={() => setBookFont('serif')}
                  className={`px-2.5 py-1 rounded-md transition font-serif ${
                    bookFont === 'serif' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Serif (Buku/Novel)
                </button>
                <button
                  onClick={() => setBookFont('sans')}
                  className={`px-2.5 py-1 rounded-md transition font-sans ${
                    bookFont === 'sans' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sans (Modern)
                </button>
              </div>
            </div>

            {headings.length > 0 && (
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeToc}
                  onChange={(e) => setIncludeToc(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Sertakan Daftar Isi (TOC)</span>
              </label>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-medium"
              title="Gunakan dialog cetak browser untuk PDF vektor resolusi tinggi"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Cetak / PDF Vektor</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center gap-1.5 font-semibold disabled:opacity-50 active:scale-95"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Berhasil Diunduh!</span>
                </>
              ) : isGenerating ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Menyusun Buku...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh File PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Book Preview Window */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 flex justify-center custom-scrollbar">
          {/* Printable Book Sheet (A4 Proportion Canvas) */}
          <div 
            ref={printRef}
            className={`book-print-container w-full max-w-[760px] bg-white text-stone-900 p-6 sm:p-8 md:p-10 shadow-2xl rounded-sm border border-stone-200 ${
              bookFont === 'serif' ? 'font-serif' : 'font-sans'
            }`}
            style={{ minHeight: '842px' }}
          >
            {/* BOOK COVER / HEADER BANNER */}
            <header className="border-b-2 border-stone-800 pb-5 mb-6 book-break-avoid">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                {/* Brand Logo & Publication Info */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow tracking-tight">
                    PN
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-black text-sm tracking-tight text-stone-900 uppercase">
                        ProjectNotes <span className="text-indigo-600">PWA</span>
                      </h4>
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-indigo-200">
                        Edisi Dokumen Buku
                      </span>
                    </div>
                    <p className="font-sans text-[10px] text-stone-500 font-semibold tracking-wide">
                      Dokumentasi & Catatan Proyek
                    </p>
                  </div>
                </div>

                {/* Right: Author Attribution */}
                <div className="text-right font-sans">
                  <span className="text-[10px] text-stone-400 font-medium block">
                    Penulis / Pengembang
                  </span>
                  <span className="text-xs font-bold text-indigo-700 tracking-wide">
                    BieM363
                  </span>
                </div>
              </div>

              {/* Chapter / Book Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight mt-3 mb-3">
                {(note.title || 'Catatan').replace(/\.md$/, '')}
              </h1>

              {/* Unified Book Metadata & Tags Bar */}
              <div className="pt-2 font-sans space-y-2 border-t border-stone-100">
                {/* Reading Stats & Date */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                  <span className="inline-flex items-center gap-1.5 font-medium bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200/80">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    {words} kata
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200/80">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    ~{minutes} menit baca
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200/80">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {formattedDate}
                  </span>
                </div>

                {/* Tags placed cleanly beneath metadata */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-semibold text-stone-400 mr-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-500" />
                      Tag:
                    </span>
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50/80 text-indigo-700 border border-indigo-200/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* TABLE OF CONTENTS (Daftar Isi Buku) */}
            {includeToc && headings.length > 0 && (
              <section 
                className="my-6 p-5 bg-stone-50 border border-stone-200 rounded-xl book-break-avoid"
                style={{ overflow: 'visible' }}
              >
                <div className="font-sans font-bold text-xs uppercase tracking-wider text-stone-700 mb-3 pb-2 border-b border-stone-200 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-600" />
                  <span>Daftar Isi Catatan</span>
                </div>
                <div className="space-y-2" style={{ overflow: 'visible' }}>
                  {headings.map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center justify-between gap-3 py-1 ${
                        h.level === 1 ? 'font-bold text-stone-900 text-[13px] border-b border-stone-200/50 pb-1.5' :
                        h.level === 2 ? 'pl-4 font-semibold text-stone-800 text-[12px]' : 
                        'pl-7 font-normal text-stone-600 text-[11.5px]'
                      }`}
                      style={{ overflow: 'visible', lineHeight: 1.6 }}
                    >
                      <span className="flex-1" style={{ overflow: 'visible' }}>
                        {h.text}
                      </span>
                      <span className="text-stone-400 font-mono text-[10px] shrink-0 font-medium">
                        {h.level === 1 ? `Bagian ${i + 1}` : '–'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* RENDERED MARKDOWN CONTENT */}
            <main className="book-content mt-4 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {note.content || ''}
              </ReactMarkdown>
            </main>

            {/* BOOK RUNNING FOOTER */}
            <footer className="mt-12 pt-4 border-t border-stone-300 flex items-center justify-between text-[10px] font-sans text-stone-500 book-break-avoid">
              <div className="flex items-center gap-1 font-medium">
                <span>ProjectNotes PWA</span>
                <span>•</span>
                <span>Dokumentasi oleh BieM363</span>
              </div>
              <div className="font-mono text-stone-400">
                Edisi Baca Buku • Dicetak Mandiri
              </div>
            </footer>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-5">
          <span>
            💡 Tips: Untuk dokumen dengan teks vektor tajam maksimal, gunakan <strong>Cetak / PDF Vektor</strong> lalu pilih <em>"Save as PDF"</em>.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

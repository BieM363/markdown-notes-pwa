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

      // Deep clone element to inject layout-safe pagination keep-together guards
      const clone = element.cloneNode(true);

      // 1. Group headings with following sibling content to prevent orphan headings at page bottoms
      const headings = Array.from(clone.querySelectorAll('h1, h2, h3, h4'));
      headings.forEach((heading) => {
        if (heading.parentElement && heading.parentElement.classList.contains('book-heading-group')) {
          return;
        }
        const nextEl = heading.nextElementSibling;
        if (nextEl) {
          const group = document.createElement('div');
          group.className = 'book-heading-group book-break-avoid';
          group.style.pageBreakInside = 'avoid';
          group.style.breakInside = 'avoid';

          heading.parentNode.insertBefore(group, heading);
          group.appendChild(heading);
          group.appendChild(nextEl);

          // If nextEl is also a heading (e.g. h1 followed by h3 subtitle), also include the following content
          if (/^H[1-6]$/i.test(nextEl.tagName) && group.nextElementSibling) {
            group.appendChild(group.nextElementSibling);
          }
        }
      });

      // 2. Protect table rows and cells from mid-row cuts
      const tables = Array.from(clone.querySelectorAll('table'));
      tables.forEach((table) => {
        table.style.pageBreakInside = 'auto';
        table.style.breakInside = 'auto';
        table.style.borderCollapse = 'collapse';
      });

      const rows = Array.from(clone.querySelectorAll('tr'));
      rows.forEach((tr) => {
        tr.classList.add('book-break-avoid');
        tr.style.pageBreakInside = 'avoid';
        tr.style.breakInside = 'avoid';
      });

      const cells = Array.from(clone.querySelectorAll('th, td'));
      cells.forEach((cell) => {
        cell.classList.add('book-break-avoid');
        cell.style.pageBreakInside = 'avoid';
        cell.style.breakInside = 'avoid';
      });

      // 3. Protect preformatted code blocks from horizontal slicing
      const pres = Array.from(clone.querySelectorAll('pre'));
      pres.forEach((pre) => {
        pre.classList.add('book-break-avoid');
        pre.style.pageBreakInside = 'avoid';
        pre.style.breakInside = 'avoid';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordBreak = 'break-word';
      });

      // 4. Protect list items, paragraphs, and blockquotes from mid-line cuts
      const listItems = Array.from(clone.querySelectorAll('li'));
      listItems.forEach((li) => {
        li.classList.add('book-break-avoid');
        li.style.pageBreakInside = 'avoid';
        li.style.breakInside = 'avoid';
      });

      const paragraphs = Array.from(clone.querySelectorAll('p'));
      paragraphs.forEach((p) => {
        p.classList.add('book-break-avoid');
        p.style.pageBreakInside = 'avoid';
        p.style.breakInside = 'avoid';
      });

      const opt = {
        margin: [8, 8, 10, 8],
        filename: `${safeTitle || 'Catatan'}_Edisi_Buku.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: false, 
          logging: false,
          scrollY: 0,
          scrollX: 0,
          windowWidth: 800
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { 
          mode: ['css', 'legacy'],
          avoid: [
            'tr',
            'thead',
            'th',
            'td',
            'pre',
            'blockquote',
            'li',
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            '.book-break-avoid',
            '.book-heading-group'
          ]
        }
      };

      await html2pdf().set(opt).from(clone).save();
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

  // Custom markdown renderer for clean book aesthetic with pagebreak protection
  const markdownComponents = {
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold border-b border-stone-300 pb-2 mt-5 mb-2.5 text-stone-900 book-break-avoid" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid', pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-bold border-b border-stone-200 pb-1.5 mt-4 mb-2 text-stone-800 book-break-avoid" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid', pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-semibold mt-3.5 mb-1.5 text-stone-800 book-break-avoid" style={{ pageBreakAfter: 'avoid', breakAfter: 'avoid', pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="my-2 leading-relaxed text-stone-800 text-[13.5px] text-left book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </p>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="my-2.5 pl-4 py-1.5 border-l-4 border-indigo-600 bg-stone-100 text-stone-700 italic rounded-r-md text-[13px] book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
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
      <li className="leading-relaxed text-left book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        <div className="flex-1">{children}</div>
      </li>
    ),
    pre: ({ children, ...props }) => (
      <pre className="my-3 p-3 bg-stone-100 border border-stone-300 rounded-lg text-[12px] font-mono leading-relaxed text-stone-800 book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} {...props}>
        {children}
      </pre>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        return (
          <div className="my-3 rounded-lg overflow-hidden border border-stone-300 bg-stone-900 text-stone-100 book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div className="px-3 py-1 bg-stone-800 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 border-b border-stone-700 flex items-center justify-between">
              <span>{match[1]}</span>
              <span className="text-stone-400 font-normal">ProjectNotes Code</span>
            </div>
            <pre className="p-3 text-[12px] font-mono leading-relaxed text-stone-100" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
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
      <div className="my-4 book-table-container">
        <table className="w-full text-left border-collapse text-[12.5px] border border-stone-300" style={{ pageBreakInside: 'auto', breakInside: 'auto' }} {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="book-break-avoid" style={{ display: 'table-header-group', pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody style={{ display: 'table-row-group', pageBreakInside: 'auto', breakInside: 'auto' }} {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th className="bg-stone-100 border border-stone-300 px-3 py-2 font-bold text-stone-800 text-[12px] book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-stone-300 px-3 py-2 text-stone-700 book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }} {...props}>
        {children}
      </td>
    ),
    hr: () => (
      <div className="my-6 flex items-center justify-center gap-2 text-stone-300 book-break-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
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
            className={`book-print-container w-full max-w-[760px] bg-white text-stone-900 p-6 sm:p-8 shadow-2xl rounded-sm border border-stone-200 ${
              bookFont === 'serif' ? 'font-serif' : 'font-sans'
            }`}
            style={{ minHeight: '842px' }}
          >
            {/* BOOK COVER / HEADER BANNER */}
            <header className="border-b-2 border-stone-800 pb-5 mb-6 book-break-avoid">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                {/* Brand Logo, Name & Edition Tag */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-black text-sm tracking-tight text-stone-900 uppercase">
                        ProjectNotes <span className="text-indigo-600">PWA</span>
                      </h4>
                      <svg width="136" height="22" viewBox="0 0 136 22" className="inline-block shrink-0">
                        <rect x="0.5" y="0.5" width="135" height="21" rx="10.5" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1"/>
                        <text 
                          x="50%" 
                          y="50%" 
                          textAnchor="middle" 
                          dominantBaseline="central" 
                          fill="#4338CA" 
                          fontSize="9.5" 
                          fontWeight="700" 
                          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, sans-serif" 
                          letterSpacing="0.4"
                        >
                          EDISI DOKUMEN BUKU
                        </text>
                      </svg>
                    </div>
                    <p className="font-sans text-[10px] text-stone-500 font-semibold tracking-wide">
                      Dokumentasi & Catatan oleh <strong className="text-indigo-700">BieM363</strong>
                    </p>
                  </div>
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
                  <svg width="90" height="26" viewBox="0 0 90 26" className="inline-block shrink-0">
                    <rect x="0.5" y="0.5" width="89" height="25" rx="6" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1"/>
                    <g transform="translate(8, 6)">
                      <path d="M2 1h5l3 3v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="none" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7 1 7 4 10 4" fill="none" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <text x="53" y="14" textAnchor="middle" dominantBaseline="central" fill="#44403C" fontSize="11" fontWeight="500" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, sans-serif">
                      {words} kata
                    </text>
                  </svg>

                  <svg width="118" height="26" viewBox="0 0 118 26" className="inline-block shrink-0">
                    <rect x="0.5" y="0.5" width="117" height="25" rx="6" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1"/>
                    <g transform="translate(8, 6)">
                      <circle cx="7" cy="7" r="5.5" fill="none" stroke="#D97706" strokeWidth="1.4"/>
                      <polyline points="7 4.5 7 7 9 8" fill="none" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <text x="65" y="14" textAnchor="middle" dominantBaseline="central" fill="#44403C" fontSize="11" fontWeight="500" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, sans-serif">
                      ~{minutes} menit baca
                    </text>
                  </svg>

                  {(() => {
                    const dateW = Math.max(136, (formattedDate || '').length * 7.5 + 30);
                    return (
                      <svg width={dateW} height="26" viewBox={`0 0 ${dateW} 26`} className="inline-block shrink-0">
                        <rect x="0.5" y="0.5" width={dateW - 1} height="25" rx="6" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1"/>
                        <g transform="translate(8, 6)">
                          <rect x="1" y="2" width="11" height="10" rx="1.5" fill="none" stroke="#059669" strokeWidth="1.4"/>
                          <line x1="1" y1="5.5" x2="12" y2="5.5" stroke="#059669" strokeWidth="1.2"/>
                          <line x1="4" y1="0.5" x2="4" y2="2" stroke="#059669" strokeWidth="1.4" strokeLinecap="round"/>
                          <line x1="9" y1="0.5" x2="9" y2="2" stroke="#059669" strokeWidth="1.4" strokeLinecap="round"/>
                        </g>
                        <text x={(dateW + 16) / 2} y="14" textAnchor="middle" dominantBaseline="central" fill="#44403C" fontSize="11" fontWeight="500" fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, sans-serif">
                          {formattedDate}
                        </text>
                      </svg>
                    );
                  })()}
                </div>

                {/* Tags placed cleanly beneath metadata */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[11px] font-semibold text-stone-400 mr-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-500" />
                      Tag:
                    </span>
                    {note.tags.map((tag, idx) => {
                      const tagW = Math.max(54, tag.length * 8 + 18);
                      return (
                        <svg key={idx} width={tagW} height="22" viewBox={`0 0 ${tagW} 22`} className="inline-block shrink-0">
                          <rect x="0.5" y="0.5" width={tagW - 1} height="21" rx="5" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1"/>
                          <text 
                            x="50%" 
                            y="50%" 
                            textAnchor="middle" 
                            dominantBaseline="central" 
                            fill="#4338CA" 
                            fontSize="10.5" 
                            fontWeight="600" 
                            fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, sans-serif"
                          >
                            #{tag}
                          </text>
                        </svg>
                      );
                    })}
                  </div>
                )}
              </div>
            </header>

            {/* TABLE OF CONTENTS (Daftar Isi Buku) */}
            {includeToc && headings.length > 0 && (
              <section 
                className="my-4 p-4 bg-stone-50 border border-stone-200 rounded-xl"
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
            <footer className="mt-8 pt-3 border-t border-stone-300 flex items-center justify-between text-[10px] font-sans text-stone-500">
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

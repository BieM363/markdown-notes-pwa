import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, Code, BookOpen, Clock, FileText, Download } from 'lucide-react';
import { getReadingTime } from '../db/db';

function extractTextFromChildren(children) {
  if (!children) return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractTextFromChildren).join('');
  if (children.props && children.props.children) return extractTextFromChildren(children.props.children);
  return '';
}

export function MarkdownReader({ note, fontSize = 'base', fontFamily = 'sans', onScrollProgress, onOpenPdfExport }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  // Track reading progress on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const totalScroll = scrollHeight - clientHeight;
    if (totalScroll <= 0) {
      setScrollProgress(100);
      if (onScrollProgress) onScrollProgress(100);
      return;
    }
    const currentProgress = Math.min(100, Math.max(0, (scrollTop / totalScroll) * 100));
    setScrollProgress(currentProgress);
    if (onScrollProgress) onScrollProgress(currentProgress);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = 0;
      setScrollProgress(0);
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [note?.id, note?.content]);

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-theme-muted bg-theme-main">
        <BookOpen className="w-16 h-16 text-theme-muted/50 mb-4 stroke-1 animate-pulse" />
        <h3 className="text-lg font-semibold text-theme-text mb-1">Tidak ada catatan dipilih</h3>
        <p className="text-sm max-w-md text-theme-muted">Pilih catatan dari sidebar atau buat catatan baru / import file .md lokal.</p>
      </div>
    );
  }

  const { words, minutes } = getReadingTime(note.content || '');

  const fontClass = 
    fontFamily === 'serif' ? 'font-serif' :
    fontFamily === 'mono' ? 'font-mono' : 'font-sans';

  const sizeClass = `font-size-${fontSize}`;

  // Custom components for ReactMarkdown
  const components = {
    h1: ({ children, ...props }) => {
      const rawText = extractTextFromChildren(children);
      const id = rawText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return (
        <h1 id={id} className="scroll-mt-8 group cursor-pointer hover:text-indigo-500 transition" {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }) => {
      const rawText = extractTextFromChildren(children);
      const id = rawText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return (
        <h2 id={id} className="scroll-mt-8 group cursor-pointer hover:text-indigo-500 transition" {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }) => {
      const rawText = extractTextFromChildren(children);
      const id = rawText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return (
        <h3 id={id} className="scroll-mt-8 group cursor-pointer hover:text-indigo-500 transition" {...props}>
          {children}
        </h3>
      );
    },
    h4: ({ children, ...props }) => {
      const rawText = extractTextFromChildren(children);
      const id = rawText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return (
        <h4 id={id} className="scroll-mt-8 group cursor-pointer hover:text-indigo-500 transition" {...props}>
          {children}
        </h4>
      );
    },
    code({ node, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      if (match) {
        const lang = match[1];
        const codeId = Math.random().toString(36).substr(2, 9);
        const isCopied = copiedCodeIndex === codeId;

        const handleCopy = () => {
          navigator.clipboard.writeText(codeString);
          setCopiedCodeIndex(codeId);
          setTimeout(() => setCopiedCodeIndex(null), 2000);
        };

        return (
          <div className="relative group my-4 rounded-xl overflow-hidden border border-theme-border shadow-lg bg-theme-subtle">
            <div className="flex items-center justify-between px-4 py-2 bg-theme-card border-b border-theme-border text-xs font-mono text-theme-muted">
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                <span className="uppercase font-bold text-indigo-400">{lang}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-theme-main hover:bg-theme-border text-theme-text transition text-[11px] font-sans border border-theme-border"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
            <pre className="!m-0 !p-4 overflow-x-auto text-sm">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-theme-main transition-colors duration-200">
      {/* Top Reading Progress Bar */}
      <div className="w-full bg-theme-border/30 h-1 absolute top-0 left-0 right-0 z-20">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Reader Scroll Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-12 md:py-10 custom-scrollbar scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Note Metadata Header */}
          <div className="pb-6 border-b border-theme-border space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-theme-muted">
              <span className="flex items-center gap-1 bg-theme-surface px-2.5 py-1 rounded-md text-theme-text font-medium border border-theme-border">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                {words} kata
              </span>
              <span className="flex items-center gap-1 bg-theme-surface px-2.5 py-1 rounded-md text-theme-text font-medium border border-theme-border">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                ~{minutes} mnt baca
              </span>

              {onOpenPdfExport && (
                <button
                  onClick={onOpenPdfExport}
                  className="flex items-center gap-1 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 px-2.5 py-1 rounded-md font-semibold border border-indigo-500/30 transition active:scale-95"
                  title="Unduh Catatan ini ke PDF Format Buku"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Buku</span>
                </button>
              )}

              {note.tags && note.tags.length > 0 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-theme-text tracking-tight leading-snug">
              {(note.title || '').replace(/\.md$/, '')}
            </h1>

            <p className="text-xs text-theme-muted">
              Diperbarui: {note.updatedAt ? new Date(note.updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
            </p>
          </div>

          {/* Rendered Markdown Body */}
          <article className={`markdown-body ${fontClass} ${sizeClass}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={components}
            >
              {note.content || ''}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}

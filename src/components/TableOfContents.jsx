import React, { useEffect, useState } from 'react';
import { ListTree, ChevronRight } from 'lucide-react';

export function TableOfContents({ markdownContent, activeHeadingId, onHeadingClick }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!markdownContent) {
      setHeadings([]);
      return;
    }

    // Extract headings from markdown content
    const headingLines = markdownContent.split('\n').filter(line => line.match(/^#{1,4}\s+/));
    
    const parsedHeadings = headingLines.map((line) => {
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (!match) return null;
      
      const level = match[1].length;
      const rawText = match[2].replace(/[*_~`]/g, '').trim();
      
      // Slugify matching MarkdownReader heading ID generator
      const id = rawText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return { id, text: rawText, level };
    }).filter(Boolean);

  setHeadings(parsedHeadings);
  }, [markdownContent]);

  if (headings.length === 0) {
    return (
      <div className="p-4 text-xs text-theme-muted italic flex flex-col items-center justify-center text-center gap-2 border border-dashed border-theme-border rounded-xl">
        <ListTree className="w-5 h-5 text-theme-muted/60" />
        <span>Tidak ada heading (#) pada catatan ini.</span>
      </div>
    );
  }

  return (
    <nav className="space-y-1 text-xs select-none">
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-theme-border text-theme-muted font-semibold uppercase tracking-wider text-[10px]">
        <ListTree className="w-3.5 h-3.5 text-indigo-500" />
        <span>Daftar Isi (TOC)</span>
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
        {headings.map((h, idx) => {
          const isActive = activeHeadingId === h.id;
          const indentClass = 
            h.level === 1 ? 'pl-2 font-semibold' :
            h.level === 2 ? 'pl-5 font-normal' :
            h.level === 3 ? 'pl-8 text-theme-muted' : 'pl-10 text-theme-muted/80';

          return (
            <button
              key={`${h.id}-${idx}`}
              onClick={(e) => {
                e.preventDefault();
                onHeadingClick(h.id);
              }}
              className={`w-full text-left py-1.5 px-2 rounded-lg transition-all truncate flex items-center gap-1.5 ${indentClass} ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-500 dark:text-indigo-400 border-l-2 border-indigo-500 font-semibold'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-surface'
              }`}
              title={h.text}
            >
              {h.level === 1 && <ChevronRight className="w-3 h-3 text-indigo-500 shrink-0" />}
              <span className="truncate">{h.text}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

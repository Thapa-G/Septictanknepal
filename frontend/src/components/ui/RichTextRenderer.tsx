import React from 'react';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  if (!content) return null;

  // Process markdown/HTML formatted text into structured blocks
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];

    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
    let currentQuote: string[] | null = null;
    let blockKey = 0;

    const flushList = () => {
      if (!currentList) return;
      const listIdx = blockKey++;
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${listIdx}`} className="space-y-1.5 my-3 pl-1 list-none">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed text-[#0f172a] text-[15px] md:text-[16px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f172a] shrink-0 mt-2.5 select-none" />
                <div className="flex-1">{parseInline(item)}</div>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${listIdx}`} className="space-y-1.5 my-3 pl-1 list-none">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed text-[#0f172a] text-[15px] md:text-[16px]">
                <span className="font-bold text-[#0f172a] shrink-0 min-w-[18px] select-none tabular-nums">
                  {idx + 1}.
                </span>
                <div className="flex-1">{parseInline(item)}</div>
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    };

    const flushQuote = () => {
      if (!currentQuote || currentQuote.length === 0) return;
      const qIdx = blockKey++;
      elements.push(
        <blockquote
          key={`quote-${qIdx}`}
          className="border-l-4 border-[#1d4ed8] pl-5 py-3.5 my-5 bg-[#f1f5f9] rounded-r-2xl text-[#334155] shadow-xs relative"
        >
          <span className="material-symbols-outlined text-[24px] text-[#93c5fd] -mt-1 mb-1 block select-none">
            format_quote
          </span>
          <div className="space-y-2 font-medium italic text-[15px] md:text-[16px] leading-relaxed">
            {currentQuote.map((qLine, idx) => (
              <p key={idx}>{parseInline(qLine)}</p>
            ))}
          </div>
        </blockquote>
      );
      currentQuote = null;
    };

    const flushAll = () => {
      flushList();
      flushQuote();
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 1 or Title: # 
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        flushAll();
        const headingText = trimmed.replace(/^#\s*/, '');
        elements.push(
          <h1
            key={`h1-${index}`}
            className="text-[26px] md:text-[32px] font-bold text-[#0f172a] mt-8 mb-4 leading-tight border-b border-[#cbd5e1] pb-2"
          >
            {parseInline(headingText)}
          </h1>
        );
        return;
      }

      // Heading 2: ## or ##.
      if (trimmed.startsWith('## ') || trimmed.startsWith('##.')) {
        flushAll();
        const headingText = trimmed.replace(/^##\.?\s*/, '');
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-[22px] md:text-[26px] font-bold text-[#0f172a] mt-8 mb-3 leading-snug"
          >
            {parseInline(headingText)}
          </h2>
        );
        return;
      }

      // Heading 3: ###
      if (trimmed.startsWith('### ') || trimmed.startsWith('###.')) {
        flushAll();
        const headingText = trimmed.replace(/^###\.?\s*/, '');
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-[18px] md:text-[20px] font-bold text-[#0f172a] mt-6 mb-2 leading-snug"
          >
            {parseInline(headingText)}
          </h3>
        );
        return;
      }

      // Blockquote: > or > text
      if (trimmed.startsWith('>') || /^>\s+/.test(trimmed)) {
        flushList();
        const quoteText = trimmed.replace(/^>\s?/, '');
        if (!currentQuote) {
          currentQuote = [];
        }
        if (quoteText) {
          currentQuote.push(quoteText);
        }
        return;
      }

      // Bullet list item: - or * or •
      if (/^[-*•]\s+/.test(trimmed)) {
        flushQuote();
        const itemText = trimmed.replace(/^[-*•]\s+/, '');
        if (!currentList || currentList.type !== 'ul') {
          flushList();
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(itemText);
        return;
      }

      // Numbered list item: 1. or 1) or 1 -
      if (/^\d+[.)\-]\s+/.test(trimmed)) {
        flushQuote();
        const itemText = trimmed.replace(/^\d+[.)\-]\s+/, '');
        if (!currentList || currentList.type !== 'ol') {
          flushList();
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(itemText);
        return;
      }

      // Empty line -> flushes lists & quotes and creates spacing
      if (!trimmed) {
        flushAll();
        return;
      }

      // Normal paragraph
      flushAll();
      elements.push(
        <p key={`p-${index}`} className="text-[16px] text-[#0f172a] leading-relaxed mb-4">
          {parseInline(line)}
        </p>
      );
    });

    flushAll();
    return elements;
  };

  /**
   * Helper to parse inline markdown:
   * **bold** or <b>bold</b> or <strong>bold</strong>
   * *italic* or <i>italic</i> or <em>italic</em>
   * <u>underline</u> or __underline__
   * [text](url)
   */
  const parseInline = (text: string): React.ReactNode => {
    if (!text) return null;

    // Convert common HTML tags to standardized markdown tokens for unified parser
    const processed = text
      .replace(/<strong\b[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b\b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em\b[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i\b[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<u\b[^>]*>(.*?)<\/u>/gi, '<u>$1</u>');

    // Tokenize using regex
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|<u>.*?<\/u>|__[^_]+__|\[[^\]]+\]\([^)]+\))/g;
    const parts = processed.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;

      // Bold: **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={i} className="font-bold text-[#0f172a]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Underline: <u>text</u> or __text__
      if (
        (part.startsWith('<u>') && part.endsWith('</u>')) ||
        (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
      ) {
        const inner = part.startsWith('<u>') ? part.slice(3, -4) : part.slice(2, -2);
        return (
          <u key={i} className="underline decoration-[#1d4ed8] decoration-2 underline-offset-4 font-medium">
            {inner}
          </u>
        );
      }

      // Italic: *text*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={i} className="italic text-[#0f172a]">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Link: [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d4ed8] hover:text-[#1e40af] underline font-semibold transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }

      return part;
    });
  };

  return <div className={`prose-container ${className}`}>{renderFormattedText(content)}</div>;
}

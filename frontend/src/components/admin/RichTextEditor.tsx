'use client';

import React, { useRef, useState, useEffect } from 'react';
import RichTextRenderer from '../ui/RichTextRenderer';
import { servicesService } from '@/services/servicesService';
import { blogsService } from '@/services/blogsService';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

interface InternalLinkOption {
  title: string;
  url: string;
  category: 'Main Page' | 'Service' | 'Article';
  icon: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label = 'Full Article Content',
  placeholder = 'Write the full article content here. Use formatting buttons above to add bold, italic, underline, headings, and lists...',
  rows = 14,
  required = true,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'write' | 'preview' | 'split'>('write');

  // Internal Link Dropdown states
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [linkCategoryFilter, setLinkCategoryFilter] = useState<'all' | 'pages' | 'services' | 'blogs' | 'custom'>('all');
  const [customUrl, setCustomUrl] = useState('https://');
  const [customLinkText, setCustomLinkText] = useState('');
  const [savedSelection, setSavedSelection] = useState<{ start: number; end: number; text: string }>({
    start: 0,
    end: 0,
    text: '',
  });

  // Dynamic link database
  const [internalLinks, setInternalLinks] = useState<InternalLinkOption[]>([
    { title: 'Home Page', url: '/', category: 'Main Page', icon: 'home' },
    { title: 'All Services Catalog', url: '/services', category: 'Main Page', icon: 'home_repair_service' },
    { title: 'Photo Gallery', url: '/gallery', category: 'Main Page', icon: 'photo_library' },
    { title: 'Blog & Articles', url: '/blog', category: 'Main Page', icon: 'article' },
    { title: 'Contact Us', url: '/contact', category: 'Main Page', icon: 'call' },
  ]);

  // Load dynamic services & blogs
  useEffect(() => {
    let isMounted = true;
    async function loadInternalLinks() {
      try {
        const [servicesRes, blogsRes] = await Promise.allSettled([
          servicesService.getAll({ per_page: 100 }),
          blogsService.getAll({ per_page: 100 }),
        ]);

        const loadedServices: InternalLinkOption[] = [];
        if (servicesRes.status === 'fulfilled') {
          const sData = servicesRes.value;
          const rawServices = Array.isArray(sData)
            ? sData
            : sData && (sData as any).data
            ? (sData as any).data
            : [];
          rawServices.forEach((s: any) => {
            if (s.title && s.slug) {
              loadedServices.push({
                title: s.title,
                url: `/services/${s.slug}`,
                category: 'Service',
                icon: 'plumbing',
              });
            }
          });
        }

        const loadedBlogs: InternalLinkOption[] = [];
        if (blogsRes.status === 'fulfilled') {
          const bData = blogsRes.value;
          const rawBlogs =
            bData && bData.data
              ? bData.data
              : Array.isArray(bData)
              ? bData
              : [];
          rawBlogs.forEach((b: any) => {
            if (b.title && b.slug) {
              loadedBlogs.push({
                title: b.title,
                url: `/blog/${b.slug}`,
                category: 'Article',
                icon: 'description',
              });
            }
          });
        }

        if (isMounted) {
          setInternalLinks([
            { title: 'Home Page', url: '/', category: 'Main Page', icon: 'home' },
            { title: 'All Services Catalog', url: '/services', category: 'Main Page', icon: 'home_repair_service' },
            { title: 'Photo Gallery', url: '/gallery', category: 'Main Page', icon: 'photo_library' },
            { title: 'Blog & Articles', url: '/blog', category: 'Main Page', icon: 'article' },
            { title: 'Contact Us', url: '/contact', category: 'Main Page', icon: 'call' },
            ...loadedServices,
            ...loadedBlogs,
          ]);
        }
      } catch (err) {
        console.error('Failed to load internal link suggestions:', err);
      }
    }

    loadInternalLinks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLinkDropdownOpen(false);
      }
    }

    if (isLinkDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLinkDropdownOpen]);

  // Generic inline wrapper
  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const textToWrap = selectedText || defaultPlaceholder;

    const replacement = `${prefix}${textToWrap}${suffix}`;
    const newValue = text.substring(0, start) + replacement + text.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + textToWrap.length);
      }
    }, 0);
  };

  // Smart Heading Toggle
  const toggleHeading = (level: '##' | '###', defaultPlaceholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    if (!selected) {
      insertFormatting(`\n${level} `, '\n', defaultPlaceholder);
      return;
    }

    const lines = selected.split('\n');
    const prefixStr = `${level} `;
    const allHaveHeading = lines.every((l) => l.trim().startsWith(prefixStr));

    const newLines = lines.map((l) => {
      if (allHaveHeading) {
        return l.replace(new RegExp(`^(\\s*)${level}\\s*`), '$1');
      } else {
        const clean = l.replace(/^(\s*)#{1,4}\s*/, '$1');
        return /^\s*$/.test(clean) ? clean : `${prefixStr}${clean}`;
      }
    });

    const replacement = newLines.join('\n');
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  // Smart Bullet List Toggle
  const toggleBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    if (!selected) {
      insertFormatting('\n- ', '\n', 'List item');
      return;
    }

    const lines = selected.split('\n');
    const allBulleted = lines.every((l) => /^[-*•]\s+/.test(l.trim()));

    const newLines = lines.map((l) => {
      if (allBulleted) {
        return l.replace(/^(\s*)[-*•]\s+/, '$1');
      } else {
        if (/^\s*$/.test(l)) return l;
        const clean = l.replace(/^(\s*)[-*•\d+.)]\s+/, '');
        return `- ${clean}`;
      }
    });

    const replacement = newLines.join('\n');
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  // Smart Numbered List Toggle
  const toggleNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    if (!selected) {
      insertFormatting('\n1. ', '\n', 'Numbered step');
      return;
    }

    const lines = selected.split('\n');
    const allNumbered = lines.every((l) => /^\d+[.)]\s+/.test(l.trim()));

    let counter = 1;
    const newLines = lines.map((l) => {
      if (allNumbered) {
        return l.replace(/^(\s*)\d+[.)]\s+/, '$1');
      } else {
        if (/^\s*$/.test(l)) return l;
        const clean = l.replace(/^(\s*)([-*•]|\d+[.)])\s+/, '');
        return `${counter++}. ${clean}`;
      }
    });

    const replacement = newLines.join('\n');
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  // Open Link Dropdown and save selection
  const handleOpenLinkDropdown = () => {
    const textarea = textareaRef.current;
    let selectedText = '';
    let start = 0;
    let end = 0;

    if (textarea) {
      start = textarea.selectionStart;
      end = textarea.selectionEnd;
      selectedText = textarea.value.substring(start, end).trim();
    }

    setSavedSelection({ start, end, text: selectedText });
    setCustomLinkText(selectedText);
    setLinkSearchQuery('');
    setLinkCategoryFilter('all');
    setIsLinkDropdownOpen((prev) => !prev);

    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 50);
  };

  // Apply chosen internal or custom link
  const handleApplyLink = (url: string, defaultTitle?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = savedSelection.start;
    const end = savedSelection.end;
    const text = textarea.value;
    const selectedText = savedSelection.text || text.substring(start, end).trim();
    const linkText = selectedText || defaultTitle || url;

    const replacement = `[${linkText}](${url})`;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);
    setIsLinkDropdownOpen(false);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  // Handle custom URL submit
  const handleCustomLinkSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customUrl || customUrl.trim() === '' || customUrl === 'https://') return;
    handleApplyLink(customUrl.trim(), customLinkText.trim() || 'Link');
  };

  // Filter links based on search and category
  const filteredLinks = internalLinks.filter((item) => {
    // Category filter
    if (linkCategoryFilter === 'pages' && item.category !== 'Main Page') return false;
    if (linkCategoryFilter === 'services' && item.category !== 'Service') return false;
    if (linkCategoryFilter === 'blogs' && item.category !== 'Article') return false;

    // Search query
    if (linkSearchQuery.trim()) {
      const q = linkSearchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
    }
    return true;
  });

  // Smart keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (e.ctrlKey || e.metaKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        insertFormatting('**', '**', 'bold text');
        return;
      } else if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        insertFormatting('*', '*', 'italic text');
        return;
      } else if (e.key.toLowerCase() === 'u') {
        e.preventDefault();
        insertFormatting('<u>', '</u>', 'underlined text');
        return;
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleOpenLinkDropdown();
        return;
      }
    }

    // Auto-continue lists
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const cursor = textarea.selectionStart;
      const text = textarea.value;
      const textBeforeCursor = text.substring(0, cursor);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1] || '';

      const bulletMatch = currentLine.match(/^(\s*)[-*•]\s+(.*)$/);
      if (bulletMatch) {
        e.preventDefault();
        const indent = bulletMatch[1];
        const itemContent = bulletMatch[2];

        if (!itemContent.trim()) {
          const lineStart = cursor - currentLine.length;
          const newValue = text.substring(0, lineStart) + '\n' + text.substring(cursor);
          onChange(newValue);
          setTimeout(() => {
            textarea.setSelectionRange(lineStart + 1, lineStart + 1);
          }, 0);
        } else {
          const insertion = `\n${indent}- `;
          const newValue = text.substring(0, cursor) + insertion + text.substring(cursor);
          onChange(newValue);
          setTimeout(() => {
            textarea.setSelectionRange(cursor + insertion.length, cursor + insertion.length);
          }, 0);
        }
        return;
      }

      const numMatch = currentLine.match(/^(\s*)(\d+)[.)]\s+(.*)$/);
      if (numMatch) {
        e.preventDefault();
        const indent = numMatch[1];
        const currentNum = parseInt(numMatch[2], 10);
        const itemContent = numMatch[3];

        if (!itemContent.trim()) {
          const lineStart = cursor - currentLine.length;
          const newValue = text.substring(0, lineStart) + '\n' + text.substring(cursor);
          onChange(newValue);
          setTimeout(() => {
            textarea.setSelectionRange(lineStart + 1, lineStart + 1);
          }, 0);
        } else {
          const nextNum = currentNum + 1;
          const insertion = `\n${indent}${nextNum}. `;
          const newValue = text.substring(0, cursor) + insertion + text.substring(cursor);
          onChange(newValue);
          setTimeout(() => {
            textarea.setSelectionRange(cursor + insertion.length, cursor + insertion.length);
          }, 0);
        }
        return;
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      const newValue = text.substring(0, start) + '  ' + text.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  return (
    <div className="space-y-2 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-[14px] font-bold text-[#0f172a]">
          {label} {required && <span className="text-[#ba1a1a]">*</span>}
        </label>

        {/* Tab & View Mode Controls */}
        <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl border border-[#cbd5e1] text-[12px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'write'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#475569] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'preview'
                ? 'bg-white text-[#0f172a] shadow-xs'
                : 'text-[#475569] hover:text-[#0f172a]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'split' ? 'write' : 'split')}
            className={`hidden md:flex px-3 py-1 rounded-lg transition-all items-center gap-1 ${
              activeTab === 'split'
                ? 'bg-[#1d4ed8] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#0f172a]'
            }`}
            title="Split Side-by-Side View"
          >
            <span className="material-symbols-outlined text-[15px]">vertical_split</span>
            <span>Split View</span>
          </button>
        </div>
      </div>

      {/* Editor Main Container */}
      <div className="border border-[#cbd5e1] rounded-2xl bg-white overflow-visible shadow-xs focus-within:border-[#1d4ed8] transition-colors relative">
        {/* Rich Formatting Toolbar */}
        {(activeTab === 'write' || activeTab === 'split') && (
          <div className="bg-[#f8fafc] p-2 border-b border-[#cbd5e1] flex flex-wrap items-center gap-1 text-[#0f172a] rounded-t-2xl relative z-20">
            {/* Bold Button */}
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'bold text')}
              className="p-1.5 hover:bg-white hover:text-[#1d4ed8] rounded-lg transition-colors border border-transparent hover:border-[#cbd5e1] font-black text-[14px] flex items-center justify-center w-8 h-8"
              title="Bold (Ctrl+B)"
            >
              <span className="font-extrabold text-[15px]">B</span>
            </button>

            {/* Italic Button */}
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'italic text')}
              className="p-1.5 hover:bg-white hover:text-[#1d4ed8] rounded-lg transition-colors border border-transparent hover:border-[#cbd5e1] italic font-serif text-[15px] flex items-center justify-center w-8 h-8"
              title="Italic (Ctrl+I)"
            >
              <span className="font-serif italic font-bold">I</span>
            </button>

            {/* Underline Button */}
            <button
              type="button"
              onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
              className="p-1.5 hover:bg-white hover:text-[#1d4ed8] rounded-lg transition-colors border border-transparent hover:border-[#cbd5e1] underline font-bold text-[14px] flex items-center justify-center w-8 h-8"
              title="Underline (Ctrl+U)"
            >
              <span className="underline font-bold text-[15px]">U</span>
            </button>

            {/* Internal / External Link Dropdown Button */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                type="button"
                onClick={handleOpenLinkDropdown}
                className={`p-1.5 rounded-lg transition-all border flex items-center gap-1 h-8 px-2 ${
                  isLinkDropdownOpen
                    ? 'bg-[#1d4ed8] text-white border-[#1d4ed8] shadow-xs'
                    : 'hover:bg-white hover:text-[#1d4ed8] border-transparent hover:border-[#cbd5e1]'
                }`}
                title="Insert Internal Link or URL (Ctrl+K)"
              >
                <span className="material-symbols-outlined text-[18px]">link</span>
                <span className="text-[12px] font-bold hidden sm:inline">Link</span>
                <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
              </button>

              {/* Dropdown Menu Popup */}
              {isLinkDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-[320px] sm:w-[420px] bg-white border border-[#cbd5e1] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown Header */}
                  <div className="p-3 bg-[#f8fafc] border-b border-[#cbd5e1] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#0f172a] font-bold text-[13px]">
                        <span className="material-symbols-outlined text-[#1d4ed8] text-[18px]">add_link</span>
                        <span>Insert Link into Selected Text</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsLinkDropdownOpen(false)}
                        className="text-[#64748b] hover:text-[#0f172a] p-1 rounded-md"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>

                    {/* Quick Category Filter Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setLinkCategoryFilter('all')}
                        className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                          linkCategoryFilter === 'all'
                            ? 'bg-[#0f172a] text-white'
                            : 'bg-white text-[#475569] border border-[#cbd5e1] hover:text-[#0f172a]'
                        }`}
                      >
                        All ({internalLinks.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkCategoryFilter('pages')}
                        className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                          linkCategoryFilter === 'pages'
                            ? 'bg-[#1d4ed8] text-white'
                            : 'bg-white text-[#475569] border border-[#cbd5e1] hover:text-[#0f172a]'
                        }`}
                      >
                        Pages
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkCategoryFilter('services')}
                        className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                          linkCategoryFilter === 'services'
                            ? 'bg-[#1d4ed8] text-white'
                            : 'bg-white text-[#475569] border border-[#cbd5e1] hover:text-[#0f172a]'
                        }`}
                      >
                        Services
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkCategoryFilter('blogs')}
                        className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                          linkCategoryFilter === 'blogs'
                            ? 'bg-[#1d4ed8] text-white'
                            : 'bg-white text-[#475569] border border-[#cbd5e1] hover:text-[#0f172a]'
                        }`}
                      >
                        Articles
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkCategoryFilter('custom')}
                        className={`px-2.5 py-1 rounded-lg transition-colors shrink-0 ${
                          linkCategoryFilter === 'custom'
                            ? 'bg-[#059669] text-white'
                            : 'bg-white text-[#475569] border border-[#cbd5e1] hover:text-[#0f172a]'
                        }`}
                      >
                        Custom URL
                      </button>
                    </div>

                    {/* Search Input for Internal Links */}
                    {linkCategoryFilter !== 'custom' && (
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#94a3b8] text-[18px]">
                          search
                        </span>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={linkSearchQuery}
                          onChange={(e) => setLinkSearchQuery(e.target.value)}
                          placeholder="Search service, article or page..."
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#cbd5e1] rounded-xl text-[13px] text-[#0f172a] focus:outline-none focus:border-[#1d4ed8]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Dropdown Items List */}
                  {linkCategoryFilter !== 'custom' ? (
                    <div className="max-h-[260px] overflow-y-auto divide-y divide-[#f1f5f9] p-1">
                      {filteredLinks.length > 0 ? (
                        filteredLinks.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyLink(item.url, item.title)}
                            className="w-full text-left p-2.5 hover:bg-[#f1f5f9] rounded-xl flex items-center justify-between group transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="material-symbols-outlined text-[#64748b] group-hover:text-[#1d4ed8] text-[18px] shrink-0">
                                {item.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="text-[13px] font-bold text-[#0f172a] truncate group-hover:text-[#1d4ed8]">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-[#64748b] font-mono truncate">
                                  {item.url}
                                </div>
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                                item.category === 'Main Page'
                                  ? 'bg-slate-100 text-slate-700'
                                  : item.category === 'Service'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {item.category}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-6 text-center text-[#64748b] text-[13px]">
                          <span className="material-symbols-outlined text-[28px] text-[#cbd5e1] mb-1 block">
                            search_off
                          </span>
                          No matching internal pages found for "{linkSearchQuery}".
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Custom URL Input Panel */
                    <div className="p-3 space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#475569] mb-1">
                          Destination URL / Link
                        </label>
                        <input
                          type="text"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCustomLinkSubmit();
                            }
                          }}
                          placeholder="https://example.com or /custom-page"
                          className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-xl text-[13px] text-[#0f172a] focus:outline-none focus:border-[#1d4ed8]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#475569] mb-1">
                          Link Display Text (Optional)
                        </label>
                        <input
                          type="text"
                          value={customLinkText}
                          onChange={(e) => setCustomLinkText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCustomLinkSubmit();
                            }
                          }}
                          placeholder={savedSelection.text || 'Display text'}
                          className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-xl text-[13px] text-[#0f172a] focus:outline-none focus:border-[#1d4ed8]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCustomLinkSubmit()}
                        className="w-full py-2 bg-[#1d4ed8] text-white rounded-xl text-[13px] font-bold hover:bg-[#1e40af] transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>Insert Custom Link</span>
                      </button>
                    </div>
                  )}

                  {/* Dropdown Footer Hint */}
                  <div className="p-2 bg-[#f8fafc] border-t border-[#cbd5e1] flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>
                      {savedSelection.text ? (
                        <>Linking word: <strong className="text-[#0f172a]">"{savedSelection.text}"</strong></>
                      ) : (
                        'No text selected (will insert title)'
                      )}
                    </span>
                    <span className="font-mono text-[10px]">Esc to close</span>
                  </div>
                </div>
              )}
            </div>

            <span className="h-5 w-[1px] bg-[#cbd5e1] mx-1" />

            {/* Heading 2 */}
            <button
              type="button"
              onClick={() => toggleHeading('##', 'Section Heading')}
              className="px-2.5 py-1 hover:bg-white hover:text-[#1d4ed8] rounded-lg transition-colors border border-transparent hover:border-[#cbd5e1] font-black text-[13px]"
              title="Heading 2 (## Title)"
            >
              H2
            </button>

            {/* Heading 3 */}
            <button
              type="button"
              onClick={() => toggleHeading('###', 'Subheading')}
              className="px-2.5 py-1 hover:bg-white hover:text-[#1d4ed8] rounded-lg transition-colors border border-transparent hover:border-[#cbd5e1] font-black text-[13px]"
              title="Heading 3 (### Subtitle)"
            >
              H3
            </button>

            <span className="h-5 w-[1px] bg-[#cbd5e1] mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={toggleBulletList}
              className="p-1.5 hover:bg-white hover:text-[#1d4ed8] rounded-lg transition-colors border border-transparent hover:border-[#cbd5e1] flex items-center justify-center w-8 h-8"
              title="Unordered Bullet List (- Item)"
            >
              <span className="material-symbols-outlined text-[19px]">format_list_bulleted</span>
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={toggleNumberedList}
              className="p-1.5 hover:bg-white hover:text-[#1d4ed8] rounded-lg transition-colors border border-transparent hover:border-[#cbd5e1] flex items-center justify-center w-8 h-8"
              title="Ordered Numbered List (1. Step)"
            >
              <span className="material-symbols-outlined text-[19px]">format_list_numbered</span>
            </button>

            <span className="ml-auto text-[11px] text-[#64748b] pr-2 hidden lg:inline">
              <kbd className="bg-white px-1 py-0.5 rounded border border-[#cbd5e1]">Enter</kbd> auto-continues lists • <kbd className="bg-white px-1 py-0.5 rounded border border-[#cbd5e1]">Tab</kbd> indents
            </span>
          </div>
        )}

        {/* Editor Body */}
        {activeTab === 'write' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={rows}
            required={required}
            placeholder={placeholder}
            className="w-full p-4 text-[15px] leading-relaxed form-input font-sans resize-y focus:outline-none border-0"
          />
        )}

        {activeTab === 'preview' && (
          <div className="p-6 min-h-[320px] max-h-[500px] overflow-y-auto bg-[#f8fafc]">
            {value ? (
              <RichTextRenderer content={value} />
            ) : (
              <p className="text-[#64748b] italic text-[14px]">
                No content to preview yet. Start typing or formatting in the Write tab.
              </p>
            )}
          </div>
        )}

        {activeTab === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#cbd5e1]">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={rows}
              required={required}
              placeholder={placeholder}
              className="w-full p-4 text-[14px] leading-relaxed form-input font-sans resize-none focus:outline-none border-0 h-[420px]"
            />
            <div className="p-4 bg-[#f8fafc] overflow-y-auto h-[420px]">
              <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
                Live Preview
              </div>
              {value ? (
                <RichTextRenderer content={value} />
              ) : (
                <p className="text-[#64748b] italic text-[13px]">
                  Live preview will render here as you type.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

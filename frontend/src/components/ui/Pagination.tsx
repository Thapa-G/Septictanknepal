import React from 'react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-[#cbd5e1] text-[#475569] hover:bg-[#e2e8f0] disabled:opacity-40 disabled:pointer-events-none transition-colors text-[14px] font-semibold"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {[...Array(lastPage)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-[14px] font-bold transition-colors ${
                isActive
                  ? 'bg-[#1d4ed8] text-white shadow-sm'
                  : 'border border-[#cbd5e1] text-[#475569] hover:bg-[#e2e8f0]'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1d4ed8] text-white hover:bg-[#1e40af] disabled:opacity-40 disabled:pointer-events-none transition-colors text-[14px] font-bold shadow-sm"
      >
        <span>Next</span>
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  );
}

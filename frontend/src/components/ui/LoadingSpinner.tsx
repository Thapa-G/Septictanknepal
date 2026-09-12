import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-[#cbd5e1] border-t-[#1d4ed8] rounded-full animate-spin" />
      <p className="text-[14px] font-medium text-[#475569]">{text}</p>
    </div>
  );
}

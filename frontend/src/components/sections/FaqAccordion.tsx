'use client';

import React, { useState } from 'react';
import { ServiceFaq } from '@/types';

interface FaqAccordionProps {
  faqs: ServiceFaq[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-8 mb-12">
      <h2 className="text-[24px] font-bold text-[#0f172a] mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className="border border-[#cbd5e1] rounded-2xl p-5 bg-white shadow-sm transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left font-bold text-[17px] text-[#0f172a] flex items-center justify-between gap-3 focus:outline-none"
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-[22px]">
                    help
                  </span>
                  <span>{faq.question}</span>
                </span>
                <span className="material-symbols-outlined text-[#64748b] text-[20px]">
                  {isOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {isOpen && (
                <div className="mt-3 pt-3 border-t border-[#cbd5e1]/60 text-[#475569] text-[15px] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

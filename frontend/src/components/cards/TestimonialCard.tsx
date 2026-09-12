import React from 'react';
import { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#cbd5e1] shadow-sm flex flex-col justify-between gap-4">
      <div>
        <div className="flex text-[#1d4ed8] mb-3">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <span
              key={i}
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          ))}
        </div>
        <p className="text-[#0f172a] italic text-[15px] leading-relaxed">
          &ldquo;{testimonial.comment}&rdquo;
        </p>
      </div>

      <div className="pt-3 border-t border-[#cbd5e1]">
        <p className="font-bold text-[#0f172a] text-[15px]">{testimonial.name}</p>
        <p className="text-[13px] text-[#475569]">{testimonial.location}</p>
      </div>
    </div>
  );
}

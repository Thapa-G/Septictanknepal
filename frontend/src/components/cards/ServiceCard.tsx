import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  isWide?: boolean;
}

export default function ServiceCard({ service, isWide = false }: ServiceCardProps) {
  const altText = service.cover_image_alt || service.title;

  if (isWide) {
    return (
      <Link
        href={`/services/${service.slug}`}
        className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden flex flex-col md:flex-row service-card transition-all duration-300 md:col-span-2 lg:col-span-2 shadow-sm hover:shadow-md group block cursor-pointer"
      >
        <div className="h-48 md:h-auto md:w-2/5 relative bg-[#e2e8f0] overflow-hidden flex items-center justify-center">
          {service.cover_image ? (
            <img
              src={service.cover_image}
              alt={altText}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="material-symbols-outlined text-4xl text-slate-400">
              {service.icon || 'waves'}
            </span>
          )}
        </div>
        <div className="p-6 flex-grow flex flex-col md:w-3/5 justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#1d4ed8] text-3xl group-hover:scale-110 transition-transform">
                {service.icon || 'waves'}
              </span>
              <h3 className="text-[20px] font-bold text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors">
                {service.title}
              </h3>
            </div>
            <p className="text-[#475569] text-[15px] leading-relaxed mb-4">
              {service.short_description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#cbd5e1]">
            <div className="bg-[#0b1e3b] text-white px-5 py-2.5 rounded-xl text-[14px] font-semibold group-hover:bg-[#1d4ed8] transition-colors flex items-center gap-2 shadow-sm">
              <span>Learn More</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/services/${service.slug}`}
      className="bg-white border border-[#cbd5e1] rounded-2xl overflow-hidden flex flex-col service-card transition-all duration-300 shadow-sm hover:shadow-md group block cursor-pointer h-full"
    >
      <div className="h-48 w-full relative bg-[#e2e8f0] overflow-hidden flex items-center justify-center">
        {service.cover_image ? (
          <img
            src={service.cover_image}
            alt={altText}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="material-symbols-outlined text-4xl text-slate-400">
            {service.icon || 'water_damage'}
          </span>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#1d4ed8] text-3xl group-hover:scale-110 transition-transform">
              {service.icon || 'water_damage'}
            </span>
            <h3 className="text-[20px] font-bold text-[#0f172a] group-hover:text-[#1d4ed8] transition-colors">
              {service.title}
            </h3>
          </div>
          <p className="text-[#475569] text-[15px] leading-relaxed line-clamp-3 mb-4">
            {service.short_description}
          </p>
        </div>
        <div className="text-[#0f172a] font-semibold text-[14px] flex items-center group-hover:text-[#1d4ed8] transition-colors mt-auto w-max">
          <span>Details</span>
          <span className="material-symbols-outlined ml-1 text-sm group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>
    </Link>
  );
}

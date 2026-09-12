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
        <div className="h-48 md:h-auto md:w-2/5 relative bg-[#e2e8f0] overflow-hidden">
          <img
            src={service.cover_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI7cIdzb6CdTFXDBA04BFdeZZrpEzXyFAHxlQ66oFQUkEPT4dsseY5yQ7K9JsYv5X7rEXW52M-3cAOaovmqZdl7ZBO6oo51siovdphhhfQ2-NKzpiDJdxIoMX36lswBrpSsGL2Ey_HDHxeSqwthqQcg42sRu2KZyb9YQrVgHOkFPmOiS9eSG3HkpTcFbl4ur7qPZu1CFByM-oLDC6cdXUi9yhmZFHfseVtFezqSX2sFke4kC3Oy5Si'}
            alt={altText}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
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
      <div className="h-48 w-full relative bg-[#e2e8f0] overflow-hidden">
        <img
          src={service.cover_image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWjluVn_75F2aC8zdzdrUADedD105FKqFeURRJoD13s-xwUsMKrOANHC0GJsXq3_I0uUTzt5TZ54X52_OFZGtmu-d5ir6GNkvSvWvWbW_5zJTVFEDK1MPlmauBcEYXgBaZOf2TtBzrFp6rad5hZXBqnyMNg-A3cCwEezyrnmVQyTg3uHWu5N8LGU9ShdZ25rC5veJnOMgUGy11z5zfSXjB8rBlKS_g137C3Ua7x-QJc_Qs_7TqzqDw'}
          alt={altText}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
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

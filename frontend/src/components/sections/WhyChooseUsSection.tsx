import React from 'react';

export default function WhyChooseUsSection() {
  const reasons = [
    '10+ years of practical experience',
    'Skilled drainage and plumbing technicians',
    'Modern drain-cleaning and hydro-jetting equipment',
    'Free consultation, site inspection & clear quotations',
    'Reliable, hygienic service across Kathmandu, Bhaktapur & Lalitpur',
  ];

  return (
    <section className="w-full bg-[#f8fafc] py-16 border-b border-[#cbd5e1]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative h-[350px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden shadow-lg border border-[#cbd5e1]">
            <img
              src="/images/kathmandudrainagecleaning.jpeg"
              alt="Professional drainage technicians working on drain cleaning in Kathmandu"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[28px] md:text-[40px] font-bold text-[#0f172a] leading-tight">
              Why Kathmandu Valley Chooses Septic-Tank Nepal For Drainage Solution
            </h2>

            <div className="grid grid-cols-1 gap-3.5">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[#1d4ed8] text-[22px] flex-shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <p className="text-[#0f172a] text-[15px] font-medium leading-relaxed">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

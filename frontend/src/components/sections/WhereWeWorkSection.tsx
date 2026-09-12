import React from 'react';
import WhereWeWorkCard from '../cards/WhereWeWorkCard';


export default function WhereWeWorkSection() {
  const areas = [
    {
      icon: 'bathtub',
      title: 'Bathroom',
      description: 'Expert cleaning for toilets, sinks, and bathtub drains to prevent overflows and messy foul backups.',
    },
    {
      icon: 'kitchen',
      title: 'Kitchen',
      description: 'Clearing grease, food waste, and soap scum from kitchen sinks and dishwasher drainage lines.',
    },
    {
      icon: 'plumbing',
      title: 'Sewage & Main Lines',
      description: 'High-pressure hydro jetting for main municipal connections and complex underground pipe networks.',
    },
    {
      icon: 'propane_tank',
      title: 'Septic & Soak Pits',
      description: 'Professional vacuum pumping and scheduled maintenance for residential and commercial septic systems.',
    },
    {
      icon: 'water_drop',
      title: 'Water Tanks & Wells',
      description: 'Hygienic cleaning, de-sludging, and certified disinfection of underground and overhead drinking water storage.',
    },
    {
      icon: 'rainy',
      title: 'Outdoor & Rainwater',
      description: 'Clearing leaves, silt, and debris from storm drains, courtyard gutters, and rainwater pipes.',
    },
  ];

  return (
    <section className="w-full bg-[#f1f5f9] py-16 border-b border-[#cbd5e1]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#0f172a] mb-3">
            Where We Work
          </h2>
          <p className="text-[16px] text-[#475569] max-w-[600px] mx-auto">
            Comprehensive professional drainage and plumbing solutions for every part of your residential or commercial property in Kathmandu Valley.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <WhereWeWorkCard
              key={area.title}
              icon={area.icon}
              title={area.title}
              description={area.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

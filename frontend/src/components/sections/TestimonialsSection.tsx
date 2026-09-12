import React from 'react';
import TestimonialCard from '../cards/TestimonialCard';
import { Testimonial } from '@/types';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const fallbackTestimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ramesh K.',
      location: 'Lalitpur',
      rating: 5,
      comment: 'Professional and quick service! They unblocked my drain in no time.',
      order: 1,
    },
    {
      id: 2,
      name: 'Sita M.',
      location: 'Bhaktapur',
      rating: 5,
      comment: 'Highly recommend for their transparent pricing and expert team.',
      order: 2,
    },
    {
      id: 3,
      name: 'Anil T.',
      location: 'Kathmandu',
      rating: 5,
      comment: 'Best plumbing service in Kathmandu. They were very careful and hygienic.',
      order: 3,
    },
  ];

  const displayList = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section className="w-full bg-[#f1f5f9] py-16">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-[28px] md:text-[40px] font-bold text-[#0f172a] mb-3">
            What Our Customers Are Saying
          </h2>
          <p className="text-[16px] text-[#475569] max-w-[600px] mx-auto">
            Real feedback from residents and commercial businesses across Kathmandu Valley.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayList.map((item) => (
            <TestimonialCard key={item.name} testimonial={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

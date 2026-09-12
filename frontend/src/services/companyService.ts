import { api } from '@/lib/api';
import { CompanyDetails, Testimonial, AdminStats } from '@/types';

export const companyService = {
  async getDetails(): Promise<CompanyDetails> {
    return api.get<CompanyDetails>('/company');
  },

  async updateDetails(data: Partial<CompanyDetails>): Promise<{ message: string; data: CompanyDetails }> {
    return api.put<{ message: string; data: CompanyDetails }>('/admin/company', data);
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return api.get<Testimonial[]>('/testimonials');
  },

  async getAdminStats(): Promise<AdminStats> {
    return api.get<AdminStats>('/admin/stats');
  },

  async uploadImage(file: File): Promise<{ message: string; url: string; path: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ message: string; url: string; path: string }>('/admin/upload', formData);
  },
};

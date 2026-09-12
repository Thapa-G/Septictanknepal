import { api } from '@/lib/api';
import { Service, PaginatedResponse } from '@/types';

export const servicesService = {
  async getAll(params?: { search?: string; featured_only?: boolean; per_page?: number }): Promise<Service[] | PaginatedResponse<Service>> {
    return api.get<Service[] | PaginatedResponse<Service>>('/services', params);
  },

  async getBySlug(idOrSlug: string | number): Promise<Service> {
    return api.get<Service>(`/services/${idOrSlug}`);
  },

  async create(data: Partial<Service> & { faqs?: { question: string; answer: string }[] }): Promise<{ message: string; data: Service }> {
    return api.post<{ message: string; data: Service }>('/admin/services', data);
  },

  async update(id: number, data: Partial<Service> & { faqs?: { question: string; answer: string }[] }): Promise<{ message: string; data: Service }> {
    return api.put<{ message: string; data: Service }>(`/admin/services/${id}`, data);
  },

  async delete(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/admin/services/${id}`);
  },
};

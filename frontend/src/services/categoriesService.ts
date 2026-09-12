import { api } from '@/lib/api';
import { Category } from '@/types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    return api.get<Category[]>('/categories');
  },

  async create(name: string): Promise<{ message: string; category: Category }> {
    return api.post<{ message: string; category: Category }>('/admin/categories', { name });
  },

  async delete(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/admin/categories/${id}`);
  },
};

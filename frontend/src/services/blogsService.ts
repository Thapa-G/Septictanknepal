import { api } from '@/lib/api';
import { Blog, PaginatedResponse } from '@/types';

export const blogsService = {
  async getAll(params?: { search?: string; category?: string; featured_only?: boolean; per_page?: number; page?: number }): Promise<PaginatedResponse<Blog>> {
    return api.get<PaginatedResponse<Blog>>('/blogs', params);
  },

  async getBySlug(idOrSlug: string | number): Promise<{ blog: Blog; recent_posts: Blog[] }> {
    return api.get<{ blog: Blog; recent_posts: Blog[] }>(`/blogs/${idOrSlug}`);
  },

  async create(data: Partial<Blog>): Promise<{ message: string; data: Blog }> {
    return api.post<{ message: string; data: Blog }>('/admin/blogs', data);
  },

  async update(id: number, data: Partial<Blog>): Promise<{ message: string; data: Blog }> {
    return api.put<{ message: string; data: Blog }>(`/admin/blogs/${id}`, data);
  },

  async delete(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/admin/blogs/${id}`);
  },
};

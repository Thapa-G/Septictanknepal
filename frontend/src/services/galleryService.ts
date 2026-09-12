import { api } from '@/lib/api';
import { GalleryItem, PaginatedResponse } from '@/types';

export const galleryService = {
  async getAll(params?: {
    category?: string;
    search?: string;
    is_featured?: boolean;
    per_page?: number;
  }): Promise<{ success?: boolean; data: GalleryItem[] } | PaginatedResponse<GalleryItem>> {
    return api.get<{ success?: boolean; data: GalleryItem[] } | PaginatedResponse<GalleryItem>>('/gallery', params);
  },

  async getById(id: number | string): Promise<{ success: boolean; data: GalleryItem }> {
    return api.get<{ success: boolean; data: GalleryItem }>(`/gallery/${id}`);
  },

  async create(data: Partial<GalleryItem>): Promise<{ message: string; data: GalleryItem }> {
    return api.post<{ message: string; data: GalleryItem }>('/admin/gallery', data);
  },

  async update(id: number, data: Partial<GalleryItem>): Promise<{ message: string; data: GalleryItem }> {
    return api.put<{ message: string; data: GalleryItem }>(`/admin/gallery/${id}`, data);
  },

  async delete(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/admin/gallery/${id}`);
  },
};

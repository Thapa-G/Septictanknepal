import { api } from '@/lib/api';
import { ContactMessage, PaginatedResponse } from '@/types';

export const contactService = {
  async submit(data: {
    name: string;
    phone: string;
    location?: string;
    service_needed?: string;
    message?: string;
  }): Promise<{ message: string; data: ContactMessage }> {
    return api.post<{ message: string; data: ContactMessage }>('/contact', data);
  },

  async getMessages(page: number = 1): Promise<PaginatedResponse<ContactMessage>> {
    return api.get<PaginatedResponse<ContactMessage>>('/admin/contact-messages', { page });
  },

  async markAsRead(id: number): Promise<{ message: string; data: ContactMessage }> {
    return api.patch<{ message: string; data: ContactMessage }>(`/admin/contact-messages/${id}/read`);
  },
};

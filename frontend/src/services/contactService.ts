import { api } from './api';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
};

export type ContactInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export const contactService = {
  getAll(): Promise<ContactMessage[]> {
    return api.get<ContactMessage[]>('/api/contact');
  },

  send(data: ContactInput): Promise<ContactMessage> {
    return api.post<ContactMessage>('/api/contact', data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/contact/${id}`);
  },
};

import { api } from './api';

export type FAQ = {
  id: number;
  question: string;
  answer_kh: string;
  answer_en: string;
};

export type FAQInput = Omit<FAQ, 'id'>;

export const faqService = {
  getAll(): Promise<FAQ[]> {
    return api.get<FAQ[]>('/api/faqs');
  },

  create(data: FAQInput): Promise<FAQ> {
    return api.post<FAQ>('/api/faqs', data);
  },

  update(id: number, data: Partial<FAQInput>): Promise<FAQ> {
    return api.put<FAQ>(`/api/faqs/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/faqs/${id}`);
  },
};

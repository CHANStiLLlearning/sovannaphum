import { api } from './api';

export type NewsArticle = {
  id: number;
  title: string;
  image: string;
  date: string;
  description: string;
  createdAt: string;
};

export type NewsInput = Omit<NewsArticle, 'id' | 'createdAt'>;

export type NewsParams = {
  search?: string;
  limit?: number;
};

function buildQuery(params?: NewsParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.limit !== undefined) q.set('limit', String(params.limit));
  const str = q.toString();
  return str ? `?${str}` : '';
}

export const newsService = {
  getAll(params?: NewsParams): Promise<NewsArticle[]> {
    return api.get<NewsArticle[]>(`/api/news${buildQuery(params)}`);
  },

  create(data: NewsInput): Promise<NewsArticle> {
    return api.post<NewsArticle>('/api/news', data);
  },

  update(id: number, data: Partial<NewsInput>): Promise<NewsArticle> {
    return api.put<NewsArticle>(`/api/news/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/news/${id}`);
  },
};

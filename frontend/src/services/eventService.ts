import { api } from './api';

export type SchoolEvent = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  image?: string;
  status?: string;
  badge?: string;
  createdAt: string;
};

export type EventInput = Omit<SchoolEvent, 'id' | 'createdAt'>;

export type EventParams = {
  search?: string;
  date?: string;
  limit?: number;
};

function buildQuery(params?: EventParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.date) q.set('date', params.date);
  if (params.limit !== undefined) q.set('limit', String(params.limit));
  const str = q.toString();
  return str ? `?${str}` : '';
}

export const eventService = {
  getAll(params?: EventParams): Promise<SchoolEvent[]> {
    return api.get<SchoolEvent[]>(`/api/events${buildQuery(params)}`);
  },

  create(data: EventInput): Promise<SchoolEvent> {
    return api.post<SchoolEvent>('/api/events', data);
  },

  update(id: number, data: Partial<EventInput>): Promise<SchoolEvent> {
    return api.put<SchoolEvent>(`/api/events/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/events/${id}`);
  },
};

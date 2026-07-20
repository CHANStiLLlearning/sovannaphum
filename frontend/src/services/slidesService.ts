import { api } from './api';

export type Slide = {
  id: number;
  image: string;
  tag: string;
  title: string;
  description: string;
  iconName: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
};

export type SlideInput = Omit<Slide, 'id'>;

export const slidesService = {
  getAll(): Promise<Slide[]> {
    return api.get<Slide[]>('/api/slides');
  },

  create(data: SlideInput): Promise<Slide> {
    return api.post<Slide>('/api/slides', data);
  },

  update(id: number, data: Partial<SlideInput>): Promise<Slide> {
    return api.put<Slide>(`/api/slides/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/slides/${id}`);
  },
};

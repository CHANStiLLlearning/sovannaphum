import { api } from './api';

export type Feature = {
  id: number;
  title: string;
  description: string;
  iconName?: string;
  colorClass?: string;
};

export type FeatureInput = Omit<Feature, 'id'>;

export const featureService = {
  getAll(): Promise<Feature[]> {
    return api.get<Feature[]>('/api/features');
  },

  create(data: FeatureInput): Promise<Feature> {
    return api.post<Feature>('/api/features', data);
  },

  update(id: number, data: Partial<FeatureInput>): Promise<Feature> {
    return api.put<Feature>(`/api/features/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/features/${id}`);
  },
};

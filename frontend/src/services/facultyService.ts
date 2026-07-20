import { api } from './api';

export type FacultyMember = {
  id: number;
  name: string;
  title?: string;
  subject?: string;
  image?: string;
  createdAt?: string;
};

export type FacultyInput = Omit<FacultyMember, 'id' | 'createdAt'>;

export type FacultyParams = {
  limit?: number;
};

export const facultyService = {
  getAll(params?: FacultyParams): Promise<FacultyMember[]> {
    const q = params?.limit !== undefined ? `?limit=${params.limit}` : '';
    return api.get<FacultyMember[]>(`/api/teachers${q}`);
  },

  create(data: FacultyInput): Promise<FacultyMember> {
    return api.post<FacultyMember>('/api/teachers', data);
  },

  update(id: number, data: Partial<FacultyInput>): Promise<FacultyMember> {
    return api.put<FacultyMember>(`/api/teachers/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/teachers/${id}`);
  },
};

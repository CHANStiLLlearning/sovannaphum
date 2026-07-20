import { api } from './api';

export type Partner = {
  id: number;
  name: string;
  logo: string;
};

export type PartnerInput = Omit<Partner, 'id'>;

export const partnerService = {
  getAll(): Promise<Partner[]> {
    return api.get<Partner[]>('/api/partners');
  },

  create(data: PartnerInput): Promise<Partner> {
    return api.post<Partner>('/api/partners', data);
  },

  update(id: number, data: Partial<PartnerInput>): Promise<Partner> {
    return api.put<Partner>(`/api/partners/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.del(`/api/partners/${id}`);
  },
};

import { api } from './api';

export type Settings = Record<string, string>;

export const settingsService = {
  get(): Promise<Settings> {
    return api.get<Settings>('/api/settings');
  },

  save(data: Settings): Promise<Settings> {
    return api.post<Settings>('/api/settings', data);
  },
};

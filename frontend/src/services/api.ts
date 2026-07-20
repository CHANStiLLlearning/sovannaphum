/**
 * Base HTTP client.
 * All services use these helpers — never call fetch() directly in components.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'https://sovannaphum.onrender.com';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`API ${options.method ?? 'GET'} ${path} failed (${res.status}): ${errorText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>(path);
  },

  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
  },

  put<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
  },

  del<T = void>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' });
  },

  /** Upload a file (multipart/form-data). Returns the uploaded file URL. */
  async upload(file: File): Promise<string> {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${BASE_URL}/api/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const data = await res.json();
    return data.url as string;
  },
};

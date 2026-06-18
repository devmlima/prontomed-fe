import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function httpGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const res = await api.get<T>(path, { params });
    return res.data;
  } catch (err) {
    handleHttpError(err);
    throw err;
  }
}

export async function httpPost<T>(path: string, body?: unknown): Promise<T> {
  try {
    const res = await api.post<T>(path, body);
    return res.data;
  } catch (err) {
    handleHttpError(err);
    throw err;
  }
}

function handleHttpError(err: unknown) {
  if (err instanceof AxiosError) {
    console.error('HTTP Error:', err.response?.status, err.response?.data || err.message);
  } else {
    console.error('Unknown HTTP Error:', err);
  }
}

import Axios from 'axios';

const redirectToLogin = async () => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === '/login') return;
  window.location.replace('/login');
};

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082',
  maxRedirects: 0,
  validateStatus: (status) => status >= 200 && status < 400,
});

let cachedAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Request interceptor
AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  if (cachedAccessToken) {
    config.headers.Authorization = `Bearer ${cachedAccessToken}`;
  }

  delete (config.headers as Record<string, unknown>)['Accept-Language'];

  return config;
});

// Response interceptor
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      cachedAccessToken = null;
      await redirectToLogin();
    }

    return Promise.reject(error);
  }
);

// orval v8 compatible customInstance
export const customInstance = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const { method = 'GET', body, headers } = options || {};

  const response = await AXIOS_INSTANCE({
    url,
    method,
    data: body,
    headers: headers as Record<string, string>,
  });

  // response.data로 바로 접근할 수 있도록 실제 데이터만 반환
  return response.data as T;
};

export default customInstance;

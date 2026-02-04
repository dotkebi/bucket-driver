import Axios from 'axios';

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8082';
const upgradedBaseUrl =
  typeof window !== 'undefined' && rawBaseUrl.startsWith('http://dev-bucket-admin.mjkompany.com')
    ? rawBaseUrl.replace('http://', 'https://')
    : rawBaseUrl;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: upgradedBaseUrl,
  maxRedirects: 0,
  validateStatus: (status) => status >= 200 && status < 400,
});

let cachedAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Request interceptor
AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  let token = cachedAccessToken;

  // 만약 메모리에 토큰이 없고 브라우저 환경이라면 NextAuth 세션에서 직접 가져옴
  if (!token && typeof window !== 'undefined') {
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    if (session?.accessToken) {
      token = session.accessToken;
      cachedAccessToken = token;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  delete (config.headers as Record<string, unknown>)['Accept-Language'];

  return config;
});

// Response interceptor
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      console.error('API 401 Unauthorized:', {
        url: originalRequest?.url,
        method: originalRequest?.method,
        timestamp: new Date().toISOString(),
      });

      // 로그아웃 처리 후 로그인 페이지로 이동
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });
      cachedAccessToken = null;
      window.location.href = '/login';
      return Promise.reject(error);
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

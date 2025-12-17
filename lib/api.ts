import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev-bucket-admin.mjkompany.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login (avoid redirect if already on login page)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          // Clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // Redirect to login page
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface DriverPickupItem {
  id: string;
  serviceName: string;
  status: string;
  collectionDate: string;
  collectionStartTime: string;
  collectionEndTime: string;
  fullAddress: string;
  detailAddress?: string;
  postalCode?: string;
  accessType?: string;
  accessDetails?: string;
  contactPhone?: string;
  contactEmail?: string;
  customerNotes?: string;
  collectedWeight?: number;
  photoUrls?: string;
  driverAllowance?: number;
  assignedAt?: string;
  completedAt?: string;
  createdAt?: string;
}

export interface DriverPickupDetail extends DriverPickupItem {
  // Additional detail fields if needed
}

export interface CompletePickupRequest {
  collectedWeight: number;
  photoUrls?: string[];
}

export interface DriverFeeEstimate {
  pickupId: string;
  baseAllowance: number;
  weightBasedFee: number;
  incentiveAmount: number;
  totalFee: number;
  incentiveDetails?: IncentiveDetail[];
}

export interface IncentiveDetail {
  type: string;
  amount: number;
  description?: string;
}

export interface AllowanceDetail {
  pickupId: string;
  collectionDate: string;
  collectedWeight: number;
  allowance: number;
}

export interface DriverAllowance {
  driverId: string;
  driverName: string;
  startDate: string;
  endDate: string;
  totalPickups: number;
  totalWeight: number;
  totalAllowance: number;
  details: AllowanceDetail[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  requiresTwoFactor?: boolean;
  message?: string;
  expiresIn?: number;
  verificationCode?: string; // Only in dev
}

export interface VerifyTwoFactorRequest {
  username: string;
  verificationCode: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verifyTwoFactor: async (request: VerifyTwoFactorRequest): Promise<TokenResponse> => {
    const response = await api.post('/auth/verify-2fa', request);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.get('/auth/refresh-token', {
      params: { refreshToken },
    });
    return response.data;
  },
};

// API functions
export const driverApi = {
  // Get all assigned pickups
  getAssignedPickups: async (): Promise<DriverPickupItem[]> => {
    const response = await api.get('/api/driver/pickups');
    return response.data;
  },

  // Get pickups by status
  getPickupsByStatus: async (status: string): Promise<DriverPickupItem[]> => {
    const response = await api.get(`/api/driver/pickups/status/${status}`);
    return response.data;
  },

  // Get pickup detail
  getPickupDetail: async (pickupId: string): Promise<DriverPickupDetail> => {
    const response = await api.get(`/api/driver/pickups/${pickupId}`);
    return response.data;
  },

  // Get fee estimate
  getFeeEstimate: async (pickupId: string): Promise<DriverFeeEstimate> => {
    const response = await api.get(`/api/driver/pickups/${pickupId}/fee`);
    return response.data;
  },

  // Complete pickup
  completePickup: async (
    pickupId: string,
    data: CompletePickupRequest
  ): Promise<void> => {
    await api.post(`/api/driver/pickups/${pickupId}/complete`, data);
  },

  // Get allowance for date range
  getAllowance: async (startDate: string, endDate: string): Promise<DriverAllowance> => {
    const response = await api.get('/api/v1/driver/allowance', {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  // Get this month's allowance
  getThisMonthAllowance: async (): Promise<DriverAllowance> => {
    const response = await api.get('/api/v1/driver/allowance/this-month');
    return response.data.data;
  },
};

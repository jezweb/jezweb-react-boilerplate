import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { LocalStorageControl } from '../core/utils/storage';
import { CONST } from '../core/constants';
import { isAuthUrl, getUtcMillis } from '../core/utils';
import { useLoadingStore } from '../stores/loading.store';

const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosApiClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const { incrementRequests, decrementRequests } = useLoadingStore.getState();

const handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  incrementRequests();
  
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept-Language'] = 'en';

  if (!config.url) {
    return config;
  }

  config = processRequestUrl(config);
  config = addAuthorizationHeader(config);
  config = addAccessTokenHeader(config);

  return config;
};

const processRequestUrl = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (config.url && !config.url.startsWith('http')) {
    config.url = `${BASE_API_URL}/${config.url}`;
  }
  return config;
};

const addAccessTokenHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const ACCESS_TOKEN_HEADER = import.meta.env.VITE_ACCESS_HEADER;

  if (ACCESS_TOKEN && ACCESS_TOKEN_HEADER) {
    const utcMillis = getUtcMillis();
    const encryptedToken = `${ACCESS_TOKEN}-${utcMillis}`;
    config.headers[ACCESS_TOKEN_HEADER] = encryptedToken;
  }

  return config;
};

const addAuthorizationHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (!isAuthUrl(config.url)) {
    const token = LocalStorageControl.get(CONST.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
};

const handleResponse = (response: AxiosResponse): AxiosResponse => {
  decrementRequests();
  return response;
};

const handleResponseError = async (error: any): Promise<AxiosResponse> => {
  decrementRequests();

  const originalRequestConfig: InternalAxiosRequestConfig | undefined = error.config;

  if (
    originalRequestConfig &&
    error.response?.status === 401 &&
    error.response?.data?.message === "Expired JWT Token"
  ) {
    return handleTokenRefresh(originalRequestConfig);
  }

  return Promise.reject(error);
};

const handleTokenRefresh = async (originalRequestConfig: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const refreshToken = LocalStorageControl.get(CONST.REFRESH_TOKEN);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${BASE_API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    LocalStorageControl.set(CONST.ACCESS_TOKEN, accessToken);
    if (newRefreshToken) {
      LocalStorageControl.set(CONST.REFRESH_TOKEN, newRefreshToken);
    }

    originalRequestConfig.headers.Authorization = `Bearer ${accessToken}`;
    
    return axiosApiClient(originalRequestConfig);
  } catch (error) {
    LocalStorageControl.remove(CONST.ACCESS_TOKEN);
    LocalStorageControl.remove(CONST.REFRESH_TOKEN);
    LocalStorageControl.remove(CONST.USER_DATA);
    
    window.location.href = '/login';
    
    return Promise.reject(error);
  }
};

axiosApiClient.interceptors.request.use(handleRequest, (error) => Promise.reject(error));
axiosApiClient.interceptors.response.use(handleResponse, handleResponseError);

export default axiosApiClient;
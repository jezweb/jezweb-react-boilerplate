import axiosApiClient from './axios-client';
import { API_ENDPOINTS, CONST } from '../core/constants';
import { LocalStorageControl } from '../core/utils/storage';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '../models/user.model';
import { useUserStore } from '../stores/user.store';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '../stores/api-event.store';

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const apiEventStore = useApiEventStore.getState();
    const userStore = useUserStore.getState();
    
    apiEventStore.sendEvent({
      type: ApiEventType.LOGIN,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });
    
    try {
      const response = await axiosApiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      
      LocalStorageControl.set(CONST.ACCESS_TOKEN, response.data.accessToken);
      LocalStorageControl.set(CONST.REFRESH_TOKEN, response.data.refreshToken);
      LocalStorageControl.setJSON(CONST.USER_DATA, response.data.user);
      
      userStore.updateUser(response.data.user);
      
      apiEventStore.sendEvent({
        type: ApiEventType.LOGIN,
        status: ApiEventStatus.COMPLETED,
        message: 'Login successful',
        spinner: false,
        toast: true,
      });
      
      return response.data;
    } catch (error: any) {
      apiEventStore.sendEvent({
        type: ApiEventType.LOGIN,
        status: ApiEventStatus.ERROR,
        message: error?.response?.data?.message || 'Login failed',
        spinner: false,
        toast: true,
      });
      throw error;
    }
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const apiEventStore = useApiEventStore.getState();
    
    apiEventStore.sendEvent({
      type: ApiEventType.REGISTER,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });
    
    try {
      const response = await axiosApiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      
      apiEventStore.sendEvent({
        type: ApiEventType.REGISTER,
        status: ApiEventStatus.COMPLETED,
        message: 'Registration successful',
        spinner: false,
        toast: true,
      });
      
      return response.data;
    } catch (error: any) {
      apiEventStore.sendEvent({
        type: ApiEventType.REGISTER,
        status: ApiEventStatus.ERROR,
        message: error?.response?.data?.message || 'Registration failed',
        spinner: false,
        toast: true,
      });
      throw error;
    }
  },

  async logout(): Promise<void> {
    const apiEventStore = useApiEventStore.getState();
    const userStore = useUserStore.getState();
    
    try {
      await axiosApiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      LocalStorageControl.remove(CONST.ACCESS_TOKEN);
      LocalStorageControl.remove(CONST.REFRESH_TOKEN);
      LocalStorageControl.remove(CONST.USER_DATA);
      
      userStore.clearUser();
      
      apiEventStore.sendEvent({
        type: ApiEventType.LOGOUT,
        status: ApiEventStatus.COMPLETED,
        message: 'Logged out successfully',
        toast: true,
      });
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const storedUser = LocalStorageControl.getJSON<User>(CONST.USER_DATA);
    if (storedUser) {
      return storedUser;
    }
    
    const token = LocalStorageControl.get(CONST.ACCESS_TOKEN);
    if (!token) {
      return null;
    }
    
    try {
      const response = await axiosApiClient.get<User>('/auth/me');
      LocalStorageControl.setJSON(CONST.USER_DATA, response.data);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!LocalStorageControl.get(CONST.ACCESS_TOKEN);
  },
};
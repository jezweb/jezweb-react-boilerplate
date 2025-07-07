import axiosApiClient from './axios-client';
import { API_ENDPOINTS } from '../core/constants';
import { User } from '../models/user.model';
import { useApiEventStore, ApiEventType, ApiEventStatus } from '../stores/api-event.store';

export const userService = {
  async getUsers(): Promise<User[]> {
    const eventType = ApiEventType.GET_USERS;
    const apiEventStore = useApiEventStore.getState();
    
    apiEventStore.sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });
    
    try {
      const response = await axiosApiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
      
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.COMPLETED,
        spinner: false,
      });
      
      return response.data;
    } catch (error: any) {
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.ERROR,
        message: error?.response?.data?.message || 'Failed to fetch users',
        spinner: false,
        toast: true,
      });
      throw error;
    }
  },

  async getUser(id: string): Promise<User> {
    const eventType = ApiEventType.GET_USER;
    const apiEventStore = useApiEventStore.getState();
    
    apiEventStore.sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      targetId: id,
      spinner: true,
    });
    
    try {
      const response = await axiosApiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id));
      
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.COMPLETED,
        targetId: id,
        spinner: false,
      });
      
      return response.data;
    } catch (error: any) {
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.ERROR,
        targetId: id,
        message: error?.response?.data?.message || 'Failed to fetch user',
        spinner: false,
        toast: true,
      });
      throw error;
    }
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const eventType = ApiEventType.UPDATE_USER;
    const apiEventStore = useApiEventStore.getState();
    
    apiEventStore.sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      targetId: id,
      spinner: true,
    });
    
    try {
      const response = await axiosApiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
      
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.COMPLETED,
        targetId: id,
        message: 'User updated successfully',
        spinner: false,
        toast: true,
      });
      
      return response.data;
    } catch (error: any) {
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.ERROR,
        targetId: id,
        message: error?.response?.data?.message || 'Failed to update user',
        spinner: false,
        toast: true,
      });
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    const eventType = ApiEventType.DELETE_USER;
    const apiEventStore = useApiEventStore.getState();
    
    apiEventStore.sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      targetId: id,
      spinner: true,
    });
    
    try {
      await axiosApiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
      
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.COMPLETED,
        targetId: id,
        message: 'User deleted successfully',
        spinner: false,
        toast: true,
      });
    } catch (error: any) {
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.ERROR,
        targetId: id,
        message: error?.response?.data?.message || 'Failed to delete user',
        spinner: false,
        toast: true,
      });
      throw error;
    }
  },
};
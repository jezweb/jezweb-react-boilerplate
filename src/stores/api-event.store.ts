import { create } from 'zustand';

export enum ApiEventStatus {
  DEFAULT,
  IN_PROGRESS,
  COMPLETED,
  ERROR,
}

export enum ApiEventType {
  DEFAULT,
  LOGIN,
  LOGOUT,
  REGISTER,
  GET_USERS,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  CREATE_USER,
}

export interface ApiEvent {
  type: ApiEventType;
  status: ApiEventStatus;
  title?: string;
  message?: string;
  spinner?: boolean;
  popup?: boolean;
  toast?: boolean;
  targetId?: string | number;
}

interface ApiEventStore {
  currentEvent: ApiEvent | null;
  subscribers: ((event: ApiEvent | null) => void)[];
  sendEvent: (event: ApiEvent) => void;
  subscribe: (callback: (event: ApiEvent | null) => void) => () => void;
  clearEvent: () => void;
}

export const useApiEventStore = create<ApiEventStore>((set, get) => ({
  currentEvent: null,
  subscribers: [],
  sendEvent: (event: ApiEvent) => {
    set({ currentEvent: event });
    get().subscribers.forEach(callback => callback(event));
  },
  subscribe: (callback: (event: ApiEvent | null) => void) => {
    set({ subscribers: [...get().subscribers, callback] });
    return () => {
      set({ subscribers: get().subscribers.filter(cb => cb !== callback) });
    };
  },
  clearEvent: () => {
    set({ currentEvent: null });
  },
}));
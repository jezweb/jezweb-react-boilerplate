import { create } from 'zustand';

interface LoadingStore {
  requestCount: number;
  isLoading: boolean;
  incrementRequests: () => void;
  decrementRequests: () => void;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  requestCount: 0,
  isLoading: false,
  incrementRequests: () => {
    const newCount = get().requestCount + 1;
    set({ requestCount: newCount, isLoading: newCount > 0 });
  },
  decrementRequests: () => {
    const newCount = Math.max(0, get().requestCount - 1);
    set({ requestCount: newCount, isLoading: newCount > 0 });
  },
}));
import { User } from '../models/user.model';
import { createResettableStoreWithPersist } from './resettable-store-persist';

interface UserStore {
  user: User | null;
  updateUser: (user: User | null) => void;
  clearUser: () => void;
}

const initialState = {
  user: null,
};

export const useUserStore = createResettableStoreWithPersist<UserStore>(
  initialState,
  (set) => ({
    updateUser: (user: User | null) => set({ user }),
    clearUser: () => set({ user: null }),
  }),
  {
    name: 'user-storage',
    partialize: (state) => ({ user: state.user }) as any,
  }
);
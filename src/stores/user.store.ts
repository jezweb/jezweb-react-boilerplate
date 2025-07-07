import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../models/user.model';

interface UserStore {
  user: User | null;
  updateUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      updateUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
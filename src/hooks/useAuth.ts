import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/user.store';
import { authService } from '../services/auth.service';
import { User } from '../models/user.model';

export const useAuth = () => {
  const { user, updateUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          updateUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [updateUser]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
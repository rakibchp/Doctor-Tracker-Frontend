'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest, apiSend } from '@/lib/api';
import type { AuthUser } from '@/lib/types';

const ME_KEY = ['auth', 'me'] as const;

interface AuthContextValue {
  user: AuthUser | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await apiRequest<{ user: AuthUser }>('/auth/me');
  return response.data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ME_KEY,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiSend<{ user: AuthUser }>('/auth/login', 'POST', {
        email,
        password,
      });
      queryClient.setQueryData(ME_KEY, response.data.user);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await apiSend('/auth/logout', 'POST');
    queryClient.setQueryData(ME_KEY, null);
    queryClient.clear();
  }, [queryClient]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ME_KEY });
  }, [queryClient]);

  const user = isError ? undefined : data;

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading: isPending || (isFetching && !user), login, logout, refresh }),
    [user, isPending, isFetching, login, logout, refresh],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

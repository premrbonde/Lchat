import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiService from '@/services/apiService';
import { useRouter, useSegments } from 'expo-router';

interface AuthUser {
  userId: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, nickname: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await SecureStore.getItemAsync('authToken');
      const storedUser = await SecureStore.getItemAsync('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    };
    loadAuthData();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (token && inAuthGroup) {
      router.replace('/(tabs)/chats');
    } else if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [token, segments, router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      const { token, userId, username } = response.data;
      setToken(token);
      const userData = { userId, username };
      setUser(userData);
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (username: string, nickname: string, email: string, password: string) => {
    try {
      const response = await apiService.post('/auth/register', { username, nickname, email, password });
      const { token, userId } = response.data;
      setToken(token);
      const userData = { userId, username };
      setUser(userData);
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      return true;
    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

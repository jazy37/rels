'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  email: string;
  isSubscribe?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get('token');
    const savedUser = Cookies.get('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.jwt);
        setUser(data.user);
        
        // Ustawienie cookies z bezpiecznymi opcjami
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
          expires: 7, // 7 dni
          secure: isProduction, // tylko HTTPS w produkcji
          sameSite: 'strict' as const // ochrona CSRF
        };
        
        Cookies.set('token', data.jwt, cookieOptions);
        Cookies.set('user', JSON.stringify(data.user), cookieOptions);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.jwt);
        setUser(data.user);
        
        // Ustawienie cookies z bezpiecznymi opcjami
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
          expires: 7,
          secure: isProduction,
          sameSite: 'strict' as const
        };
        
        Cookies.set('token', data.jwt, cookieOptions);
        Cookies.set('user', JSON.stringify(data.user), cookieOptions);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('token');
    Cookies.remove('user');
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:1337/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Update cookies
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
          expires: 7,
          secure: isProduction,
          sameSite: 'strict' as const
        };
        
        Cookies.set('user', JSON.stringify(userData), cookieOptions);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
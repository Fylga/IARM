import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, loginMock, logoutMock} from '../api/auth';
import { getCurrentUser, getCurrentUserMock } from '../api/users';
import { User } from '../types/user';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          setToken(storedToken);
          const userData = await getCurrentUser(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginMock(email, password);
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      
      const userData = await getCurrentUserMock(data.access_token);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await logoutMock();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  // const login = async (email: string, password: string) => {
  //   setLoading(true);
  //   try {
  //     const data = await apiLogin(email, password);
  //     setToken(data.access_token);
  //     localStorage.setItem('token', data.access_token);
      
  //     // Récupérer les informations complètes de l'utilisateur
  //     const userData = await getCurrentUser(data.access_token);
  //     setUser(userData);
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const logout = async () => {
  //   setLoading(true);
  //   try {
  //     if (token) {
  //       await apiLogout(token);
  //     }
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   } finally {
  //     setUser(null);
  //     setToken(null);
  //     localStorage.removeItem('token');
  //     setLoading(false);
  //   }
  // };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user, 
        isAdmin: user?.role === 'admin',
        login, 
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

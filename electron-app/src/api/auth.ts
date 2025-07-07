import axios from 'axios';
import { TokenResponse } from '../types/user';
import { API_URL } from './config';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async (token: string) => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Simulation sans API
export const loginMock = async (email: string, password: string): Promise<TokenResponse> => {
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Vérifier les identifiants
  const validUsers = [
    { email: 'admin@iarm.com', password: 'Admin123!', role: 'admin' },
    { email: 'operator@iarm.com', password: 'Operator123!', role: 'user' }
  ];
  
  const user = validUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    return {
      access_token: `mock-token-${Date.now()}-${user.role}`,
      token_type: 'bearer'
    };
  } else {
    // Simuler une erreur d'API
    throw {
      response: {
        data: {
          detail: 'Invalid credentials'
        },
        status: 400
      }
    };
  }
};

export const logoutMock = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { message: 'Déconnexion réussie' };
};

import axios from 'axios';

import { API_URL } from './config';

export const getCurrentUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

export const getAllUsers = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get all users:', error);
    throw error;
  }
};

export const getActiveUsers = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get active users:', error);
    throw error;
  }
};

export const deleteUser = async (token: string, userId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};

export const promoteToAdmin = async (token: string, userId: number) => {
  try {
    const response = await axios.patch(`${API_URL}/users_to_admin/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to promote user ${userId} to admin:`, error);
    throw error;
  }
};

export const demoteToUser = async (token: string, userId: number) => {
  try {
    const response = await axios.patch(`${API_URL}/admin_to_users/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to demote admin ${userId} to user:`, error);
    throw error;
  }
};


// Simulation de récupération d'informations utilisateur
export const getCurrentUserMock = async (token: string) => {
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Extraire le rôle du token simulé
  const isAdmin = token.includes('-admin');
  
  if (token) {
    return {
      id: 1,
      name: isAdmin ? 'Administrateur IARM' : 'Opérateur IARM',
      email: isAdmin ? 'admin@iarm.com' : 'operator@iarm.com',
      is_active: true,
      role: isAdmin ? 'admin' : 'user',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };
  } else {
    throw {
      response: {
        data: {
          detail: 'Invalid token'
        },
        status: 401
      }
    };
  }
};

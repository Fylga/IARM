import axios from 'axios';
import { EmergencyCall } from '../types/emergency';

import { API_URL } from './config';

// Cette fonction est un exemple - vous devrez l'adapter à votre API réelle
export const getEmergencyCalls = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/emergency-calls`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get emergency calls:', error);
    throw error;
  }
};

export const getEmergencyCall = async (token: string, callId: string) => {
  try {
    const response = await axios.get(`${API_URL}/emergency-calls/${callId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to get emergency call ${callId}:`, error);
    throw error;
  }
};

export const answerCall = async (token: string, callId: string) => {
  try {
    const response = await axios.post(`${API_URL}/emergency-calls/${callId}/answer`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to answer call ${callId}:`, error);
    throw error;
  }
};

// Simulation sans api
export const getEmergencyCallsMock = (): EmergencyCall[] => {
  return [
    {
      id: '1382331',
      intensity: 90,
      startTime: '19:38:23',
      timestamp: Date.now() - 143000,
      severity: 'P0',
      type: 'Accident Motorisé',
      description: 'Patient grièvement blessé suite à un accident de moto, il est inconscient mais respire encore.'
    },
    {
      id: '1382327',
      intensity: 75,
      startTime: '19:37:13',
      timestamp: Date.now() - 237000,
      severity: 'P1',
      type: 'Douleur',
      description: 'Patient quinquagénaire qui souffre d\'une grosse douleur dans le torax.'
    }
  ];
};

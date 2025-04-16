import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getEmergencyCallsMock } from '../api/emergencyCalls';
import { EmergencyCall } from '../types/emergency';

type EmergencyContextType = {
  calls: EmergencyCall[];
  loading: boolean;
  error: string | null;
  answerCall: (id: string) => Promise<void>;
  refreshCalls: () => Promise<void>;
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calls, setCalls] = useState<EmergencyCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCalls = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dans un environnement réel, utilisez l'API
      // const data = await getEmergencyCalls(token!);
      
      // Pour le moment, utilisons les données simulées
      const data = getEmergencyCallsMock();
      setCalls(data);
    } catch (err) {
      console.error('Failed to fetch emergency calls:', err);
      setError('Impossible de récupérer les appels d\'urgence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCalls();
      
      // Simulation de nouveaux appels toutes les 30 secondes
      const interval = setInterval(() => {
        // Ajout d'un nouvel appel simulé
        const newCall: EmergencyCall = {
          id: `${1382330 + Math.floor(Math.random() * 1000)}`,
          intensity: Math.floor(Math.random() * 100),
          startTime: new Date().toLocaleTimeString(),
          timestamp: Date.now(),
          severity: ['P0', 'P1', 'P2', 'P3'][Math.floor(Math.random() * 4)] as any,
          type: ['Accident', 'Chute', 'Malaise', 'Douleur'][Math.floor(Math.random() * 4)],
          description: 'Nouvel appel d\'urgence simulé pour le développement'
        };
        setCalls(prev => [newCall, ...prev]);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [token]);

  const answerCall = async (id: string) => {
    try {
      // Dans un environnement réel, utilisez l'API
      // await answerCall(token!, id);
      
      // Pour le moment, supprimons simplement l'appel de la liste
      setCalls(prev => prev.filter(call => call.id !== id));
    } catch (err) {
      console.error(`Failed to answer call ${id}:`, err);
      setError(`Impossible de répondre à l'appel ${id}`);
    }
  };

  const refreshCalls = async () => {
    await fetchCalls();
  };

  return (
    <EmergencyContext.Provider 
      value={{ 
        calls,
        loading,
        error,
        answerCall,
        refreshCalls
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

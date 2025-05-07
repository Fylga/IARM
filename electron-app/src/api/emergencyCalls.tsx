import axios from 'axios';
import { EmergencyCall } from '../types/emergency';

import { API_URL } from './config';

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

export const getEmergencyCallsMock = (): EmergencyCall[] => {
  return [
    {
      id: '1382326',
      nom: "non précisé",
      âge: "6 ans",
      sexe: "masculin",
      description: "Fièvre depuis ce matin à 38,5°C, fatigue mais enfant encore actif.",
      localisation: "non précisée",
      heure_appel: "2025-04-22 15:10:43",
      urgence: "P3",
      niveau_soins: "R4",
      bilan: "B0",
      transcription: "Bonjour, mon fils de 6 ans a la fièvre depuis ce matin, il est fatigué mais joue encore un peu, il a environ 38,5 de fièvre, est ce que je dois m'inquiéter ou est ce que je dois attendre demain pour voir un médecin ?",
      intensity: 80,
      timestamp: Date.now() - 123000
    },
    {
      id: '1382331',
      nom: 'non précisé',
      âge: '35 ans',
      sexe: 'masculin',
      description: 'Patient inconscient suite à un accident de moto, respiration présente mais faible.',
      localisation: '45 rue de la Paix, Paris',
      heure_appel: new Date().toISOString(),
      urgence: 'P0',
      niveau_soins: 'R1',
      bilan: 'B1',
      transcription: 'Oh mon dieu! Il y a eu un accident de moto! Le conducteur ne bouge plus du tout! Il y a du sang partout! Il respire encore mais très faiblement! VITE! Il faut venir vite!',
      intensity: 90,
      timestamp: Date.now() - 143000
    },
    {
      id: '1382327',
      nom: 'Jean Dupont',
      âge: '52 ans',
      sexe: 'masculin',
      description: 'Douleur thoracique intense depuis 20 minutes, antécédents cardiaques.',
      localisation: '12 avenue des Champs-Élysées, Paris',
      heure_appel: new Date().toISOString(),
      urgence: 'P1',
      niveau_soins: 'R2',
      bilan: 'B1',
      transcription: 'Je m\'appelle Jean Dupont, j\'ai 52 ans. J\'ai une douleur très forte dans la poitrine depuis environ 20 minutes. J\'ai des antécédents cardiaques, j\'ai déjà fait un infarctus il y a 3 ans.',
      intensity: 75,
      timestamp: Date.now() - 237000
    },
    {
      id: '1382328',
      nom: 'Lucas Martin',
      âge: '4 ans',
      sexe: 'masculin',
      description: 'Enfant ayant ingéré du produit vaisselle, toux importante.',
      localisation: '8 rue des Lilas, Lyon',
      heure_appel: new Date().toISOString(),
      urgence: 'P0',
      niveau_soins: 'R1',
      bilan: 'B1',
      transcription: 'Mon fils a bu du produit vaisselle! Il tousse beaucoup! Il a 4 ans! S\'il vous plaît, venez vite! Il s\'appelle Lucas! Il a bu environ une gorgée avant que je puisse l\'arrêter!',
      intensity: 85,
      timestamp: Date.now() - 345000
    },
    {
      id: '1382329',
      nom: 'Marie Dubois',
      âge: '78 ans',
      sexe: 'féminin',
      description: 'Chute dans la salle de bain, douleur à la hanche, impossible de se relever.',
      localisation: '3 rue des Roses, Marseille',
      heure_appel: new Date().toISOString(),
      urgence: 'P2',
      niveau_soins: 'R3',
      bilan: 'B0',
      transcription: 'Madame Dubois est tombée dans sa baignoire. Elle ne peut pas se relever. Elle a mal à la hanche. Elle est consciente mais très douloureuse. Elle a 78 ans et vit seule.',
      intensity: 65,
      timestamp: Date.now() - 420000
    },
    {
      id: '1382330',
      nom: 'non précisé',
      âge: 'non précisé',
      sexe: 'non précisé',
      description: 'Collision frontale entre deux véhicules, plusieurs victimes, début d\'incendie.',
      localisation: 'A6, sortie 32, direction Paris',
      heure_appel: new Date().toISOString(),
      urgence: 'P0',
      niveau_soins: 'R1',
      bilan: 'B2',
      transcription: 'Il y a eu un terrible accident! Deux voitures se sont percutées de plein fouet! Il y a des gens coincés! Il y a du feu qui commence à prendre! VITE! Il y a au moins 4 personnes dans les voitures!',
      intensity: 95,
      timestamp: Date.now() - 510000
    },
  ];
};

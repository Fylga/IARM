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
      id: '1382331',
      intensity: 90,
      startTime: '19:38:23',
      timestamp: Date.now() - 143000,
      severity: 'P0',
      type: 'Accident Motorisé',
      description: 'Patient grièvement blessé suite à un accident de moto, il est inconscient mais respire encore. Localisation: 45 rue de la Paix, Paris. Victime: Homme, environ 35 ans, casque endommagé. Témoin: "Je l\'ai vu faire un tonneau, il ne bouge plus du tout!"',
      patientInfo: {
        name: 'Inconnu',
        age: 35,
        gender: 'M',
        location: '45 rue de la Paix, Paris',
        conversation: 'Témoin: "Oh mon dieu! Il ne bouge plus! Il y a du sang partout! VITE! Il faut venir vite!"'
      }
    },
    {
      id: '1382327',
      intensity: 75,
      startTime: '19:37:13',
      timestamp: Date.now() - 237000,
      severity: 'P1',
      type: 'Douleur Thoracique',
      description: 'Patient quinquagénaire qui souffre d\'une grosse douleur dans le torax. Localisation: 12 avenue des Champs-Élysées, Paris. Patient calme et lucide.',
      patientInfo: {
        name: 'Jean Dupont',
        age: 52,
        gender: 'M',
        location: '12 avenue des Champs-Élysées, Paris',
        conversation: 'Patient: "Je m\'appelle Jean Dupont, j\'ai 52 ans. J\'ai une douleur très forte dans la poitrine depuis environ 20 minutes. J\'ai des antécédents cardiaques."'
      }
    },
    {
      id: '1382328',
      intensity: 85,
      startTime: '19:35:45',
      timestamp: Date.now() - 345000,
      severity: 'P0',
      type: 'Accident Domestique',
      description: 'Enfant de 4 ans ayant ingéré des produits ménagers. Localisation: 8 rue des Lilas, Lyon. Parents en panique.',
      patientInfo: {
        name: 'Lucas Martin',
        age: 4,
        gender: 'M',
        location: '8 rue des Lilas, Lyon',
        conversation: 'Mère: "Mon fils a bu du produit vaisselle! Il tousse beaucoup! Il a 4 ans! S\'il vous plaît, venez vite! Il s\'appelle Lucas!"'
      }
    },
    {
      id: '1382329',
      intensity: 65,
      startTime: '19:34:20',
      timestamp: Date.now() - 420000,
      severity: 'P2',
      type: 'Chute Personne Âgée',
      description: 'Dame de 78 ans ayant fait une chute dans sa salle de bain. Localisation: 3 rue des Roses, Marseille.',
      patientInfo: {
        name: 'Marie Dubois',
        age: 78,
        gender: 'F',
        location: '3 rue des Roses, Marseille',
        conversation: 'Voisin: "Madame Dubois est tombée dans sa baignoire. Elle ne peut pas se relever. Elle a mal à la hanche. Elle est consciente mais très douloureuse."'
      }
    },
    {
      id: '1382330',
      intensity: 95,
      startTime: '19:33:10',
      timestamp: Date.now() - 510000,
      severity: 'P0',
      type: 'Accident de la Route',
      description: 'Collision frontale entre deux véhicules. Localisation: A6, sortie 32, direction Paris. Plusieurs victimes.',
      patientInfo: {
        name: 'Multiple',
        age: null,
        gender: null,
        location: 'A6, sortie 32, direction Paris',
        conversation: 'Témoin: "Il y a eu un terrible accident! Deux voitures se sont percutées de plein fouet! Il y a des gens coincés! Il y a du feu! VITE!"'
      }
    },
    {
      id: '1382332',
      intensity: 70,
      startTime: '19:32:00',
      timestamp: Date.now() - 600000,
      severity: 'P1',
      type: 'Crise d\'Asthme',
      description: 'Adolescente en crise d\'asthme sévère. Localisation: 15 rue du Commerce, Bordeaux.',
      patientInfo: {
        name: 'Sarah Lefebvre',
        age: 16,
        gender: 'F',
        location: '15 rue du Commerce, Bordeaux',
        conversation: 'Mère: "Ma fille Sarah fait une crise d\'asthme très forte. Son inhalateur ne fait plus d\'effet. Elle a 16 ans et est asthmatique depuis l\'enfance."'
      }
    },
    {
      id: '1382333',
      intensity: 60,
      startTime: '19:30:45',
      timestamp: Date.now() - 675000,
      severity: 'P2',
      type: 'Intoxication Alimentaire',
      description: 'Groupe de personnes présentant des symptômes d\'intoxication alimentaire. Localisation: Restaurant "Le Petit Bistrot", 22 rue de la République, Lille.',
      patientInfo: {
        name: 'Groupe',
        age: null,
        gender: null,
        location: 'Restaurant "Le Petit Bistrot", 22 rue de la République, Lille',
        conversation: 'Serveur: "Plusieurs clients se plaignent de nausées et vomissements après le repas. Ils ont tous mangé la même chose. Certains ont de la fièvre."'
      }
    },
    {
      id: '1382334',
      intensity: 80,
      startTime: '19:29:30',
      timestamp: Date.now() - 750000,
      severity: 'P1',
      type: 'Accident de Travail',
      description: 'Ouvrier ayant reçu un choc électrique sur un chantier. Localisation: Zone industrielle Nord, 45 avenue des Industries, Nantes.',
      patientInfo: {
        name: 'Thomas Moreau',
        age: 29,
        gender: 'M',
        location: 'Zone industrielle Nord, 45 avenue des Industries, Nantes',
        conversation: 'Collègue: "Thomas a pris un coup de jus en travaillant sur un transformateur. Il est conscient mais brûlé aux mains. Il a 29 ans et travaille comme électricien."'
      }
    }
  ];
};

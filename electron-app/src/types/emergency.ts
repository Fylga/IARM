export type Severity = 'P0' | 'P1' | 'P2' | 'P3';
export type CareLevel = 'R1' | 'R2' | 'R3' | 'R4';
export type Assessment = 'B0' | 'B1' | 'B2';

export interface EmergencyCall {
  id: string;
  nom: string;
  âge: string;
  sexe: string;
  description: string;
  localisation: string;
  heure_appel: string;
  urgence: Severity;
  niveau_soins: CareLevel;
  bilan: Assessment;
  transcription: string;
  intensity: number;
  timestamp: number;
}

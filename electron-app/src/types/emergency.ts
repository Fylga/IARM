export type Severity = 'P0' | 'P1' | 'P2' | 'P3';

interface PatientInfo {
  name: string | null;
  age: number | null;
  gender: 'M' | 'F' | null;
  location: string;
  conversation: string;
}

export interface EmergencyCall {
  id: string;
  intensity: number;
  startTime: string;
  timestamp: number;
  severity: Severity;
  type: string;
  description: string;
  patientInfo: PatientInfo;
}

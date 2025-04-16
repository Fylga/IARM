export type Severity = 'P0' | 'P1' | 'P2' | 'P3';

export interface EmergencyCall {
  id: string;
  intensity: number;
  startTime: string;
  timestamp: number;
  severity: Severity;
  type: string;
  description: string;
}

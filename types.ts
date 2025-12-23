
export enum IncidentStatus {
  REPORTED = 'Reported',
  AMBULANCE_DISPATCHED = 'Ambulance Dispatched',
  ARRIVED_ON_SCENE = 'Arrived on Scene',
  EN_ROUTE_TO_HOSPITAL = 'En Route to Hospital',
  HOSPITAL_ADMITTED = 'Admitted',
  RESOLVED = 'Resolved'
}

export enum UserRole {
  CITIZEN = 'Citizen',
  HOSPITAL = 'Hospital Staff',
  POLICE = 'Police Officer',
  AMBULANCE = 'Ambulance Driver',
  ADMIN = 'Administrator'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
}

export interface Incident {
  id: string;
  timestamp: string;
  reporter: string;
  status: IncidentStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  imageUrl?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedAmbulanceId?: string;
  targetHospitalId?: string;
}

export interface SmartTriageResult {
  severity: string;
  recommendedActions: string[];
  summary: string;
}

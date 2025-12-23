
import React from 'react';
import { Incident, IncidentStatus } from './types';
import { 
  AlertCircle, 
  Activity, 
  MapPin, 
  BarChart3, 
  User, 
  FileText, 
  LayoutDashboard 
} from 'lucide-react';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    reporter: 'Rohan Sharma',
    status: IncidentStatus.AMBULANCE_DISPATCHED,
    location: { lat: 21.1938, lng: 81.3509, address: 'GE Road, Bhilai' },
    description: 'Two-wheeler collision at intersection. Patient has head injury.',
    severity: 'High',
    assignedAmbulanceId: 'AMB-77',
    targetHospitalId: 'RCET-Health'
  },
  {
    id: 'INC-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reporter: 'Priya Verma',
    status: IncidentStatus.EN_ROUTE_TO_HOSPITAL,
    location: { lat: 21.2121, lng: 81.3732, address: 'Supela Market, Bhilai' },
    description: 'Pedestrian hit by car. Possible leg fracture.',
    severity: 'Medium',
    assignedAmbulanceId: 'AMB-12',
    targetHospitalId: 'Apollo-Bhilai'
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'reports', label: 'Emergency', icon: <AlertCircle className="w-5 h-5" /> },
  { id: 'documents', label: 'Doc Hub', icon: <FileText className="w-5 h-5" /> },
  { id: 'hospitals', label: 'Hospitals', icon: <Activity className="w-5 h-5" /> },
  { id: 'map', label: 'Map View', icon: <MapPin className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> }
];

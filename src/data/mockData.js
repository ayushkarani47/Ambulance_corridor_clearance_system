import { AMBULANCE_STATUS } from '../config/constants';

// Simulated customer location — Connaught Place, New Delhi
export const CUSTOMER_LOCATION = {
  lat: 28.6315,
  lng: 77.2167,
  address: 'Connaught Place, New Delhi',
};

// Simulated hospital — Safdarjung Hospital
export const HOSPITAL_LOCATION = {
  lat: 28.5672,
  lng: 77.2070,
  name: 'Safdarjung Hospital',
  address: 'Ansari Nagar, New Delhi',
  phone: '+91-11-26165060',
};

// RTO officers positioned along a typical route between hospital and customer
export const RTO_OFFICERS = [
  {
    id: 'rto_001',
    name: 'Inspector Sharma',
    badge: 'DL-RTO-1042',
    lat: 28.5850,
    lng: 77.2100,
    zone: 'AIIMS Junction',
    onDuty: true,
  },
  {
    id: 'rto_002',
    name: 'Inspector Verma',
    badge: 'DL-RTO-2187',
    lat: 28.6050,
    lng: 77.2150,
    zone: 'Mandi House',
    onDuty: true,
  },
  {
    id: 'rto_003',
    name: 'Inspector Singh',
    badge: 'DL-RTO-3305',
    lat: 28.6200,
    lng: 77.2180,
    zone: 'Barakhamba Road',
    onDuty: true,
  },
];

// Fleet of ambulances at the hospital
export const AMBULANCES = [
  {
    id: 'amb_001',
    vehicleNumber: 'DL-01-AB-1234',
    type: 'ALS',
    typeLabel: 'Advanced Life Support',
    driver: 'Rajesh Kumar',
    driverPhone: '+91-98765-43210',
    status: AMBULANCE_STATUS.AVAILABLE,
  },
  {
    id: 'amb_002',
    vehicleNumber: 'DL-01-CD-5678',
    type: 'BLS',
    typeLabel: 'Basic Life Support',
    driver: 'Amit Patel',
    driverPhone: '+91-98765-43211',
    status: AMBULANCE_STATUS.AVAILABLE,
  },
  {
    id: 'amb_003',
    vehicleNumber: 'DL-01-EF-9012',
    type: 'BLS',
    typeLabel: 'Basic Life Support',
    driver: 'Suresh Yadav',
    driverPhone: '+91-98765-43212',
    status: AMBULANCE_STATUS.EN_ROUTE,
  },
];

// Generate a simple emergency object
export function createMockEmergency(type, customerLocation) {
  return {
    id: 'em_' + Date.now(),
    type,
    patientCount: 1,
    customerLocation,
    customerAddress: customerLocation.address || 'Connaught Place, New Delhi',
    hospitalLocation: HOSPITAL_LOCATION,
    createdAt: new Date().toISOString(),
    notes: '',
  };
}

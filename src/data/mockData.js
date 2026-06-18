import { AMBULANCE_STATUS } from '../config/constants';

// Customer location — Matunga, Mumbai
export const CUSTOMER_LOCATION = {
  lat: 19.0278,
  lng: 72.8558,
  address: 'Matunga, Mumbai 400019',
};

// List of real hospitals near Matunga, Mumbai
export const HOSPITALS = [
  {
    id: 'hosp_001',
    name: 'KEM Hospital',
    address: 'Acharya Donde Marg, Parel, Mumbai 400012',
    phone: '+91-22-2410-7000',
    lat: 19.0003,
    lng: 72.8420,
    specialties: ['Trauma', 'Cardiac', 'General Surgery'],
    beds: 1800,
  },
  {
    id: 'hosp_002',
    name: 'Sion Hospital',
    address: 'Dr. Babasaheb Ambedkar Rd, Sion, Mumbai 400022',
    phone: '+91-22-2407-5676',
    lat: 19.0406,
    lng: 72.8620,
    specialties: ['Emergency', 'Ortho', 'Burns'],
    beds: 640,
  },
  {
    id: 'hosp_003',
    name: 'Hinduja Hospital',
    address: 'SVS Road, Mahim, Mumbai 400016',
    phone: '+91-22-2445-2222',
    lat: 19.0362,
    lng: 72.8397,
    specialties: ['Cardiac', 'Neuro', 'Oncology'],
    beds: 350,
  },
  {
    id: 'hosp_004',
    name: 'Wockhardt Hospital',
    address: '1877, Dr. Anand Rao Nair Marg, Mumbai Central 400011',
    phone: '+91-22-6178-4444',
    lat: 18.9700,
    lng: 72.8213,
    specialties: ['Cardiac', 'Neuro', 'Ortho'],
    beds: 225,
  },
  {
    id: 'hosp_005',
    name: 'Masina Hospital',
    address: 'Sant Savta Marg, Byculla, Mumbai 400027',
    phone: '+91-22-2377-1141',
    lat: 18.9813,
    lng: 72.8377,
    specialties: ['General Surgery', 'ICU', 'Paediatrics'],
    beds: 200,
  },
  {
    id: 'hosp_006',
    name: 'Global Hospital',
    address: '35, Dr. E. Borges Rd, Parel, Mumbai 400012',
    phone: '+91-22-6767-6767',
    lat: 19.0043,
    lng: 72.8435,
    specialties: ['Multi-Organ Transplant', 'Cardiac', 'Renal'],
    beds: 300,
  },
];

// RTO officers positioned along real Mumbai intersections
export const RTO_OFFICERS = [
  {
    id: 'rto_001',
    name: 'Inspector Patil',
    badge: 'MH-RTO-1042',
    lat: 19.0280,
    lng: 72.8470,
    zone: "King's Circle",
    onDuty: true,
  },
  {
    id: 'rto_002',
    name: 'Inspector Deshmukh',
    badge: 'MH-RTO-2187',
    lat: 19.0190,
    lng: 72.8430,
    zone: 'Dadar TT Circle',
    onDuty: true,
  },
  {
    id: 'rto_003',
    name: 'Inspector Jadhav',
    badge: 'MH-RTO-3305',
    lat: 19.0405,
    lng: 72.8555,
    zone: 'Sion Circle',
    onDuty: true,
  },
  {
    id: 'rto_004',
    name: 'Inspector More',
    badge: 'MH-RTO-4410',
    lat: 19.0150,
    lng: 72.8520,
    zone: 'Wadala Junction',
    onDuty: true,
  },
];

// Fleet of ambulances with MH registration
export const AMBULANCES = [
  {
    id: 'amb_001',
    vehicleNumber: 'MH-04-AB-1234',
    type: 'ALS',
    typeLabel: 'Advanced Life Support',
    driver: 'Rajesh Pawar',
    driverPhone: '+91-98765-43210',
    status: AMBULANCE_STATUS.AVAILABLE,
  },
  {
    id: 'amb_002',
    vehicleNumber: 'MH-04-CD-5678',
    type: 'BLS',
    typeLabel: 'Basic Life Support',
    driver: 'Amit Shinde',
    driverPhone: '+91-98765-43211',
    status: AMBULANCE_STATUS.AVAILABLE,
  },
  {
    id: 'amb_003',
    vehicleNumber: 'MH-01-EF-9012',
    type: 'BLS',
    typeLabel: 'Basic Life Support',
    driver: 'Suresh Kamble',
    driverPhone: '+91-98765-43212',
    status: AMBULANCE_STATUS.EN_ROUTE,
  },
];

// Generate an emergency object with selected hospital
export function createMockEmergency(type, customerLocation, selectedHospital) {
  return {
    id: 'em_' + Date.now(),
    type,
    patientCount: 1,
    customerLocation,
    customerAddress: customerLocation.address || 'Matunga, Mumbai 400019',
    hospitalLocation: selectedHospital || HOSPITALS[0],
    hospitalName: selectedHospital ? selectedHospital.name : HOSPITALS[0].name,
    createdAt: new Date().toISOString(),
    notes: '',
  };
}

export const STATUS = {
  IDLE: 'IDLE',
  REQUESTING: 'REQUESTING',
  HOSPITAL_SELECT: 'HOSPITAL_SELECT',
  DISPATCHED: 'DISPATCHED',
  EN_ROUTE: 'EN_ROUTE',
  ARRIVED: 'ARRIVED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const CORRIDOR_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  CLEARED: 'CLEARED',
  OBSTRUCTION: 'OBSTRUCTION',
};

export const EMERGENCY_TYPES = [
  { id: 'accident', label: 'Accident', icon: '🚗', color: '#ff4444' },
  { id: 'cardiac', label: 'Cardiac', icon: '❤️', color: '#ff6b6b' },
  { id: 'breathing', label: 'Breathing', icon: '🫁', color: '#ffa500' },
  { id: 'burn', label: 'Burn', icon: '🔥', color: '#ff8c00' },
  { id: 'other', label: 'Other', icon: '🏥', color: '#8b5cf6' },
];

export const AMBULANCE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  DISPATCHED: 'DISPATCHED',
  EN_ROUTE: 'EN_ROUTE',
  AT_SCENE: 'AT_SCENE',
  RETURNING: 'RETURNING',
};

export const MAP_CONFIG = {
  defaultCenter: { lat: 19.0278, lng: 72.8558 }, // Matunga, Mumbai
  defaultZoom: 14,
  mapId: 'acms-dark-map',
  animationSpeedMs: 80, // ms between waypoint steps
};

export const COLORS = {
  primary: '#6366f1',
  emergency: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  corridorPending: 'rgba(156, 163, 175, 0.25)',
  corridorAcknowledged: 'rgba(245, 158, 11, 0.3)',
  corridorCleared: 'rgba(34, 197, 94, 0.25)',
  routeLine: '#3b82f6',
  ambulance: '#ef4444',
  customer: '#3b82f6',
  hospital: '#22c55e',
  rto: '#f59e0b',
};

export const STATUS_MESSAGES = {
  [STATUS.IDLE]: 'Ready — tap SOS to request an ambulance',
  [STATUS.REQUESTING]: 'Select emergency type...',
  [STATUS.HOSPITAL_SELECT]: 'Choose a hospital from the list...',
  [STATUS.DISPATCHED]: 'Ambulance dispatched! RTO notified.',
  [STATUS.EN_ROUTE]: 'Ambulance en route — corridor being cleared',
  [STATUS.ARRIVED]: 'Ambulance has arrived!',
  [STATUS.COMPLETED]: 'Emergency resolved. Stay safe! 💚',
};

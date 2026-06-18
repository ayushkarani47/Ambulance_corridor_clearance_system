import { create } from 'zustand';
import { STATUS, CORRIDOR_STATUS, MAP_CONFIG } from '../config/constants';
import { CUSTOMER_LOCATION, HOSPITALS, RTO_OFFICERS, AMBULANCES } from '../data/mockData';
import { fetchRoute } from '../services/routeService';
import { createEmergency } from '../services/emergencyService';
import { dispatchAmbulance, resetFleet } from '../services/ambulanceService';
import { sendCorridorAlert } from '../services/corridorService';

const useEmergencyStore = create((set, get) => ({
  // --- State ---
  status: STATUS.IDLE,
  emergency: null,
  selectedEmergencyType: null,

  // Locations
  customerLocation: CUSTOMER_LOCATION,
  hospitals: HOSPITALS,
  selectedHospital: null,
  rtoOfficers: RTO_OFFICERS,
  ambulances: AMBULANCES,

  // Dispatch
  dispatchedAmbulance: null,
  ambulancePosition: null,

  // Route
  routePath: [],
  routeDistance: '',
  routeDuration: '',
  routeDurationValue: 0,

  // Corridor
  corridorStatus: CORRIDOR_STATUS.NONE,
  corridorAlert: null,

  // Animation
  animationIndex: 0,
  animationRunning: false,
  animationFrameId: null,

  // ETA
  eta: '',

  // Notification badges
  notifications: { customer: 0, hospital: 0, rto: 0 },

  // --- Actions ---

  // Step 1: Customer presses SOS → show emergency type form
  submitSOS: async (emergencyType) => {
    set({
      status: STATUS.HOSPITAL_SELECT,
      selectedEmergencyType: emergencyType,
    });
  },

  // Step 2: Customer selects a hospital
  selectHospital: (hospital) => {
    set({ selectedHospital: hospital });
  },

  // Step 3: Customer confirms booking → auto dispatch
  confirmBooking: async () => {
    const { selectedEmergencyType, customerLocation, selectedHospital, ambulances } = get();
    if (!selectedHospital || !selectedEmergencyType) return;

    // Create emergency
    const emergency = await createEmergency(selectedEmergencyType, customerLocation, selectedHospital);
    set({ emergency, status: STATUS.REQUESTING });

    // Auto-select first available ambulance and dispatch
    const availableAmbulance = ambulances.find((a) => a.status === 'AVAILABLE');
    if (!availableAmbulance) return;

    const dispatched = await dispatchAmbulance(availableAmbulance.id, emergency.id);
    if (!dispatched) return;

    set({
      dispatchedAmbulance: dispatched,
      ambulancePosition: { lat: selectedHospital.lat, lng: selectedHospital.lng },
      status: STATUS.DISPATCHED,
      notifications: { ...get().notifications, rto: 1 },
      routePath: [], // will be set by MapContainer when it fetches the route
    });
  },

  // Called by MapContainer after fetching route from Directions API
  setRoute: (routeData) => {
    set({
      routePath: routeData.path,
      routeDistance: routeData.distance,
      routeDuration: routeData.duration,
      routeDurationValue: routeData.durationValue,
      eta: routeData.duration,
      corridorStatus: CORRIDOR_STATUS.PENDING,
    });

    // Send corridor alert to RTO officers
    const { rtoOfficers } = get();
    sendCorridorAlert(routeData.path, rtoOfficers).then((alert) => {
      set({ corridorAlert: alert });
    });
  },

  // RTO acknowledges
  acknowledgeCorridor: () => {
    set({
      corridorStatus: CORRIDOR_STATUS.ACKNOWLEDGED,
      notifications: { ...get().notifications, rto: 0 },
    });
  },

  // RTO clears corridor
  clearCorridorAction: () => {
    set({
      corridorStatus: CORRIDOR_STATUS.CLEARED,
      status: STATUS.EN_ROUTE,
    });

    // Start ambulance animation
    get().startAnimation();
  },

  // Ambulance animation along the route
  startAnimation: () => {
    const { routePath } = get();
    if (routePath.length === 0) return;

    set({ animationRunning: true, animationIndex: 0 });

    let index = 0;
    const animate = () => {
      if (index >= routePath.length) {
        // Ambulance arrived
        set({
          animationRunning: false,
          status: STATUS.ARRIVED,
          ambulancePosition: routePath[routePath.length - 1],
          eta: 'Arrived',
        });

        // Auto-complete after 2 seconds
        setTimeout(() => {
          set({ status: STATUS.COMPLETED });
        }, 2000);
        return;
      }

      const totalSteps = routePath.length;
      const remaining = totalSteps - index;
      const totalDuration = get().routeDurationValue || 600;
      const etaSeconds = Math.round((remaining / totalSteps) * totalDuration);
      const etaMin = Math.ceil(etaSeconds / 60);

      set({
        ambulancePosition: routePath[index],
        animationIndex: index,
        eta: etaMin <= 1 ? 'Less than 1 min' : `${etaMin} mins`,
      });

      index++;
      const frameId = setTimeout(animate, MAP_CONFIG.animationSpeedMs);
      set({ animationFrameId: frameId });
    };

    animate();
  },

  // Reset everything for a new demo
  resetDemo: () => {
    const { animationFrameId } = get();
    if (animationFrameId) clearTimeout(animationFrameId);
    resetFleet();

    set({
      status: STATUS.IDLE,
      emergency: null,
      selectedEmergencyType: null,
      selectedHospital: null,
      dispatchedAmbulance: null,
      ambulancePosition: null,
      routePath: [],
      routeDistance: '',
      routeDuration: '',
      routeDurationValue: 0,
      corridorStatus: CORRIDOR_STATUS.NONE,
      corridorAlert: null,
      animationIndex: 0,
      animationRunning: false,
      animationFrameId: null,
      eta: '',
      notifications: { customer: 0, hospital: 0, rto: 0 },
      ambulances: [...AMBULANCES],
    });
  },
}));

export default useEmergencyStore;

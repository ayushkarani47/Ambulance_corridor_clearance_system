import { create } from 'zustand';
import { STATUS, CORRIDOR_STATUS, MAP_CONFIG } from '../config/constants';
import { CUSTOMER_LOCATION, HOSPITAL_LOCATION, RTO_OFFICERS, AMBULANCES } from '../data/mockData';
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
  hospitalLocation: HOSPITAL_LOCATION,
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

  // Active role tab
  currentRole: 'customer',

  // Notification badges
  notifications: { customer: 0, hospital: 0, rto: 0 },

  // --- Actions ---
  setRole: (role) => set({ currentRole: role }),

  // Step 1: Customer submits SOS
  submitSOS: async (emergencyType) => {
    set({ status: STATUS.REQUESTING, selectedEmergencyType: emergencyType });

    const { customerLocation } = get();
    const emergency = await createEmergency(emergencyType, customerLocation);

    set({
      emergency,
      status: STATUS.REQUESTING,
      notifications: { ...get().notifications, hospital: 1 },
    });
  },

  // Step 2: Hospital dispatches an ambulance
  dispatchAmbulanceAction: async (ambulanceId) => {
    const { emergency, hospitalLocation, customerLocation } = get();
    if (!emergency) return;

    const dispatched = await dispatchAmbulance(ambulanceId, emergency.id);
    if (!dispatched) return;

    set({
      dispatchedAmbulance: dispatched,
      ambulancePosition: { ...hospitalLocation },
      status: STATUS.DISPATCHED,
      notifications: { ...get().notifications, hospital: 0, rto: 1 },
    });

    // Fetch real route from Google Directions API
    // We need the google maps instance - we'll get it from the component
    // For now, store that route needs to be fetched
    set({ routePath: [] }); // will be set by MapContainer when it fetches the route
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

  // Step 3: RTO acknowledges
  acknowledgeCorridor: () => {
    set({
      corridorStatus: CORRIDOR_STATUS.ACKNOWLEDGED,
      notifications: { ...get().notifications, rto: 0 },
    });
  },

  // Step 4: RTO clears corridor
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

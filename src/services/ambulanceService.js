/**
 * Ambulance Service — MOCK for now.
 * 
 * UPGRADE: Replace with real API calls:
 *   getFleet      →  GET  /api/ambulance?hospitalId=...
 *   dispatch      →  POST /api/ambulance/:id/dispatch
 *   updateLocation →  WebSocket emit (ambulance:location-update)
 */

import { AMBULANCES } from '../data/mockData';
import { AMBULANCE_STATUS } from '../config/constants';

let fleet = [...AMBULANCES];

export async function getFleet() {
  await delay(300);
  return [...fleet];
}

export async function dispatchAmbulance(ambulanceId, emergencyId) {
  await delay(400);
  fleet = fleet.map((a) =>
    a.id === ambulanceId
      ? { ...a, status: AMBULANCE_STATUS.DISPATCHED, emergencyId }
      : a
  );
  const dispatched = fleet.find((a) => a.id === ambulanceId);
  return dispatched || null;
}

export async function resetFleet() {
  fleet = [...AMBULANCES];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

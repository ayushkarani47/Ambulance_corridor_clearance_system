/**
 * Emergency Service — MOCK for now.
 * 
 * UPGRADE: Replace all functions with real API calls:
 *   createEmergency  →  POST /api/emergency
 *   getEmergency     →  GET  /api/emergency/:id
 *   updateStatus     →  PATCH /api/emergency/:id/status
 */

import { createMockEmergency } from '../data/mockData';

export async function createEmergency(type, customerLocation) {
  // Simulate network delay
  await delay(500);
  return createMockEmergency(type, customerLocation);
}

export async function getEmergency(id) {
  await delay(200);
  // In real app, fetch from database
  return null;
}

export async function updateEmergencyStatus(id, status) {
  await delay(200);
  return { id, status, updatedAt: new Date().toISOString() };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

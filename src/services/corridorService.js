/**
 * Corridor Service — MOCK for now.
 * 
 * UPGRADE: Replace with real API calls + Socket.io:
 *   sendAlert       →  Socket emit (corridor:alert) to RTO officers in zone
 *   acknowledge     →  PATCH /api/corridor/:id  { status: 'ACKNOWLEDGED' }
 *   clearCorridor   →  PATCH /api/corridor/:id  { status: 'CLEARED' }
 *   reportObstruction → PATCH /api/corridor/:id { status: 'OBSTRUCTION', notes }
 */

export async function sendCorridorAlert(route, officers) {
  await delay(300);
  return {
    id: 'cor_' + Date.now(),
    route,
    officers: officers.map((o) => o.id),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
}

export async function acknowledgeAlert(alertId) {
  await delay(200);
  return { id: alertId, status: 'ACKNOWLEDGED', acknowledgedAt: new Date().toISOString() };
}

export async function clearCorridor(alertId) {
  await delay(200);
  return { id: alertId, status: 'CLEARED', clearedAt: new Date().toISOString() };
}

export async function reportObstruction(alertId, notes) {
  await delay(200);
  return { id: alertId, status: 'OBSTRUCTION', notes, reportedAt: new Date().toISOString() };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

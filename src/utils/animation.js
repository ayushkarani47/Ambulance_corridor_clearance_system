/**
 * Animation utilities for smooth ambulance movement.
 * 
 * UPGRADE: Replace with real-time GPS WebSocket data.
 */

/**
 * Interpolate between two points for smoother animation.
 */
export function interpolate(start, end, fraction) {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction,
  };
}

/**
 * Calculate the bearing (heading) between two points in degrees.
 * Used to rotate the ambulance icon to face the direction of travel.
 */
export function calculateBearing(start, end) {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const dLng = endLng - startLng;
  const x = Math.sin(dLng) * Math.cos(endLat);
  const y =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Create a buffered polygon around a polyline path.
 * Used for the corridor overlay.
 */
export function createCorridorPolygon(path, bufferMeters = 80) {
  if (!path || path.length < 2) return [];

  const offset = bufferMeters / 111320; // rough degrees per meter at equator
  const leftSide = [];
  const rightSide = [];

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];

    // Perpendicular direction
    const dx = p2.lng - p1.lng;
    const dy = p2.lat - p1.lat;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) continue;

    const nx = -dy / len * offset;
    const ny = dx / len * offset;

    leftSide.push({ lat: p1.lat + nx, lng: p1.lng + ny });
    rightSide.push({ lat: p1.lat - nx, lng: p1.lng - ny });
  }

  // Add the last point
  const last = path[path.length - 1];
  const prev = path[path.length - 2];
  const dx = last.lng - prev.lng;
  const dy = last.lat - prev.lat;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len > 0) {
    const nx = -dy / len * offset;
    const ny = dx / len * offset;
    leftSide.push({ lat: last.lat + nx, lng: last.lng + ny });
    rightSide.push({ lat: last.lat - nx, lng: last.lng - ny });
  }

  // Combine: left side forward, right side reversed
  return [...leftSide, ...rightSide.reverse()];
}

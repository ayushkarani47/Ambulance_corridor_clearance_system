/**
 * Route Service — uses Google Maps Directions API
 * This is a REAL API call, not mocked.
 * 
 * UPGRADE: No changes needed. This already uses real Google APIs.
 */

/**
 * Fetch a driving route between two points using Google Directions API.
 * Returns the decoded polyline path and route metadata.
 * 
 * @param {google.maps.Map} map - The Google Maps instance (used for DirectionsService)
 * @param {{ lat: number, lng: number }} origin - Starting point (hospital)
 * @param {{ lat: number, lng: number }} destination - End point (customer)
 * @returns {Promise<{ path: Array<{lat: number, lng: number}>, distance: string, duration: string, durationValue: number }>}
 */
export async function fetchRoute(map, origin, destination) {
  // If Google Maps API is not loaded, return a fallback straight-line path
  if (!window.google || !window.google.maps) {
    console.warn('Google Maps not loaded, using fallback route');
    return getFallbackRoute(origin, destination);
  }

  const directionsService = new window.google.maps.DirectionsService();

  try {
    const result = await directionsService.route({
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    if (result.routes && result.routes.length > 0) {
      const route = result.routes[0];
      const leg = route.legs[0];

      // Decode the overview polyline into lat/lng points
      const path = route.overview_path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));

      return {
        path,
        distance: leg.distance.text,
        duration: leg.duration.text,
        durationValue: leg.duration.value, // in seconds
      };
    }
  } catch (error) {
    console.error('Directions API error:', error);
  }

  // Fallback if Directions API fails
  return getFallbackRoute(origin, destination);
}

/**
 * Generate a simple straight-line fallback route with interpolated points.
 */
function getFallbackRoute(origin, destination) {
  const steps = 30;
  const path = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push({
      lat: origin.lat + (destination.lat - origin.lat) * t,
      lng: origin.lng + (destination.lng - origin.lng) * t,
    });
  }

  const distKm = haversineDistance(origin, destination);
  const durationMin = Math.round(distKm / 40 * 60); // assume 40 km/h

  return {
    path,
    distance: `${distKm.toFixed(1)} km`,
    duration: `${durationMin} mins`,
    durationValue: durationMin * 60,
  };
}

/**
 * Haversine distance between two lat/lng points in km.
 */
function haversineDistance(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

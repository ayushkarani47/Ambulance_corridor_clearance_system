/**
 * Location Service — uses browser Geolocation + Google Geocoding API
 * 
 * UPGRADE: Add server-side geocoding cache, use real user positions.
 */

import { CUSTOMER_LOCATION } from '../data/mockData';

/**
 * Get the current user's location via browser Geolocation API.
 * Falls back to mock Delhi location if permission denied or unavailable.
 */
export async function getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using mock location');
      resolve(CUSTOMER_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Your Location',
        });
      },
      (error) => {
        console.warn('Geolocation error, using mock location:', error.message);
        resolve(CUSTOMER_LOCATION);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  });
}

/**
 * Reverse geocode a lat/lng to a human-readable address.
 * Uses Google Geocoding API via the Maps JS SDK.
 */
export async function reverseGeocode(lat, lng) {
  if (!window.google || !window.google.maps) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  try {
    const geocoder = new window.google.maps.Geocoder();
    const result = await geocoder.geocode({
      location: { lat, lng },
    });

    if (result.results && result.results.length > 0) {
      return result.results[0].formatted_address;
    }
  } catch (error) {
    console.warn('Geocoding error:', error);
  }

  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

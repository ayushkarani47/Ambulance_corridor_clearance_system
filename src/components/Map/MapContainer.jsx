import { useEffect, useRef, useCallback } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { MAP_CONFIG, STATUS, CORRIDOR_STATUS, COLORS } from '../../config/constants';
import useEmergencyStore from '../../store/useEmergencyStore';
import { fetchRoute } from '../../services/routeService';
import { createCorridorPolygon } from '../../utils/animation';
import CustomerMarker from './CustomerMarker';
import HospitalMarker from './HospitalMarker';
import OfficerMarkers from './OfficerMarkers';
import AmbulanceMarker from './AmbulanceMarker';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function MapInner() {
  const map = useMap();
  const routePolylineRef = useRef(null);
  const corridorPolygonRef = useRef(null);

  const status = useEmergencyStore((s) => s.status);
  const routePath = useEmergencyStore((s) => s.routePath);
  const corridorStatus = useEmergencyStore((s) => s.corridorStatus);
  const hospitalLocation = useEmergencyStore((s) => s.hospitalLocation);
  const customerLocation = useEmergencyStore((s) => s.customerLocation);
  const setRoute = useEmergencyStore((s) => s.setRoute);

  // Fetch route when ambulance is dispatched
  useEffect(() => {
    if (status === STATUS.DISPATCHED && map && routePath.length === 0) {
      fetchRoute(map, hospitalLocation, customerLocation).then((routeData) => {
        setRoute(routeData);
      });
    }
  }, [status, map, routePath.length, hospitalLocation, customerLocation, setRoute]);

  // Draw route polyline
  useEffect(() => {
    if (!map || routePath.length === 0) return;

    // Remove old polyline
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
    }

    routePolylineRef.current = new window.google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: COLORS.routeLine,
      strokeOpacity: 0.8,
      strokeWeight: 5,
      map: map,
    });

    // Fit bounds to show entire route
    const bounds = new window.google.maps.LatLngBounds();
    routePath.forEach((p) => bounds.extend(p));
    bounds.extend(customerLocation);
    bounds.extend(hospitalLocation);
    map.fitBounds(bounds, { padding: 80 });

    return () => {
      if (routePolylineRef.current) {
        routePolylineRef.current.setMap(null);
      }
    };
  }, [map, routePath, customerLocation, hospitalLocation]);

  // Draw corridor overlay
  useEffect(() => {
    if (!map || routePath.length < 2 || corridorStatus === CORRIDOR_STATUS.NONE) return;

    // Remove old polygon
    if (corridorPolygonRef.current) {
      corridorPolygonRef.current.setMap(null);
    }

    const corridorPath = createCorridorPolygon(routePath, 100);

    let fillColor = COLORS.corridorPending;
    if (corridorStatus === CORRIDOR_STATUS.ACKNOWLEDGED) fillColor = COLORS.corridorAcknowledged;
    if (corridorStatus === CORRIDOR_STATUS.CLEARED) fillColor = COLORS.corridorCleared;

    corridorPolygonRef.current = new window.google.maps.Polygon({
      paths: corridorPath,
      strokeColor: fillColor.replace(/[\d.]+\)$/, '0.6)'),
      strokeOpacity: 0.5,
      strokeWeight: 1,
      fillColor: fillColor,
      fillOpacity: 0.3,
      map: map,
    });

    return () => {
      if (corridorPolygonRef.current) {
        corridorPolygonRef.current.setMap(null);
      }
    };
  }, [map, routePath, corridorStatus]);

  // Cleanup on unmount / reset
  useEffect(() => {
    if (status === STATUS.IDLE) {
      if (routePolylineRef.current) {
        routePolylineRef.current.setMap(null);
        routePolylineRef.current = null;
      }
      if (corridorPolygonRef.current) {
        corridorPolygonRef.current.setMap(null);
        corridorPolygonRef.current = null;
      }
    }
  }, [status]);

  return (
    <>
      <CustomerMarker />
      <HospitalMarker />
      <OfficerMarkers />
      <AmbulanceMarker />
    </>
  );
}

export default function MapContainer() {
  const customerLocation = useEmergencyStore((s) => s.customerLocation);

  return (
    <div className="map-container">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={customerLocation}
          defaultZoom={MAP_CONFIG.defaultZoom}
          mapId={MAP_CONFIG.mapId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
          style={{ width: '100%', height: '100%' }}
          colorScheme="DARK"
        >
          <MapInner />
        </Map>
      </APIProvider>
    </div>
  );
}

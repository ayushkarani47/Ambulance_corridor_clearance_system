import { useEffect, useRef } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { MAP_CONFIG, STATUS, CORRIDOR_STATUS, COLORS } from '../../config/constants';
import useEmergencyStore from '../../store/useEmergencyStore';
import { fetchRoute } from '../../services/routeService';
import { createCorridorPolygon } from '../../utils/animation';
import CustomerMarker from './CustomerMarker';
import HospitalMarkers from './HospitalMarker';
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
  const selectedHospital = useEmergencyStore((s) => s.selectedHospital);
  const customerLocation = useEmergencyStore((s) => s.customerLocation);
  const setRoute = useEmergencyStore((s) => s.setRoute);

  // Fetch route when ambulance is dispatched
  useEffect(() => {
    if (status === STATUS.DISPATCHED && map && routePath.length === 0 && selectedHospital) {
      const hospitalCoords = { lat: selectedHospital.lat, lng: selectedHospital.lng };
      fetchRoute(map, hospitalCoords, customerLocation).then((routeData) => {
        setRoute(routeData);
      });
    }
  }, [status, map, routePath.length, selectedHospital, customerLocation, setRoute]);

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
    if (selectedHospital) {
      bounds.extend({ lat: selectedHospital.lat, lng: selectedHospital.lng });
    }
    map.fitBounds(bounds, { padding: 80 });

    return () => {
      if (routePolylineRef.current) {
        routePolylineRef.current.setMap(null);
      }
    };
  }, [map, routePath, customerLocation, selectedHospital]);

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
      <HospitalMarkers />
      <OfficerMarkers />
      <AmbulanceMarker />
    </>
  );
}

export default function MapContainer() {
  return (
    <div className="map-container">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={MAP_CONFIG.defaultCenter}
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

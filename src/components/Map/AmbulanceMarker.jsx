import { AdvancedMarker } from '@vis.gl/react-google-maps';
import useEmergencyStore from '../../store/useEmergencyStore';
import { STATUS } from '../../config/constants';

export default function AmbulanceMarker() {
  const ambulancePosition = useEmergencyStore((s) => s.ambulancePosition);
  const status = useEmergencyStore((s) => s.status);
  const animationRunning = useEmergencyStore((s) => s.animationRunning);

  // Only show when dispatched or later
  if (
    !ambulancePosition ||
    status === STATUS.IDLE ||
    status === STATUS.REQUESTING
  ) {
    return null;
  }

  return (
    <AdvancedMarker position={ambulancePosition} title="Ambulance">
      <div className={`ambulance-marker ${animationRunning ? 'moving' : ''}`}>
        <span className="ambulance-icon">🚑</span>
        {animationRunning && <div className="ambulance-glow" />}
      </div>
    </AdvancedMarker>
  );
}

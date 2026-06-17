import { AdvancedMarker } from '@vis.gl/react-google-maps';
import useEmergencyStore from '../../store/useEmergencyStore';

export default function HospitalMarker() {
  const hospitalLocation = useEmergencyStore((s) => s.hospitalLocation);

  return (
    <AdvancedMarker position={hospitalLocation} title={hospitalLocation.name}>
      <div className="hospital-marker">
        <span>🏥</span>
        <div className="marker-label">{hospitalLocation.name}</div>
      </div>
    </AdvancedMarker>
  );
}

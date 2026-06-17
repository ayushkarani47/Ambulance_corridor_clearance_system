import { AdvancedMarker } from '@vis.gl/react-google-maps';
import useEmergencyStore from '../../store/useEmergencyStore';
import { STATUS, CORRIDOR_STATUS } from '../../config/constants';

export default function OfficerMarkers() {
  const rtoOfficers = useEmergencyStore((s) => s.rtoOfficers);
  const status = useEmergencyStore((s) => s.status);
  const corridorStatus = useEmergencyStore((s) => s.corridorStatus);

  const isAlerted = status !== STATUS.IDLE && corridorStatus !== CORRIDOR_STATUS.NONE;

  return (
    <>
      {rtoOfficers.map((officer) => (
        <AdvancedMarker
          key={officer.id}
          position={{ lat: officer.lat, lng: officer.lng }}
          title={`${officer.name} — ${officer.zone}`}
        >
          <div className={`officer-marker ${isAlerted ? 'alerted' : ''}`}>
            <span>🚦</span>
            <div className="marker-label">{officer.zone}</div>
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
}

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import useEmergencyStore from '../../store/useEmergencyStore';

export default function HospitalMarkers() {
  const hospitals = useEmergencyStore((s) => s.hospitals);
  const selectedHospital = useEmergencyStore((s) => s.selectedHospital);

  return (
    <>
      {hospitals.map((hospital) => {
        const isSelected = selectedHospital && selectedHospital.id === hospital.id;
        return (
          <AdvancedMarker
            key={hospital.id}
            position={{ lat: hospital.lat, lng: hospital.lng }}
            title={hospital.name}
          >
            <div className={`hospital-marker ${isSelected ? 'selected' : ''}`}>
              <span>{isSelected ? '🏥' : '🏥'}</span>
              <div className="marker-label">{hospital.name}</div>
              {isSelected && <div className="hospital-marker-glow" />}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

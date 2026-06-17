import { useEffect, useRef } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import useEmergencyStore from '../../store/useEmergencyStore';
import { STATUS } from '../../config/constants';

export default function CustomerMarker() {
  const customerLocation = useEmergencyStore((s) => s.customerLocation);
  const status = useEmergencyStore((s) => s.status);
  const isActive = status !== STATUS.IDLE && status !== STATUS.COMPLETED;

  return (
    <AdvancedMarker position={customerLocation} title="Customer Location">
      <div className={`customer-marker ${isActive ? 'active' : ''}`}>
        <div className="customer-marker-inner">
          <span>📍</span>
        </div>
        {isActive && <div className="pulse-ring" />}
        {isActive && <div className="pulse-ring delay" />}
      </div>
    </AdvancedMarker>
  );
}

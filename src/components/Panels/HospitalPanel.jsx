import useEmergencyStore from '../../store/useEmergencyStore';
import { STATUS, AMBULANCE_STATUS } from '../../config/constants';
import { distanceBetween } from '../../utils/helpers';

export default function HospitalPanel() {
  const status = useEmergencyStore((s) => s.status);
  const emergency = useEmergencyStore((s) => s.emergency);
  const ambulances = useEmergencyStore((s) => s.ambulances);
  const hospitalLocation = useEmergencyStore((s) => s.hospitalLocation);
  const customerLocation = useEmergencyStore((s) => s.customerLocation);
  const dispatchedAmbulance = useEmergencyStore((s) => s.dispatchedAmbulance);
  const routeDistance = useEmergencyStore((s) => s.routeDistance);
  const routeDuration = useEmergencyStore((s) => s.routeDuration);
  const dispatchAmbulanceAction = useEmergencyStore((s) => s.dispatchAmbulanceAction);

  const distance = distanceBetween(hospitalLocation, customerLocation).toFixed(1);

  const handleDispatch = (ambulanceId) => {
    dispatchAmbulanceAction(ambulanceId);
  };

  return (
    <div className="panel hospital-panel">
      <div className="panel-header">
        <h2>🏥 Hospital</h2>
        <span className="panel-subtitle">{hospitalLocation.name}</span>
      </div>

      <div className="panel-body">
        {/* No active emergency */}
        {(status === STATUS.IDLE) && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Active Requests</h3>
            <p>Waiting for incoming emergency requests...</p>
          </div>
        )}

        {/* Incoming Request */}
        {status === STATUS.REQUESTING && emergency && (
          <div className="request-card incoming">
            <div className="request-header">
              <span className="urgency-badge">🔴 INCOMING</span>
              <span className="request-time">Just now</span>
            </div>
            <div className="request-body">
              <div className="request-type">
                <span className="request-type-icon">
                  {emergency.type === 'accident' ? '🚗' :
                   emergency.type === 'cardiac' ? '❤️' :
                   emergency.type === 'breathing' ? '🫁' :
                   emergency.type === 'burn' ? '🔥' : '🏥'}
                </span>
                <span className="request-type-label">
                  {emergency.type.charAt(0).toUpperCase() + emergency.type.slice(1)} Emergency
                </span>
              </div>
              <div className="info-row">
                <span>📍 Location</span>
                <span>{emergency.customerAddress}</span>
              </div>
              <div className="info-row">
                <span>📏 Distance</span>
                <span>{distance} km away</span>
              </div>
              <div className="info-row">
                <span>👥 Patients</span>
                <span>{emergency.patientCount}</span>
              </div>
            </div>

            <h4 className="fleet-title">Select Ambulance to Dispatch</h4>
            <div className="ambulance-fleet">
              {ambulances.map((amb) => {
                const isAvailable = amb.status === AMBULANCE_STATUS.AVAILABLE;
                return (
                  <div key={amb.id} className={`ambulance-card ${!isAvailable ? 'unavailable' : ''}`}>
                    <div className="ambulance-info">
                      <span className="ambulance-number">{amb.vehicleNumber}</span>
                      <span className={`ambulance-type type-${amb.type.toLowerCase()}`}>{amb.type}</span>
                    </div>
                    <div className="ambulance-driver">
                      <span>🧑✈️ {amb.driver}</span>
                    </div>
                    <button
                      className="dispatch-button"
                      onClick={() => handleDispatch(amb.id)}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? '🚀 Dispatch' : '⛔ Busy'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* After dispatch */}
        {(status === STATUS.DISPATCHED || status === STATUS.EN_ROUTE || status === STATUS.ARRIVED || status === STATUS.COMPLETED) && dispatchedAmbulance && (
          <div className="dispatch-status">
            <div className="dispatch-header">
              <span className={`status-indicator ${status === STATUS.COMPLETED ? 'completed' : 'active'}`} />
              <h3>{status === STATUS.COMPLETED ? 'Mission Complete' : 'Ambulance Active'}</h3>
            </div>

            <div className="info-card">
              <div className="info-row">
                <span>🚑 Vehicle</span>
                <span>{dispatchedAmbulance.vehicleNumber}</span>
              </div>
              <div className="info-row">
                <span>🧑✈️ Driver</span>
                <span>{dispatchedAmbulance.driver}</span>
              </div>
              <div className="info-row">
                <span>📏 Distance</span>
                <span>{routeDistance || `${distance} km`}</span>
              </div>
              <div className="info-row">
                <span>⏱️ Est. Time</span>
                <span>{routeDuration || 'Calculating...'}</span>
              </div>
              <div className="info-row">
                <span>📊 Status</span>
                <span className={`badge badge-${status.toLowerCase()}`}>{status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

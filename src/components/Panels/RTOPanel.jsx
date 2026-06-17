import useEmergencyStore from '../../store/useEmergencyStore';
import { STATUS, CORRIDOR_STATUS } from '../../config/constants';

export default function RTOPanel() {
  const status = useEmergencyStore((s) => s.status);
  const corridorStatus = useEmergencyStore((s) => s.corridorStatus);
  const rtoOfficers = useEmergencyStore((s) => s.rtoOfficers);
  const routeDistance = useEmergencyStore((s) => s.routeDistance);
  const eta = useEmergencyStore((s) => s.eta);
  const dispatchedAmbulance = useEmergencyStore((s) => s.dispatchedAmbulance);
  const acknowledgeCorridor = useEmergencyStore((s) => s.acknowledgeCorridor);
  const clearCorridorAction = useEmergencyStore((s) => s.clearCorridorAction);

  const isAlerted = corridorStatus !== CORRIDOR_STATUS.NONE && status !== STATUS.IDLE;

  return (
    <div className="panel rto-panel">
      <div className="panel-header">
        <h2>🚦 RTO Control</h2>
        <span className="panel-subtitle">Traffic Management</span>
      </div>

      <div className="panel-body">
        {/* Officer roster */}
        <div className="officer-roster">
          <h4>Officers on Duty</h4>
          {rtoOfficers.map((officer) => (
            <div key={officer.id} className={`officer-card ${isAlerted ? 'alerted' : ''}`}>
              <div className="officer-info">
                <span className="officer-name">{officer.name}</span>
                <span className="officer-badge">{officer.badge}</span>
              </div>
              <div className="officer-zone">
                <span>📍 {officer.zone}</span>
              </div>
              <div className={`duty-status ${officer.onDuty ? 'on' : 'off'}`}>
                {officer.onDuty ? '🟢 On Duty' : '🔴 Off Duty'}
              </div>
            </div>
          ))}
        </div>

        {/* No active alert */}
        {!isAlerted && (
          <div className="empty-state">
            <div className="empty-icon">📡</div>
            <h3>No Active Alerts</h3>
            <p>Monitoring for ambulance corridor requests...</p>
          </div>
        )}

        {/* Active corridor alert */}
        {isAlerted && (
          <div className="corridor-alert">
            <div className={`alert-card alert-${corridorStatus.toLowerCase()}`}>
              <div className="alert-header">
                <span className="alert-icon">🚨</span>
                <h3>Corridor Alert</h3>
                <span className={`corridor-badge corridor-${corridorStatus.toLowerCase()}`}>
                  {corridorStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="alert-body">
                {dispatchedAmbulance && (
                  <div className="info-row">
                    <span>🚑 Ambulance</span>
                    <span>{dispatchedAmbulance.vehicleNumber}</span>
                  </div>
                )}
                {routeDistance && (
                  <div className="info-row">
                    <span>📏 Route</span>
                    <span>{routeDistance}</span>
                  </div>
                )}
                {eta && (
                  <div className="info-row">
                    <span>⏱️ ETA</span>
                    <span>{eta}</span>
                  </div>
                )}
                <div className="info-row">
                  <span>👮 Officers Assigned</span>
                  <span>{rtoOfficers.length}</span>
                </div>
              </div>

              <div className="alert-actions">
                {corridorStatus === CORRIDOR_STATUS.PENDING && (
                  <button
                    className="action-button acknowledge"
                    onClick={acknowledgeCorridor}
                  >
                    ✋ Acknowledge Alert
                  </button>
                )}
                {corridorStatus === CORRIDOR_STATUS.ACKNOWLEDGED && (
                  <button
                    className="action-button clear"
                    onClick={clearCorridorAction}
                  >
                    ✅ Corridor Cleared
                  </button>
                )}
                {corridorStatus === CORRIDOR_STATUS.CLEARED && (
                  <div className="cleared-message">
                    <span>✅</span>
                    <p>Corridor is clear. Ambulance is en route.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

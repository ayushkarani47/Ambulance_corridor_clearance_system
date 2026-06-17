import useEmergencyStore from '../store/useEmergencyStore';
import { STATUS, STATUS_MESSAGES } from '../config/constants';

export default function StatusBar() {
  const status = useEmergencyStore((s) => s.status);
  const eta = useEmergencyStore((s) => s.eta);
  const routeDistance = useEmergencyStore((s) => s.routeDistance);
  const animationIndex = useEmergencyStore((s) => s.animationIndex);
  const routePath = useEmergencyStore((s) => s.routePath);

  const progress = routePath.length > 0
    ? Math.round((animationIndex / routePath.length) * 100)
    : 0;

  const statusClass = status.toLowerCase().replace('_', '-');

  return (
    <div className={`status-bar status-bar-${statusClass}`}>
      <div className="status-bar-content">
        <div className="status-bar-left">
          <span className={`status-dot ${status !== STATUS.IDLE ? 'active' : ''}`} />
          <span className="status-text">{STATUS_MESSAGES[status]}</span>
        </div>
        <div className="status-bar-right">
          {eta && status !== STATUS.IDLE && status !== STATUS.COMPLETED && (
            <span className="status-eta">⏱️ {eta}</span>
          )}
          {routeDistance && status !== STATUS.IDLE && (
            <span className="status-distance">📏 {routeDistance}</span>
          )}
        </div>
      </div>
      {status === STATUS.EN_ROUTE && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

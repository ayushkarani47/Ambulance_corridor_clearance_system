import useEmergencyStore from '../store/useEmergencyStore';

const ROLES = [
  { id: 'customer', label: 'Customer', icon: '👤' },
  { id: 'hospital', label: 'Hospital', icon: '🏥' },
  { id: 'rto', label: 'RTO', icon: '🚦' },
];

export default function RoleSwitcher() {
  const currentRole = useEmergencyStore((s) => s.currentRole);
  const setRole = useEmergencyStore((s) => s.setRole);
  const notifications = useEmergencyStore((s) => s.notifications);

  return (
    <div className="role-switcher">
      {ROLES.map((role) => (
        <button
          key={role.id}
          className={`role-tab ${currentRole === role.id ? 'active' : ''}`}
          onClick={() => setRole(role.id)}
        >
          <span className="role-icon">{role.icon}</span>
          <span className="role-label">{role.label}</span>
          {notifications[role.id] > 0 && (
            <span className="notification-badge">{notifications[role.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

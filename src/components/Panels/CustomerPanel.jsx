import { useState } from 'react';
import useEmergencyStore from '../../store/useEmergencyStore';
import { STATUS, EMERGENCY_TYPES, STATUS_MESSAGES } from '../../config/constants';
import { formatTime, distanceBetween } from '../../utils/helpers';

export default function CustomerPanel() {
  const status = useEmergencyStore((s) => s.status);
  const emergency = useEmergencyStore((s) => s.emergency);
  const dispatchedAmbulance = useEmergencyStore((s) => s.dispatchedAmbulance);
  const eta = useEmergencyStore((s) => s.eta);
  const routeDistance = useEmergencyStore((s) => s.routeDistance);
  const hospitals = useEmergencyStore((s) => s.hospitals);
  const selectedHospital = useEmergencyStore((s) => s.selectedHospital);
  const customerLocation = useEmergencyStore((s) => s.customerLocation);
  const submitSOS = useEmergencyStore((s) => s.submitSOS);
  const selectHospital = useEmergencyStore((s) => s.selectHospital);
  const confirmBooking = useEmergencyStore((s) => s.confirmBooking);
  const resetDemo = useEmergencyStore((s) => s.resetDemo);

  const [selectedType, setSelectedType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSOS = () => {
    if (status !== STATUS.IDLE) return;
    setShowForm(true);
  };

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
  };

  const handleProceedToHospital = () => {
    if (!selectedType) return;
    submitSOS(selectedType);
    setShowForm(false);
  };

  const handleSelectHospital = (hospital) => {
    selectHospital(hospital);
  };

  const handleConfirmBooking = () => {
    if (!selectedHospital) return;
    confirmBooking();
  };

  const handleReset = () => {
    resetDemo();
    setSelectedType(null);
    setShowForm(false);
  };

  // Status timeline steps
  const timelineSteps = [
    { key: STATUS.REQUESTING, label: 'Request Sent', icon: '📡' },
    { key: STATUS.DISPATCHED, label: 'Ambulance Dispatched', icon: '🚑' },
    { key: STATUS.EN_ROUTE, label: 'En Route', icon: '🛣️' },
    { key: STATUS.ARRIVED, label: 'Arrived', icon: '📍' },
    { key: STATUS.COMPLETED, label: 'Completed', icon: '✅' },
  ];

  const statusOrder = [STATUS.REQUESTING, STATUS.DISPATCHED, STATUS.EN_ROUTE, STATUS.ARRIVED, STATUS.COMPLETED];
  const currentStepIndex = statusOrder.indexOf(status);

  return (
    <div className="panel customer-panel">
      <div className="panel-header">
        <h2>👤 Customer</h2>
        <span className="panel-subtitle">Emergency Booking</span>
      </div>

      <div className="panel-body">
        {/* SOS Button */}
        {status === STATUS.IDLE && !showForm && (
          <div className="sos-section">
            <button className="sos-button" onClick={handleSOS}>
              <span className="sos-text">SOS</span>
              <span className="sos-subtext">Tap for Emergency</span>
              <div className="sos-ripple" />
            </button>
            <p className="sos-hint">Press the button to request an ambulance</p>
          </div>
        )}

        {/* Emergency Type Form */}
        {showForm && status === STATUS.IDLE && (
          <div className="emergency-form">
            <h3>What's the emergency?</h3>
            <div className="emergency-types">
              {EMERGENCY_TYPES.map((type) => (
                <button
                  key={type.id}
                  className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
                  onClick={() => handleSelectType(type.id)}
                  style={{ '--type-color': type.color }}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
            <button
              className="submit-button"
              onClick={handleProceedToHospital}
              disabled={!selectedType}
            >
              Next — Select Hospital
            </button>
            <button className="cancel-link" onClick={() => { setShowForm(false); setSelectedType(null); }}>
              Cancel
            </button>
          </div>
        )}

        {/* Hospital Selection */}
        {status === STATUS.HOSPITAL_SELECT && (
          <div className="hospital-select-section">
            <h3>Select Hospital</h3>
            <p className="hospital-select-hint">Choose a hospital from the list below</p>
            <div className="hospital-list">
              {hospitals.map((hospital) => {
                const dist = distanceBetween(customerLocation, hospital).toFixed(1);
                const isSelected = selectedHospital && selectedHospital.id === hospital.id;
                return (
                  <button
                    key={hospital.id}
                    className={`hospital-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectHospital(hospital)}
                  >
                    <div className="hospital-card-top">
                      <span className="hospital-card-icon">🏥</span>
                      <div className="hospital-card-info">
                        <span className="hospital-card-name">{hospital.name}</span>
                        <span className="hospital-card-address">{hospital.address}</span>
                      </div>
                    </div>
                    <div className="hospital-card-bottom">
                      <span className="hospital-card-distance">📏 {dist} km</span>
                      <span className="hospital-card-beds">🛏️ {hospital.beds} beds</span>
                    </div>
                    <div className="hospital-card-specialties">
                      {hospital.specialties.slice(0, 3).map((s) => (
                        <span key={s} className="specialty-tag">{s}</span>
                      ))}
                    </div>
                    {isSelected && <div className="hospital-check">✓</div>}
                  </button>
                );
              })}
            </div>
            <button
              className="submit-button book-ambulance-btn"
              onClick={handleConfirmBooking}
              disabled={!selectedHospital}
            >
              🚑 Book Ambulance
            </button>
            <button className="cancel-link" onClick={handleReset}>
              Cancel
            </button>
          </div>
        )}

        {/* Status Timeline — after booking */}
        {(status === STATUS.REQUESTING || status === STATUS.DISPATCHED || status === STATUS.EN_ROUTE || status === STATUS.ARRIVED || status === STATUS.COMPLETED) && (
          <div className="status-section">
            <div className="status-message">
              <div className={`status-badge status-${status.toLowerCase()}`}>
                {STATUS_MESSAGES[status]}
              </div>
            </div>

            {/* ETA Card */}
            {eta && status !== STATUS.COMPLETED && (
              <div className="eta-card">
                <span className="eta-label">ETA</span>
                <span className="eta-value">{eta}</span>
                {routeDistance && <span className="eta-distance">{routeDistance}</span>}
              </div>
            )}

            {/* Hospital Info */}
            {selectedHospital && (
              <div className="info-card">
                <h4>🏥 Hospital</h4>
                <div className="info-row">
                  <span>Name</span>
                  <span>{selectedHospital.name}</span>
                </div>
                <div className="info-row">
                  <span>Phone</span>
                  <span>{selectedHospital.phone}</span>
                </div>
              </div>
            )}

            {/* Ambulance Info */}
            {dispatchedAmbulance && (
              <div className="info-card">
                <h4>🚑 Ambulance Details</h4>
                <div className="info-row">
                  <span>Vehicle</span>
                  <span>{dispatchedAmbulance.vehicleNumber}</span>
                </div>
                <div className="info-row">
                  <span>Driver</span>
                  <span>{dispatchedAmbulance.driver}</span>
                </div>
                <div className="info-row">
                  <span>Type</span>
                  <span className="badge">{dispatchedAmbulance.typeLabel}</span>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="timeline">
              {timelineSteps.map((step, i) => {
                const isCompleted = currentStepIndex >= i;
                const isCurrent = currentStepIndex === i;
                return (
                  <div
                    key={step.key}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="timeline-dot">
                      {isCompleted ? step.icon : <span className="dot" />}
                    </div>
                    <span className="timeline-label">{step.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Completed */}
            {status === STATUS.COMPLETED && (
              <div className="completed-card">
                <div className="completed-icon">🎉</div>
                <h3>Emergency Resolved</h3>
                <p>The ambulance has arrived. Stay safe!</p>
                {emergency && (
                  <div className="stats">
                    <div className="stat">
                      <span className="stat-label">Response Time</span>
                      <span className="stat-value">
                        {formatTime(emergency.createdAt)}
                      </span>
                    </div>
                    {routeDistance && (
                      <div className="stat">
                        <span className="stat-label">Distance</span>
                        <span className="stat-value">{routeDistance}</span>
                      </div>
                    )}
                  </div>
                )}
                <button className="reset-button" onClick={handleReset}>
                  🔄 Run Demo Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

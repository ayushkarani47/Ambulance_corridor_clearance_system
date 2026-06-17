import MapContainer from './components/Map/MapContainer';
import CustomerPanel from './components/Panels/CustomerPanel';
import HospitalPanel from './components/Panels/HospitalPanel';
import RTOPanel from './components/Panels/RTOPanel';
import RoleSwitcher from './components/RoleSwitcher';
import StatusBar from './components/StatusBar';
import useEmergencyStore from './store/useEmergencyStore';

function App() {
  const currentRole = useEmergencyStore((s) => s.currentRole);
  const resetDemo = useEmergencyStore((s) => s.resetDemo);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-icon">🚑</span>
          <h1 className="brand-title">ACMS</h1>
          <span className="brand-subtitle">Ambulance Corridor Management</span>
        </div>
        <RoleSwitcher />
        <button className="reset-btn" onClick={resetDemo} title="Reset Demo">
          🔄
        </button>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Side Panel */}
        <aside className="side-panel">
          {currentRole === 'customer' && <CustomerPanel />}
          {currentRole === 'hospital' && <HospitalPanel />}
          {currentRole === 'rto' && <RTOPanel />}
        </aside>

        {/* Map */}
        <section className="map-section">
          <MapContainer />
        </section>
      </main>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}

export default App;

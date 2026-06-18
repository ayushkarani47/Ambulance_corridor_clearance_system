import MapContainer from './components/Map/MapContainer';
import CustomerPanel from './components/Panels/CustomerPanel';
import RTOPanel from './components/Panels/RTOPanel';
import StatusBar from './components/StatusBar';
import useEmergencyStore from './store/useEmergencyStore';

function App() {
  const resetDemo = useEmergencyStore((s) => s.resetDemo);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-icon">🚑</span>
          <h1 className="brand-title">ACMS</h1>
          <span className="brand-subtitle">Ambulance Corridor Clearance System</span>
        </div>
        <div className="header-right">
          <span className="header-location">📍 Matunga, Mumbai</span>
          <button className="reset-btn" onClick={resetDemo} title="Reset Demo">
            🔄
          </button>
        </div>
      </header>

      {/* Main Content — Three Column Layout */}
      <main className="app-main">
        {/* Left Panel — Customer Booking */}
        <aside className="side-panel left-panel">
          <CustomerPanel />
        </aside>

        {/* Center — Map */}
        <section className="map-section">
          <MapContainer />
        </section>

        {/* Right Panel — RTO & Traffic */}
        <aside className="side-panel right-panel">
          <RTOPanel />
        </aside>
      </main>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}

export default App;

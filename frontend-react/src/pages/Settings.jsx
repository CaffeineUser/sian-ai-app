import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Topbar from '../components/Topbar';
import '../styles/settings.css';

export default function Settings() {
  const navigate = useNavigate();
  const { wallet, disconnectWallet } = useData();
  const [language, setLanguage] = useState(localStorage.getItem('sianai_language_preference') || 'id');
  const [darkMode, setDarkMode] = useState(true);
  const [smartContractAlerts, setSmartContractAlerts] = useState(true);
  const [stealthPrivacy, setStealthPrivacy] = useState(false);
  const [minutesAgo] = useState(2);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem('sianai_language_preference', e.target.value);
  };

  const handleDisconnectWallet = () => {
    if (wallet.connected) {
      if (window.confirm('Apakah Anda yakin ingin memutus koneksi dompet Web3? Prosedur ini akan menghentikan sinkronisasi ledger real-time.')) {
        disconnectWallet();
      }
    }
  };

  const handleExportLogs = () => {
    const logs = {
      timestamp: new Date().toISOString(),
      app: 'SianAI Web3 Weaving Studio',
      version: 'v2.0.4-beta',
      serverStatus: 'Operational',
      walletState: wallet,
      preferences: { theme: darkMode ? 'dark' : 'light', language, smartContractAlerts, stealthPrivacy },
    };
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sianai-system-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-content">
      {/* Topbar */}
      <Topbar
        searchPlaceholder="Cari konfigurasi..."
        onExport={handleExportLogs}
      />

      <main className="page-content">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Configuration Hub</h1>
          <p className="page-subtitle">Manage your digital weaving studio preferences, security protocols, and artificial intelligence parameters for optimal blockchain performance.</p>
        </div>

        {/* Settings Grid */}
        <div className="settings-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>

          {/* CARD 1: App Preferences */}
          <div className="config-card">
            <div className="card-top">
              <div className="card-title-group">
                <i className="fa-solid fa-sliders"></i>
                <h2 className="card-title">App Preferences</h2>
              </div>
            </div>
            <div className="card-body">
              <div className="setting-item">
                <label className="setting-label">INTERFACE LANGUAGE</label>
                <div className="select-wrapper">
                  <select className="custom-select" value={language} onChange={handleLanguageChange}>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English (US)</option>
                    <option value="btk">Bahasa Batak Toba</option>
                  </select>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <div className="setting-item" style={{ marginTop: '24px' }}>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Dark Mode</h4>
                    <p>Optimize for low light environments</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: AI Assistance */}
          <div className="config-card">
            <div className="card-top">
              <div className="card-title-group">
                <i className="fa-solid fa-robot"></i>
                <h2 className="card-title">AI Assistance</h2>
              </div>
            </div>
            <div className="card-body">
              <div className="ai-feature-row">
                <div className="ai-icon-square">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div className="ai-feature-text">
                  <h4>Forecasting Chatbot Integration</h4>
                  <p>Enable conversational AI to provide insights on market trends and weaving demand.</p>
                </div>
              </div>
              <div className="ai-status-alert" style={{ marginTop: '20px' }}>
                <i className="fa-solid fa-circle-info"></i>
                <p>AI model v4.2 'Haris' is currently active and processing historical weaving data.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Status Bar */}
        <div className="settings-footer-bar">
          <div className="status-col-item">
            <span className="status-col-label">SERVER STATUS</span>
            <div className="status-col-val">
              <span className="status-dot-active"></span> Operational
            </div>
          </div>
          <div className="status-col-item">
            <span className="status-col-label">LAST SYNC</span>
            <div className="status-col-val">{minutesAgo} mins ago</div>
          </div>
          <div className="status-col-item">
            <span className="status-col-label">VERSION</span>
            <div className="status-col-val">v2.0.4-beta</div>
          </div>
          <div className="status-col-item">
            <span className="status-col-label">DATABASE</span>
            <div className="status-col-val">MySQL Connected</div>
          </div>
        </div>

      </main>
    </div>
  );
}

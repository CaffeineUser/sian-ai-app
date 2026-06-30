import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import Topbar from '../components/Topbar';
import '../styles/akun.css';

const TABS = [
  { id: 'main', label: 'Overview', icon: 'fa-house' },
  { id: 'personal', label: 'Data Pribadi', icon: 'fa-user' },
  { id: 'keamanan', label: 'Keamanan', icon: 'fa-shield-halved' },
  { id: 'session', label: 'Sesi', icon: 'fa-clock' },
];

export default function Akun() {
  const navigate = useNavigate();
  const { wallet, connectWallet, disconnectWallet, ledger, certificates } = useBlockchain();
  const [activeTab, setActiveTab] = useState('main');
  const [profile, setProfile] = useState({ name: 'Penenun123', email: 'penenun@sianai.id', phone: '+62 812-3456-7890', address: 'Jl. Ulos Batak No. 7, Medan Utara', bio: 'Pengusaha tenun Ulos generasi ketiga dari Toba, Sumatera Utara.' });
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...profileForm });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const certCount = Object.keys(certificates).length;
  const ledgerBlocks = ledger.length;

  return (
    <div className="akun-content">
      {/* Topbar */}
      <Topbar
        searchPlaceholder="Cari profil / akun..."
        onExport={() => alert('Export data profil akun berhasil dicetak!')}
      />

      <main className="page-content">
        {/* Profile Banner */}
        <section className="profile-banner-card">
          <div className="profile-banner-left">
            <div className="profile-avatar-container">
              <div className="profile-avatar-empty" style={{ background: '#ff334b', color: '#fff', fontWeight: 900, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', boxShadow: '0 0 15px rgba(255,51,75,0.4)' }}>
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="profile-info-group">
              <h1 className="profile-name">{profile.name}</h1>
              <div className="profile-id">SianAI Ecosystem ID: #7742-WVR</div>
              <div className="profile-badges-row">
                <span className="profile-pill-badge">Verified Weaver</span>
                <span className="profile-pill-badge">Pemilik Usaha</span>
                <span className="profile-pill-badge">Smart Contract Enabled</span>
              </div>
            </div>
          </div>
          <button className="btn-edit-profile" onClick={() => setActiveTab('personal')}>Edit Profile</button>
        </section>

        {/* Tabs Nav */}
        <div className="account-tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`account-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === 'main' && (
          <div>
            <section className="account-top-grid">
              {/* Connected Wallet Card */}
              <div className="wallet-summary-card">
                <div className="wallet-card-header">
                  <div>
                    <h3 className="wallet-card-title">Connected Wallet</h3>
                    <div className="wallet-card-sub">
                      {wallet.connected ? `${wallet.network} · ${wallet.address?.substring(0, 6)}...${wallet.address?.substring(wallet.address.length - 4)}` : 'Tidak terhubung'}
                    </div>
                  </div>
                  <span className="badge-connected-status" style={{ background: wallet.connected ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)', color: wallet.connected ? 'var(--green)' : 'var(--red)', border: `1px solid ${wallet.connected ? 'rgba(0,230,118,0.3)' : 'rgba(255,23,68,0.3)'}` }}>
                    <i className="fa-solid fa-circle" style={{ fontSize: '7px' }}></i> {wallet.connected ? 'CONNECTED' : 'OFFLINE'}
                  </span>
                </div>
                <div className="wallet-balance-center">
                  <div className="balance-label">TOTAL BALANCE (IDR)</div>
                  <div className="balance-val">{wallet.connected ? 'Rp40.500.000' : 'Rp0'}</div>
                </div>

                <div className="crypto-chips-row" style={{ marginBottom: '16px' }}>
                  <div className="crypto-chip">
                    <div className="crypto-chip-left">
                      <i className="fa-brands fa-ethereum" style={{ color: 'var(--gold)', fontSize: '14px' }}></i> ETH
                    </div>
                    <div className="crypto-chip-val">{wallet.connected ? wallet.balance : '0.00 ETH'}</div>
                  </div>
                  <div className="crypto-chip">
                    <div className="crypto-chip-left">
                      <i className="fa-solid fa-dollar-sign" style={{ color: 'var(--green)', fontSize: '14px' }}></i> USDT
                    </div>
                    <div className="crypto-chip-val">{wallet.connected ? '4,200 USDT' : '0 USDT'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {wallet.connected ? (
                    <button className="btn-wallet-action danger" onClick={disconnectWallet}>
                      <i className="fa-solid fa-link-slash"></i> Putuskan Koneksi
                    </button>
                  ) : (
                    <button className="btn-wallet-action" onClick={connectWallet}>
                      <i className="fa-solid fa-wallet"></i> Hubungkan Dompet
                    </button>
                  )}
                </div>
              </div>

              {/* On-Chain Reputation */}
              <div className="reputation-card">
                <h3 className="reputation-title">On-Chain Reputation</h3>
                <div className="reputation-score-ring">
                  <div className="reputation-ring-inner">
                    <div className="rep-score-number">94</div>
                    <div className="rep-score-label">SCORE</div>
                  </div>
                </div>
                <div className="reputation-stats-row">
                  <div className="rep-stat">
                    <div className="rep-stat-val text-green">{ledgerBlocks}</div>
                    <div className="rep-stat-lbl">Blok Ledger</div>
                  </div>
                  <div className="rep-stat">
                    <div className="rep-stat-val text-gold">{certCount}</div>
                    <div className="rep-stat-lbl">Sertifikat NFT</div>
                  </div>
                  <div className="rep-stat">
                    <div className="rep-stat-val text-blue">3</div>
                    <div className="rep-stat-lbl">Tahun Aktif</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Row */}
            <section className="account-stats-row">
              {[
                { icon: 'fa-box', color: 'var(--gold)', label: 'Total Produk', val: '156' },
                { icon: 'fa-chart-line', color: 'var(--green)', label: 'Omzet Bulan Ini', val: 'Rp42.8M' },
                { icon: 'fa-award', color: 'var(--primary)', label: 'NFT Diterbitkan', val: String(certCount) },
                { icon: 'fa-star', color: '#ffd700', label: 'Rating Artisan', val: '4.9 / 5.0' },
              ].map(stat => (
                <div key={stat.label} className="account-stat-card">
                  <div className="account-stat-icon" style={{ color: stat.color }}>
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <div className="account-stat-val">{stat.val}</div>
                  <div className="account-stat-lbl">{stat.label}</div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* ── TAB: DATA PRIBADI ── */}
        {activeTab === 'personal' && (
          <div className="settings-form-section">
            <h2 className="settings-section-title">Data Pribadi</h2>
            <form onSubmit={handleSave} className="settings-form-grid">
              {[
                { label: 'Nama Pengguna', key: 'name', type: 'text', placeholder: 'Nama lengkap...' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'Email aktif...' },
                { label: 'No. Telepon / WhatsApp', key: 'phone', type: 'text', placeholder: '+62...' },
                { label: 'Alamat Studio', key: 'address', type: 'text', placeholder: 'Alamat lengkap...' },
              ].map(field => (
                <div key={field.key} className="settings-field">
                  <label className="settings-label">{field.label}</label>
                  <input
                    type={field.type}
                    value={profileForm[field.key]}
                    onChange={e => setProfileForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="settings-input"
                  />
                </div>
              ))}
              <div className="settings-field" style={{ gridColumn: '1 / -1' }}>
                <label className="settings-label">Bio Pengrajin</label>
                <textarea
                  value={profileForm.bio}
                  onChange={e => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="settings-input"
                  style={{ height: '80px', resize: 'none' }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-save-artisan">
                  {saved ? <><i className="fa-solid fa-circle-check"></i> Tersimpan!</> : <><i className="fa-solid fa-floppy-disk"></i> Simpan Perubahan</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB: KEAMANAN ── */}
        {activeTab === 'keamanan' && (
          <div className="settings-form-section">
            <h2 className="settings-section-title">Keamanan Akun</h2>
            <div className="settings-form-grid">
              {[
                { label: 'Password Lama', placeholder: 'Masukkan password saat ini...' },
                { label: 'Password Baru', placeholder: 'Minimal 8 karakter...' },
                { label: 'Konfirmasi Password Baru', placeholder: 'Ulangi password baru...' },
              ].map(f => (
                <div key={f.label} className="settings-field">
                  <label className="settings-label">{f.label}</label>
                  <input type="password" placeholder={f.placeholder} className="settings-input" />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="security-toggle-row">
                  <div>
                    <div className="security-toggle-label">Autentikasi Dua Faktor (2FA)</div>
                    <div className="security-toggle-sub">Gunakan Google Authenticator atau SMS OTP</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="security-toggle-row">
                  <div>
                    <div className="security-toggle-label">Notifikasi Login Baru</div>
                    <div className="security-toggle-sub">Email notifikasi saat ada sesi login baru</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-save-artisan" onClick={() => alert('Pengaturan keamanan berhasil disimpan!')}>
                  <i className="fa-solid fa-shield-halved"></i> Simpan Keamanan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SESI ── */}
        {activeTab === 'session' && (
          <div className="settings-form-section">
            <h2 className="settings-section-title">Log Sesi Aktif</h2>
            <div className="session-list">
              {[
                { device: 'Chrome / Windows 11', ip: '103.120.42.xx', time: 'Sekarang', active: true },
                { device: 'Firefox / Android', ip: '202.98.xx.xx', time: '2 jam lalu', active: false },
                { device: 'Safari / iPhone', ip: '180.245.xx.xx', time: 'Kemarin 22:15', active: false },
              ].map((session, i) => (
                <div key={i} className="session-item">
                  <div className="session-icon">
                    <i className={`fa-solid ${i === 0 ? 'fa-desktop' : i === 1 ? 'fa-mobile' : 'fa-tablet'}`}></i>
                  </div>
                  <div className="session-info">
                    <div className="session-device">{session.device}</div>
                    <div className="session-meta">IP: {session.ip} · {session.time}</div>
                  </div>
                  {session.active ? (
                    <span className="badge badge-green"><i className="fa-solid fa-circle" style={{ fontSize: '7px' }}></i> Sesi Ini</span>
                  ) : (
                    <button className="btn-page" style={{ fontSize: '11px', padding: '4px 10px', cursor: 'pointer' }} onClick={() => alert('Sesi berhasil dihentikan!')}>Hentikan</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

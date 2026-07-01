import { useState } from 'react';
import { useData } from '../context/DataContext';
import Topbar from '../components/Topbar';
import '../styles/akun.css';

export default function Akun() {
  const { } = useData();

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('sianai_user');
    const u = stored ? JSON.parse(stored) : {};
    return {
      name: u.name || 'Penenun123',
      email: u.email || 'penenun@sianai.id',
      phone: u.phone || '+62 812-3456-7890',
      address: u.store_address || 'Jl. Ulos Batak No. 7, Medan Utara',
      storeName: u.store_name || 'Ulos Batak',
      bio: u.bio || 'Pengusaha tenun Ulos terdaftar di ekosistem SianAI.',
    };
  });

  const [editMode, setEditMode] = useState(false); // false | 'profile' | 'password'
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [savedMsg, setSavedMsg] = useState('');
  const [pwError, setPwError] = useState('');

  // ── Handle save profile ──
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...profileForm });
    try {
      const stored = JSON.parse(localStorage.getItem('sianai_user') || '{}');
      localStorage.setItem('sianai_user', JSON.stringify({
        ...stored,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        store_address: profileForm.address,
        store_name: profileForm.storeName,
        bio: profileForm.bio,
      }));
    } catch {}
    setSavedMsg('Data berhasil disimpan!');
    setTimeout(() => { setSavedMsg(''); setEditMode(false); }, 1800);
  };

  // ── Handle save password ──
  const handleSavePassword = (e) => {
    e.preventDefault();
    setPwError('');
    if (!passwordForm.old) return setPwError('Masukkan password lama.');
    if (passwordForm.new.length < 8) return setPwError('Password baru minimal 8 karakter.');
    if (passwordForm.new !== passwordForm.confirm) return setPwError('Konfirmasi password tidak cocok.');
    setSavedMsg('Password berhasil diubah!');
    setPasswordForm({ old: '', new: '', confirm: '' });
    setTimeout(() => { setSavedMsg(''); setEditMode(false); }, 1800);
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="akun-content">
      <Topbar searchPlaceholder="Cari data akun..." />

      <main className="page-content">

        {/* ── PROFILE HERO CARD ── */}
        <section className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-hero-avatar">{initials}</div>
            <div>
              <h1 className="profile-name">{profile.name}</h1>
              <div className="profile-id">SianAI Ecosystem ID: #7742-WVR</div>
              <div className="profile-badges-row">
                <span className="profile-pill-badge">
                  <i className="fa-solid fa-circle-check" style={{ fontSize: '10px', color: '#4ade80' }}></i>
                  &nbsp;Verified Weaver
                </span>
                <span className="profile-pill-badge">Pemilik Usaha</span>
              </div>
            </div>
          </div>
          <div className="profile-hero-actions">
            <button
              className="btn-edit-profile"
              onClick={() => { setProfileForm({ ...profile }); setEditMode('profile'); }}
            >
              <i className="fa-solid fa-pen-to-square"></i> Edit Profil
            </button>
            <button
              className="btn-change-password"
              onClick={() => { setPasswordForm({ old: '', new: '', confirm: '' }); setPwError(''); setEditMode('password'); }}
            >
              <i className="fa-solid fa-lock"></i> Ubah Password
            </button>
          </div>
        </section>

        {/* ── PROFILE INFO GRID ── */}
        <section className="profile-info-section">

          {/* Informasi Pribadi */}
          <div className="profile-info-card">
            <div className="profile-info-card-header">
              <i className="fa-solid fa-user profile-info-icon"></i>
              <span>Informasi Pribadi</span>
            </div>
            <div className="profile-info-list profile-info-grid">
              <ProfileRow icon="fa-signature" label="Nama Pengguna" value={profile.name} />
              <ProfileRow icon="fa-envelope" label="Email" value={profile.email} />
              <ProfileRow icon="fa-phone" label="No. Telepon / WA" value={profile.phone} />
              <ProfileRow icon="fa-store" label="Nama Toko" value={profile.storeName} />
              <ProfileRow icon="fa-location-dot" label="Alamat Studio" value={profile.address} fullWidth />
            </div>
          </div>

        </section>



      </main>

      {/* ══════════════════════════════════════
          EDIT PANEL OVERLAY
      ══════════════════════════════════════ */}
      {editMode && (
        <div className="edit-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditMode(false); }}>
          <div className="edit-panel">

            {/* Panel Header */}
            <div className="edit-panel-header">
              <div>
                <div className="edit-panel-title">
                  {editMode === 'profile' ? <><i className="fa-solid fa-pen-to-square"></i> Edit Data Diri</> : <><i className="fa-solid fa-lock"></i> Ubah Password</>}
                </div>
                <div className="edit-panel-sub">
                  {editMode === 'profile' ? 'Perbarui informasi profil Anda' : 'Ganti password akun Anda'}
                </div>
              </div>
              <button className="edit-panel-close" onClick={() => setEditMode(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Success message */}
            {savedMsg && (
              <div className="edit-saved-msg">
                <i className="fa-solid fa-circle-check"></i> {savedMsg}
              </div>
            )}

            {/* ── FORM: EDIT PROFILE ── */}
            {editMode === 'profile' && (
              <form onSubmit={handleSaveProfile} className="edit-form">
                <div className="edit-form-grid">
                  <EditField label="Nama Pengguna" icon="fa-signature">
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Nama lengkap..."
                      className="edit-input"
                      required
                    />
                  </EditField>
                  <EditField label="Email" icon="fa-envelope">
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="Email aktif..."
                      className="edit-input"
                      required
                    />
                  </EditField>
                  <EditField label="No. Telepon / WhatsApp" icon="fa-phone">
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+62..."
                      className="edit-input"
                    />
                  </EditField>
                  <EditField label="Nama Toko" icon="fa-store">
                    <input
                      type="text"
                      value={profileForm.storeName}
                      onChange={e => setProfileForm(p => ({ ...p, storeName: e.target.value }))}
                      placeholder="Nama toko Anda..."
                      className="edit-input"
                    />
                  </EditField>
                  <EditField label="Alamat Studio" icon="fa-location-dot" fullWidth>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="Alamat lengkap..."
                      className="edit-input"
                    />
                  </EditField>
                  <EditField label="Bio Pengrajin" icon="fa-pen-nib" fullWidth>
                    <textarea
                      value={profileForm.bio}
                      onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                      className="edit-input edit-textarea"
                      placeholder="Ceritakan tentang Anda..."
                    />
                  </EditField>
                </div>
                <div className="edit-form-actions">
                  <button type="button" className="btn-cancel-edit" onClick={() => setEditMode(false)}>Batal</button>
                  <button type="submit" className="btn-save-edit">
                    <i className="fa-solid fa-floppy-disk"></i> Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {/* ── FORM: CHANGE PASSWORD ── */}
            {editMode === 'password' && (
              <form onSubmit={handleSavePassword} className="edit-form">
                {pwError && (
                  <div className="edit-error-msg">
                    <i className="fa-solid fa-triangle-exclamation"></i> {pwError}
                  </div>
                )}
                <div className="edit-form-grid">
                  <EditField label="Password Lama" icon="fa-lock" fullWidth>
                    <input
                      type="password"
                      value={passwordForm.old}
                      onChange={e => setPasswordForm(p => ({ ...p, old: e.target.value }))}
                      placeholder="Masukkan password saat ini..."
                      className="edit-input"
                    />
                  </EditField>
                  <EditField label="Password Baru" icon="fa-key">
                    <input
                      type="password"
                      value={passwordForm.new}
                      onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))}
                      placeholder="Minimal 8 karakter..."
                      className="edit-input"
                    />
                  </EditField>
                  <EditField label="Konfirmasi Password Baru" icon="fa-shield-halved">
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Ulangi password baru..."
                      className="edit-input"
                    />
                  </EditField>
                </div>

                {/* Security Toggles */}
                <div className="security-toggles">
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

                <div className="edit-form-actions">
                  <button type="button" className="btn-cancel-edit" onClick={() => setEditMode(false)}>Batal</button>
                  <button type="submit" className="btn-save-edit">
                    <i className="fa-solid fa-shield-halved"></i> Simpan Password
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper Components ──
function ProfileRow({ icon, label, value, fullWidth }) {
  return (
    <div className={`profile-row${fullWidth ? ' profile-row-full' : ''}`}>
      <div className="profile-row-icon"><i className={`fa-solid ${icon}`}></i></div>
      <div className="profile-row-content">
        <div className="profile-row-label">{label}</div>
        <div className="profile-row-value">{value || '-'}</div>
      </div>
    </div>
  );
}


function EditField({ label, icon, children, fullWidth }) {
  return (
    <div className={`edit-field${fullWidth ? ' full-width' : ''}`}>
      <label className="edit-label">
        <i className={`fa-solid ${icon}`}></i> {label}
      </label>
      {children}
    </div>
  );
}

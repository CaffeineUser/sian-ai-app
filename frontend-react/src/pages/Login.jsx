import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Forms state
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    password: '',
    store_name: '',
    store_address: ''
  });
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (detail) => {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ');
    }
    return 'Terjadi kesalahan.';
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('sianai_auth_token', data.token);
        localStorage.setItem('sianai_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(getErrorMessage(data.detail) || 'Nomor HP atau password salah.');
      }
    } catch (err) {
      console.error(err);
      setError('Koneksi ke server gagal. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Registrasi berhasil! Silakan masuk.');
        setIsLogin(true);
        setLoginForm({ phone: registerForm.phone, password: '' });
      } else {
        setError(getErrorMessage(data.detail) || 'Registrasi gagal. Coba lagi.');
      }
    } catch (err) {
      console.error(err);
      setError('Koneksi ke server gagal. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Background neon blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="card-header">
            <img src="/assets/sianailogo.png" alt="SianAI Logo" className="logo" />
            <h2>{isLogin ? 'Masuk SianAI' : 'Daftar Akun Baru'}</h2>
            <p className="subtitle">Cultural-Commerce AI Platform untuk UMKM Ulos</p>
          </div>

          {error && <div className="alert-message error">{error}</div>}
          {message && <div className="alert-message success">{message}</div>}

          {isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Nomor HP</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-phone"></i>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Masukkan password Anda"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-user"></i>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Pemilik Toko"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nomor HP</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-phone"></i>
                  <input
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    placeholder="Minimal 4 karakter"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nama Toko</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-store"></i>
                  <input
                    type="text"
                    placeholder="Nama Toko Ulos Anda"
                    value={registerForm.store_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, store_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Alamat Toko</label>
                <div className="input-with-icon">
                  <i className="fa-solid fa-location-dot"></i>
                  <input
                    type="text"
                    placeholder="Alamat Toko"
                    value={registerForm.store_address}
                    onChange={(e) => setRegisterForm({ ...registerForm, store_address: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar Akun'}
              </button>
            </form>
          )}

          <div className="card-footer">
            {isLogin ? (
              <p>
                Belum punya akun?{' '}
                <button type="button" className="btn-link" onClick={() => setIsLogin(false)}>
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <button type="button" className="btn-link" onClick={() => setIsLogin(true)}>
                  Masuk di sini
                </button>
              </p>
            )}
            <button type="button" className="btn-back-home" onClick={() => navigate('/')}>
              <i className="fa-solid fa-arrow-left"></i> Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

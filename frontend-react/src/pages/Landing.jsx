import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Ambient glowing blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <img src="/assets/sianailogo.png" alt="SianAI Logo" className="logo-img" />
          <span className="logo-text">SianAI <span className="badge">WEB3</span></span>
        </div>
        <button className="btn-nav-login" onClick={() => navigate('/login')}>
          Masuk Dashboard
        </button>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <h1 className="hero-title">
          Cultural-Commerce AI Platform untuk <br />
          <span className="gradient-text">UMKM Tenun Ulos Batak</span>
        </h1>
        <p className="hero-subtitle">
          Revolusi pembukuan, prediksi keuangan berbasis musim adat, dan RAG Chatbot kearifan lokal yang terintegrasi dengan Blockchain Ledger.
        </p>
        <div className="hero-actions">
          <button className="btn-primary-cta" onClick={() => navigate('/login')}>
            Mulai Sekarang <i className="fa-solid fa-arrow-right"></i>
          </button>
          <a href="#features" className="btn-secondary-cta">
            Pelajari Fitur
          </a>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <h2 className="section-title">Fitur Unggulan SianAI</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon red"><i className="fa-solid fa-camera"></i></div>
            <h3>Zero Friction Input</h3>
            <p>Cukup foto nota belanja atau nota penjualan Anda, AI entity extraction akan membukukannya otomatis dalam kurang dari 8 detik.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon gold"><i className="fa-solid fa-comments"></i></div>
            <h3>RAG Chatbot Adat</h3>
            <p>Konsultasi adat Batak Toba dan buat caption promosi untuk produk Ulos Anda dengan asisten AI yang paham konteks budaya.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green"><i className="fa-solid fa-arrow-trend-up"></i></div>
            <h3>Forecasting Musim Adat</h3>
            <p>Prediksi arus kas Anda dengan integrasi Kalender Adat Batak agar tidak kehabisan stok bahan baku menjelang musim ramai pesta.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple"><i className="fa-solid fa-link"></i></div>
            <h3>Blockchain Ledger</h3>
            <p>Catatan keuangan Anda disinkronkan secara aman ke Ledger Kripto sandbox demi keandalan data dan transparansi pembukuan.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 SianAI — Cultural Commerce Platform. Made for Batak Ulos Weavers.</p>
      </footer>
    </div>
  );
}

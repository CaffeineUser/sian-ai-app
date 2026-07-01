import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Topbar from '../components/Topbar';
import '../styles/forecasting.css';

const LIQUIDITY_TABLE = [
  { label: 'Penjualan Terproyeksi', status: 'Stabil', statusCls: 'text-green', dotCls: 'dot-green', val: 'IDR 120.0M', positive: true },
  { label: 'Biaya Bahan Baku', status: 'Meningkat', statusCls: 'text-red', dotCls: 'dot-red', val: '(IDR 45.0M)', positive: false },
  { label: 'Upah Penenun', status: 'Terjadwal', statusCls: 'text-blue', dotCls: 'dot-blue', val: '(IDR 30.0M)', positive: false },
  { label: 'Biaya Operasional Toko', status: 'Efisien', statusCls: 'text-brown', dotCls: 'dot-brown', val: '(IDR 22.5M)', positive: false },
];

export default function Forecasting() {
  const navigate = useNavigate();
  const { stats, inventory } = useData();

  // Dynamic calc based on real transactions
  const currentKas = stats.balance;
  const kasJutaan = (currentKas / 1000000).toFixed(1);
  const targetModal = 30000000; // Target capital of 30M
  const gap = Math.max(0, targetModal - currentKas);
  const gapJutaan = (gap / 1000000).toFixed(1);

  // Count dead stock items (age > 90 days or unsold_90_days)
  const deadStockCount = inventory.filter(item => item.status === 'unsold_90_days' || item.status_stok === 'unsold_90_days').length;

  return (
    <div className="forecasting-content">
      {/* Topbar */}
      <Topbar
        searchPlaceholder="Cari data finansial..."
        onExport={() => alert('Export data forecasting berhasil!')}
      />

      <main className="page-content">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Optimalkan Likuiditas Toko</h1>
          <p className="page-subtitle">Tingkatkan likuiditas menjelang musim pesta dengan memprediksi arus kas berdasarkan kalender adat Batak</p>
        </div>

        {/* early warning alert if dead stock exists and season is upcoming */}
        {deadStockCount > 0 && (
          <div style={{ background: 'rgba(255,51,75,0.08)', border: '1px solid rgba(255,51,75,0.3)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'center' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ff334b', fontSize: '24px' }}></i>
            <div>
              <h4 style={{ color: '#ff334b', fontSize: '14px', fontWeight: 800, margin: 0 }}>PERINGATAN DINI LIKUIDITAS (Siklus Musim Pesta Pernikahan / Ulaon Unjuk)</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                Kas diprediksi kritis menjelang musim ramai akibat modal usaha sebesar <strong style={{ color: 'var(--white)' }}>{deadStockCount} produk kain premium</strong> sedang mengendap di gudang (status dead-stock &gt;90 hari). Segera cairkan aset di menu Inventory.
              </p>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-card-header">
              <span className="stat-title">ESTIMASI MODAL MUSIM DEPAN</span>
              <i className="fa-solid fa-wallet stat-icon"></i>
            </div>
            <div className="stat-value">IDR {(targetModal / 1000000).toFixed(1)}M</div>
            <div className="stat-subtext">
              <i className="fa-regular fa-clock"></i> Siklus Adat: Musim Pernikahan / Ulaon Unjuk (Bobot Pengali 1.8x)
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">KAS TERSEDIA</span>
              <i className="fa-solid fa-piggy-bank stat-icon text-muted"></i>
            </div>
            <div className="stat-value">IDR {kasJutaan}M</div>
            <div className="stat-subtext text-green">
              <i className="fa-solid fa-arrow-trend-up"></i> Terpisah dari kas pribadi (Anti Co-Mingling)
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-card-header">
              <span className="stat-title">KEKURANGAN / GAP</span>
              <i className="fa-solid fa-triangle-exclamation stat-icon"></i>
            </div>
            <div className="stat-value">IDR {gapJutaan}M</div>
            <div className="stat-subtext">{gap > 0 ? 'Tindakan Diperlukan' : 'Surplus — Target Tercapai!'}</div>
          </div>
        </div>

        {/* Recommendations */}
        <h2 className="section-title">Rekomendasi Strategi</h2>
        <div className="recom-grid">
          <div className="recom-card">
            <div className="recom-img" style={{ backgroundImage: "url('/assets/ulos1.jpg')" }}></div>
            <div className="recom-content">
              <div className="recom-header">
                <h3>Pre-order Pelanggan Setia</h3>
                <span className="badge orange">POTENSI TINGGI</span>
              </div>
              <p className="recom-desc">Tingkatkan likuiditas dengan menawarkan sistem pre-order koleksi eksklusif kepada 50 pelanggan teratas.</p>
              <button className="btn-sm btn-maroon" onClick={() => alert('Kampanye Pre-Order Diaktifkan! SMS/WA broadcast telah dikirimkan ke pelanggan teratas.')}>
                Aktifkan Campaign
              </button>
            </div>
          </div>

          <div className="recom-card">
            <div className="recom-img" style={{ backgroundImage: "url('/assets/ulos2.jpg')" }}></div>
            <div className="recom-content">
              <div className="recom-header">
                <h3>Diskon Stok Lama</h3>
                <span className="badge gray">CUCI GUDANG</span>
              </div>
              <p className="recom-desc">Likuidasi stok Ulos premium yang tidak bergerak lebih dari 90 hari untuk menambah kas cepat secara aman.</p>
              <button className="btn-sm btn-light" onClick={() => navigate('/stok')}>Lihat &amp; Cairkan Stok</button>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="bottom-grid">
          {/* Liquidity Table */}
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">Rangkuman Proyeksi Likuiditas</div>
              <div className="table-meta">
                <div className="table-date">Periode: Des 2026 – Feb 2027</div>
                <span className="badge-season">🗓️ Siklus Adat: Musim Pernikahan / Ulaon Unjuk</span>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Komponen Arus Kas</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Nilai Estimasi</th>
                </tr>
              </thead>
              <tbody>
                {LIQUIDITY_TABLE.map(row => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className={row.statusCls}>
                      <span className={`status-dot ${row.dotCls}`}></span>{row.status}
                    </td>
                    <td className={`val-bold${!row.positive ? ' val-red' : ''}`} style={{ textAlign: 'right' }}>{row.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-footer">
              <span>Net Cash Flow (Est.)</span>
              <span>IDR 22.5M</span>
            </div>
          </div>


        </div>

      </main>
    </div>
  );
}

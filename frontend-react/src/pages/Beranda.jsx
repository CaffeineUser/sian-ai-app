import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import Topbar from '../components/Topbar';
import '../styles/beranda.css';

export default function Beranda() {
  const { transactions, stats, wallet, isTransactionSynced } = useBlockchain();
  const navigate = useNavigate();

  const recentTxs = transactions.slice(0, 6);

  const syncStatus = wallet.connected
    ? { icon: 'fa-solid fa-link', cls: 'text-green', text: `Terhubung ke ${wallet.network} (${wallet.balance})` }
    : { icon: 'fa-solid fa-link-slash', cls: 'text-muted', text: 'Ledger tidak terhubung (Gunakan Dompet Kripto)' };

  return (
    <main className="main-content">
      <div className="page-wrapper">

        {/* Header */}
        <Topbar searchPlaceholder="Cari data keuangan..." />

        {/* Saldo Widget */}
        <section className="top-widget">
          <div className="widget-left">
            <div className="saldo-label">TOTAL SALDO KAS</div>
            <div className="saldo-amount">
              Rp{stats.balance.toLocaleString('id-ID')}
            </div>

            <div className="blockchain-sync-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-12px', marginBottom: '20px' }}>
              <i className={`${syncStatus.icon} ${syncStatus.cls}`} style={{ fontSize: '11px' }}></i>
              <span className={syncStatus.cls} style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px' }}>
                {syncStatus.text}
              </span>
            </div>

            <div className="saldo-stats">
              <div className="stat-item green">
                <i className="fa-solid fa-arrow-up"></i> Pemasukan
                <div className="stat-val">Rp{stats.income.toLocaleString('id-ID')}</div>
              </div>
              <div className="stat-item red">
                <i className="fa-solid fa-arrow-down"></i> Pengeluaran
                <div className="stat-val">Rp{stats.expense.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          <div className="widget-right">
            <div className="chart-label">Grafik Arus Kas Sandbox</div>
            <div className="chart-container">
              <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="chart-svg">
                <defs>
                  <linearGradient id="chartGradientDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff334b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ff334b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="chart-area" d="M0,120 C50,110 80,130 150,130 C220,130 250,50 300,50 C350,50 380,80 400,30 L400,150 L0,150 Z" />
                <path className="chart-line" d="M0,120 C50,110 80,130 150,130 C220,130 250,50 300,50 C350,50 380,80 400,30" fill="none" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="0" cy="120" r="4" fill="var(--primary)" />
                <circle cx="150" cy="130" r="4" fill="var(--primary)" />
                <circle cx="300" cy="50" r="4" fill="var(--primary)" />
                <circle cx="400" cy="30" r="4" fill="var(--primary)" />
              </svg>
            </div>
          </div>
        </section>

        {/* Activity Table */}
        <section className="activity-section">
          <div className="activity-header">
            <h2>Aktivitas Transaksi Terkini</h2>
            <a href="#" className="link-view-all" onClick={(e) => { e.preventDefault(); navigate('/laporan'); }}>
              Lihat Semua Ledger &rsaquo;
            </a>
          </div>

          <div className="table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>DESKRIPSI TRANSAKSI</th>
                  <th>KATEGORI &amp; WAKTU</th>
                  <th>STATUS BLOCKCHAIN</th>
                  <th className="text-right">NOMINAL</th>
                </tr>
              </thead>
              <tbody>
                {recentTxs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">Belum ada transaksi tercatat.</td>
                  </tr>
                ) : recentTxs.map(tx => {
                  const synced = isTransactionSynced(tx.id);
                  const isExpense = tx.type === 'expense';
                  return (
                    <tr key={tx.id}>
                      <td>
                        <div className="desc-cell">
                          <div className={`icon-box${isExpense ? ' red-icon' : ''}`}>
                            <i className={`fa-solid ${isExpense ? 'fa-wallet' : 'fa-bag-shopping'}`}></i>
                          </div>
                          <span className="desc-text">{tx.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cat-cell">
                          <span className="cat-name">{tx.category}</span>
                          <span className="cat-time">{tx.date}, {tx.time || '00:00'}</span>
                        </div>
                      </td>
                      <td>
                        {synced ? (
                          <span className="badge badge-green" title={`Detail blok: #${synced.index}`}>
                            <i className="fa-solid fa-shield-halved"></i> SECURE ON-CHAIN
                          </span>
                        ) : (
                          <span className="badge badge-red">
                            <i className="fa-solid fa-triangle-exclamation"></i> OFFLINE LEDGER
                          </span>
                        )}
                      </td>
                      <td className={`text-right fw-bold ${isExpense ? 'text-red' : 'text-green'}`}>
                        {isExpense ? '-' : '+'}Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}

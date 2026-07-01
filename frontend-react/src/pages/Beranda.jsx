import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Topbar from '../components/Topbar';
import '../styles/beranda.css';

export default function Beranda() {
  const { transactions, stats } = useData();
  const navigate = useNavigate();

  const recentTxs = transactions.slice(0, 6);

  return (
    <main className="main-content">
      <div className="page-wrapper">

        {/* Header */}
        <Topbar searchPlaceholder="Cari data keuangan..." />

        {/* Saldo Widget */}
        <section className="top-widget">
          <div className="widget-left">
            <div className="saldo-label">TOTAL SALDO KAS</div>
            <div className="saldo-amount" style={{ marginBottom: '24px' }}>
              Rp{stats.balance.toLocaleString('id-ID')}
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

        </section>


        {/* Activity Table */}
        <section className="activity-section">
          <div className="activity-header">
            <h2>Aktivitas Transaksi Terkini</h2>
            <a href="#" className="link-view-all" onClick={(e) => { e.preventDefault(); navigate('/laporan'); }}>
              Lihat Semua Jurnal Kas &rsaquo;
            </a>
          </div>

          <div className="table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>DESKRIPSI TRANSAKSI</th>
                  <th>KATEGORI &amp; WAKTU</th>
                  <th className="text-right">NOMINAL</th>
                </tr>
              </thead>
              <tbody>
                {recentTxs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">Belum ada transaksi tercatat.</td>
                  </tr>
                ) : recentTxs.map(tx => {
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

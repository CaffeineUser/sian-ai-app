import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Topbar from '../components/Topbar';
import '../styles/laporan.css';

const KATEGORI_OPTIONS = ['Penjualan Produk', 'Bahan Baku', 'Operasional', 'Marketing', 'Lainnya'];

export default function Laporan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { transactions, stats, addTransaction } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  // AI OCR States
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrStep, setOcrStep] = useState(0); // 0: idle, 1: ocr reading, 2: ner categorizing, 3: completed
  const [ocrResult, setOcrResult] = useState(null);

  // Manual input form state
  const [form, setForm] = useState({ name: '', type: 'income', category: 'Penjualan Produk', amount: '', date: new Date().toISOString().split('T')[0], time: '08:00' });

  // Parse open_camera from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('open_camera') === 'true') {
      setShowCameraModal(true);
      // Clean up query param from URL bar
      navigate('/laporan', { replace: true });
    }
  }, [location, navigate]);

  const avgDaily = stats.income > 0 ? Math.round((stats.income - stats.expense) / 30) : 0;

  const categoryPercentages = (() => {
    const totals = {};
    let grandTotal = 0;
    transactions.forEach(tx => {
      grandTotal += tx.amount;
      totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
    });

    const categories = ['Penjualan Produk', 'Bahan Baku', 'Operasional', 'Pemasaran', 'Lainnya'];
    const colors = {
      'Penjualan Produk': 'fill-primary',
      'Bahan Baku': 'fill-blue',
      'Operasional': 'fill-purple',
      'Pemasaran': 'fill-orange',
      'Lainnya': 'fill-brown'
    };

    return categories.map(name => {
      const amount = totals[name] || 0;
      const pct = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;
      return { name, pct, cls: colors[name] || 'fill-primary' };
    });
  })();

  const weeklyFlow = (() => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const amounts = Array(7).fill(0);
    
    transactions.forEach(tx => {
      if (tx.date) {
        const d = new Date(tx.date);
        if (!isNaN(d.getTime())) {
          let dayIndex = d.getDay() - 1;
          if (dayIndex < 0) dayIndex = 6;
          amounts[dayIndex] += tx.amount;
        }
      }
    });

    const maxAmt = Math.max(...amounts, 1);
    const todayIndex = new Date().getDay() - 1 < 0 ? 6 : new Date().getDay() - 1;
    return days.map((label, index) => {
      const amt = amounts[index];
      const h = `${Math.round((amt / maxAmt) * 80) + 5}%`;
      return { label, h, active: index === todayIndex };
    });
  })();

  const filteredTxs = transactions.filter(tx =>
    tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    addTransaction({ ...form, amount: parseInt(form.amount), status: 'Selesai' });
    setForm({ name: '', type: 'income', category: 'Penjualan Produk', amount: '', date: new Date().toISOString().split('T')[0], time: '08:00' });
    setShowManualModal(false);
  };

  const handleOcrSimulate = (mockType) => {
    setOcrProcessing(true);
    setOcrStep(1);
    
    // Simulate OCR reading (1.2s)
    setTimeout(() => {
      setOcrStep(2);
      
      // Simulate NER categorizing (1.2s)
      setTimeout(() => {
        setOcrStep(3);
        
        let result = {};
        if (mockType === 'benang') {
          result = {
            name: 'Pembelian Benang Sutra Mas (50 Roll)',
            type: 'expense',
            category: 'Bahan Baku',
            amount: 850000,
            date: new Date().toISOString().split('T')[0],
            time: '10:30'
          };
        } else {
          result = {
            name: 'Ulos Ragidup Silk Grade A',
            type: 'income',
            category: 'Penjualan Produk',
            amount: 3500000,
            date: new Date().toISOString().split('T')[0],
            time: '14:15'
          };
        }
        
        setOcrResult(result);
        setOcrProcessing(false);
      }, 1200);
    }, 1200);
  };

  const handleSaveOcrResult = () => {
    if (!ocrResult) return;
    addTransaction(ocrResult);
    setShowCameraModal(false);
    setOcrResult(null);
    setOcrStep(0);
  };

  return (
    <div className="laporan-content">
      {/* Topbar */}
      <Topbar
        searchPlaceholder="Cari data keuangan..."
        onSearch={setSearchQuery}
        onExport={() => alert('Data berhasil diekspor!')}
      />

      <main className="page-content">

        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>Laporan Keuangan &amp; Jurnal Kas</h1>
            <p className="page-header-sub">
              <i className="fa-regular fa-calendar"></i> Pencatatan kas masuk dan kas keluar UMKM tenun Ulos secara real-time.
            </p>
          </div>
          <div className="page-header-right">
            <button className="period-selector">Juni 2026 <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i></button>
            <button className="btn-foto-nota-laporan" onClick={() => setShowCameraModal(true)}>
              <i className="fa-solid fa-camera"></i> Foto Nota
            </button>
            <button className="btn-filter" onClick={() => setShowManualModal(true)}>
              <i className="fa-solid fa-plus"></i> Transaksi Manual
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-card-header">
              <span className="stat-title">SALDO KAS SAAT INI</span>
              <i className="fa-solid fa-vault stat-icon"></i>
            </div>
            <div className="stat-value">Rp{stats.balance.toLocaleString('id-ID')}</div>
            <div className="stat-subtext"><i className="fa-solid fa-database"></i> Terkoneksi dengan database MySQL</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">TOTAL PEMASUKAN</span>
              <i className="fa-solid fa-arrow-trend-up stat-icon text-muted"></i>
            </div>
            <div className="stat-value">Rp{stats.income.toLocaleString('id-ID')}</div>
            <div className="stat-subtext text-green"><i className="fa-solid fa-circle-check"></i> Dari hasil penjualan produk Ulos</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-card-header">
              <span className="stat-title">TOTAL PENGELUARAN</span>
              <i className="fa-solid fa-circle-nodes stat-icon"></i>
            </div>
            <div className="stat-value">Rp{stats.expense.toLocaleString('id-ID')}</div>
            <div className="stat-subtext">Fokus pada efisiensi modal benang</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          {/* Transaction Table */}
          <div className="transaksi-card">
            <div className="transaksi-header">
              <div className="transaksi-title"><i className="fa-solid fa-list-check"></i> Jurnal Keuangan Laporan</div>
              <div className="transaksi-actions">
                <button className="icon-btn" title="Filter"><i className="fa-solid fa-sliders"></i></button>
              </div>
            </div>

            <table className="trans-table">
              <thead>
                <tr>
                  <th>DESKRIPSI TRANSAKSI</th>
                  <th>KATEGORI</th>
                  <th style={{ textAlign: 'right' }}>NOMINAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.length === 0 ? (
                  <tr><td colSpan="3" className="text-center text-muted" style={{ padding: '32px' }}>Tidak ada transaksi ditemukan.</td></tr>
                ) : filteredTxs.map(tx => {
                  const isExpense = tx.type === 'expense';
                  return (
                    <tr key={tx.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

            <div className="transaksi-footer">
              <span className="trans-count">Menampilkan {filteredTxs.length} transaksi</span>
              <div className="pagination">
                <button className="btn-page" disabled>Sebelumnya</button>
                <button className="btn-page" disabled>Selanjutnya</button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-col">
            {/* Bar Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <span className="chart-card-title">Struktur Arus Kas</span>
                <span className="chart-period-badge">Bulan Ini</span>
              </div>
              <div className="bar-chart">
                {weeklyFlow.map(d => (
                  <div key={d.label} className="bar-day">
                    <div className={`bar ${d.active ? 'active-bar' : 'income'}`} style={{ height: d.h }}></div>
                    <span className="bar-label">{d.label}</span>
                  </div>
                ))}
              </div>
              <div className="chart-footer">
                <div className="chart-avg">Rata-rata Harian<br /><strong>Rp{avgDaily.toLocaleString('id-ID')}</strong></div>
                <span className="chart-trend">Dinamis</span>
              </div>
            </div>

            {/* Kategori Card */}
            <div className="kategori-card">
              <div className="kategori-title">Kategori Keuangan</div>
              <div className="kategori-list">
                {categoryPercentages.map(k => (
                  <div key={k.name} className="kategori-item">
                    <div className="kategori-meta">
                      <span className="kategori-name">{k.name}</span>
                      <span className="kategori-pct">{k.pct}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`progress-fill ${k.cls}`} style={{ width: `${k.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-kategori">Lihat Distribusi Kas</button>
            </div>
          </div>
        </div>



      </main>

      {/* ── Modal: Manual Transaksi ── */}
      {showManualModal && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget) setShowManualModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '480px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', textAlign: 'center', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <i className="fa-solid fa-plus-circle"></i> Tambah Transaksi Manual
            </h3>
            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>Deskripsi Transaksi</label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Contoh: Penjualan Ulos Ragidup" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>Jenis</label>
                  <select name="type" value={form.type} onChange={handleFormChange} style={{ padding: '10px', background: 'var(--white)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>Kategori</label>
                  <select name="category" value={form.category} onChange={handleFormChange} style={{ padding: '10px', background: 'var(--white)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}>
                    {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>Nominal (Rp)</label>
                <input name="amount" value={form.amount} onChange={handleFormChange} type="number" placeholder="Contoh: 3500000" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>Tanggal</label>
                  <input name="date" value={form.date} onChange={handleFormChange} type="date" style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>Waktu</label>
                  <input name="time" value={form.time} onChange={handleFormChange} type="time" style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn-close-modal" style={{ flex: 1 }} onClick={() => setShowManualModal(false)}>Batal</button>
                <button type="submit" className="btn-save-artisan" style={{ flex: 1 }}>Simpan Transaksi</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Modal: Foto Nota (AI OCR & NER) ── */}
      {showCameraModal && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget && !ocrProcessing) setShowCameraModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '520px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', color: 'var(--text-primary)', textAlign: 'center' }}>
              <i className="fa-solid fa-camera"></i> Foto Nota &amp; AI OCR Scanner
            </h3>
            
            {!ocrResult && !ocrProcessing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', justifyContent: 'center', padding: '20px 10px' }}>
                <div style={{ width: '100%', height: '180px', border: '2px dashed var(--glass-border-gold)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(212,175,55,0.05)' }}>
                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '32px', color: 'var(--gold-dark)', marginBottom: '8px' }}></i>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>Pilih Nota / Kuitansi Belanja Adat</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>AI otomatis membaca nominal, tanggal &amp; kategori</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  <span style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 700 }}>SIMULASI MOCK NOTA:</span>
                  <button className="btn-save-artisan" style={{ width: '100%' }} onClick={() => handleOcrSimulate('benang')}>
                    <i className="fa-solid fa-file-invoice-dollar"></i> Scan Nota: Pembelian Benang Sutra Emas (Rp850.000)
                  </button>
                  <button className="btn-save-artisan" style={{ width: '100%', background: 'rgba(0,200,83,0.1)', color: 'var(--green)', border: '1px solid var(--green)' }} onClick={() => handleOcrSimulate('ulos')}>
                    <i className="fa-solid fa-file-invoice"></i> Scan Nota: Penjualan Ulos Ragidup Silk (Rp3.500.000)
                  </button>
                </div>
              </div>
            )}

            {ocrProcessing && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 10px', gap: '16px' }}>
                <div className="blockchain-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-core" style={{ color: 'var(--gold-dark)' }}><i className="fa-solid fa-robot"></i></div>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {ocrStep === 1 ? 'AI OCR: Membaca Gambar Kuitansi...' : 'AI NER: Mengategorikan Transaksi...'}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Teknologi ekstraksi instan SianAI</p>
              </div>
            )}

            {ocrResult && !ocrProcessing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'rgba(0,200,83,0.06)', border: '1px solid var(--green)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: 'var(--green)', fontSize: '18px' }}></i>
                  <span style={{ fontSize: '13px', color: 'var(--green)', fontWeight: 600 }}>Ekstraksi AI Berhasil Divalidasi!</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Deskripsi:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{ocrResult.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Kategori:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{ocrResult.category}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Jenis:</span>
                    <strong style={{ color: ocrResult.type === 'income' ? 'var(--green)' : 'var(--primary)' }}>
                      {ocrResult.type === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Nominal:</span>
                    <strong style={{ color: 'var(--gold-dark)', fontSize: '15px' }}>Rp {ocrResult.amount.toLocaleString('id-ID')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tanggal &amp; Waktu:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{ocrResult.date} {ocrResult.time}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button className="btn-close-modal" style={{ flex: 1 }} onClick={() => { setOcrResult(null); setOcrStep(0); }}>Ulangi</button>
                  <button className="btn-save-artisan" style={{ flex: 1 }} onClick={handleSaveOcrResult}>Simpan ke Database</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import Topbar from '../components/Topbar';
import '../styles/laporan.css';

const KATEGORI_OPTIONS = ['Penjualan Produk', 'Bahan Baku', 'Operasional', 'Marketing', 'Lainnya'];

export default function Laporan() {
  const navigate = useNavigate();
  const { transactions, ledger, wallet, stats, isTransactionSynced, addTransaction, writeTransaction } = useBlockchain();

  const [searchQuery, setSearchQuery] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showWeb3Modal, setShowWeb3Modal] = useState(false);
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [web3ModalStatus, setWeb3ModalStatus] = useState({ title: 'Mengamankan Transaksi', message: 'Menghubungkan ke jaringan blockchain...' });

  // Manual input form state
  const [form, setForm] = useState({ name: '', type: 'income', category: 'Penjualan Produk', amount: '', date: new Date().toISOString().split('T')[0], time: '08:00' });

  const avgDaily = stats.income > 0 ? Math.round((stats.income - stats.expense) / 30) : 0;

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

  const handleSyncAll = async () => {
    if (!wallet.connected) {
      alert('Hubungkan dompet kripto terlebih dahulu!');
      return;
    }
    const unsynced = transactions.filter(tx => !isTransactionSynced(tx.id));
    if (unsynced.length === 0) { alert('Semua transaksi sudah tersinkronisasi!'); return; }
    setShowWeb3Modal(true);
    try {
      for (const tx of unsynced.slice(0, 3)) {
        await writeTransaction(tx, (status, data) => {
          setWeb3ModalStatus({ title: 'Sinkronisasi Transaksi', message: data.message });
        });
      }
      setShowWeb3Modal(false);
    } catch (err) {
      alert('Error: ' + err.message);
      setShowWeb3Modal(false);
    }
  };

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
    setShowExplorerModal(true);
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
            <h1>Laporan Keuangan &amp; Blockchain Ledger</h1>
            <p className="page-header-sub">
              <i className="fa-regular fa-calendar"></i> Pencatatan keuangan aman, terverifikasi kriptografi on-chain.
            </p>
          </div>
          <div className="page-header-right">
            <button className="period-selector">Juni 2026 <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i></button>
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
            <div className="stat-subtext"><i className="fa-solid fa-shield-halved"></i> Sinkron dengan Local Ledger</div>
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
                <button className="icon-btn" style={{ color: 'var(--gold)', borderColor: 'var(--glass-border-gold)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, padding: '6px 12px' }} onClick={handleSyncAll}>
                  <i className="fa-solid fa-cloud-arrow-up"></i> Sinkronkan Semua
                </button>
                <button className="icon-btn" title="Filter"><i className="fa-solid fa-sliders"></i></button>
              </div>
            </div>

            <table className="trans-table">
              <thead>
                <tr>
                  <th>DESKRIPSI TRANSAKSI</th>
                  <th>KATEGORI</th>
                  <th>STATUS LEDGER BLOCKCHAIN</th>
                  <th style={{ textAlign: 'right' }}>NOMINAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted" style={{ padding: '32px' }}>Tidak ada transaksi ditemukan.</td></tr>
                ) : filteredTxs.map(tx => {
                  const synced = isTransactionSynced(tx.id);
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
                      <td>
                        {synced ? (
                          <span className="badge badge-green"><i className="fa-solid fa-shield-halved"></i> SECURE ON-CHAIN</span>
                        ) : (
                          <span className="badge badge-red"><i className="fa-solid fa-triangle-exclamation"></i> OFFLINE LEDGER</span>
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
                {[
                  { label: 'Sen', h: '45%' }, { label: 'Sel', h: '30%' }, { label: 'Rab', h: '55%' },
                  { label: 'Kam', h: '40%' }, { label: 'Jum', h: '65%' }, { label: 'Sab', h: '85%', active: true }, { label: 'Min', h: '50%' },
                ].map(d => (
                  <div key={d.label} className="bar-day">
                    <div className={`bar ${d.active ? 'active-bar' : 'income'}`} style={{ height: d.h }}></div>
                    <span className="bar-label">{d.label}</span>
                  </div>
                ))}
              </div>
              <div className="chart-footer">
                <div className="chart-avg">Rata-rata Harian<br /><strong>Rp{avgDaily.toLocaleString('id-ID')}</strong></div>
                <span className="chart-trend">↑ +12%</span>
              </div>
            </div>

            {/* Kategori Card */}
            <div className="kategori-card">
              <div className="kategori-title">Kategori Keuangan</div>
              <div className="kategori-list">
                {[
                  { name: 'Penjualan Produk', pct: 65, cls: 'fill-primary' },
                  { name: 'Bahan Baku', pct: 20, cls: 'fill-blue' },
                  { name: 'Operasional', pct: 10, cls: 'fill-purple' },
                  { name: 'Pemasaran', pct: 5, cls: 'fill-orange' },
                ].map(k => (
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

        {/* Blockchain Ledger */}
        <section className="transaksi-card" style={{ marginBottom: '32px' }}>
          <div className="transaksi-header" style={{ borderBottom: '1px dashed var(--glass-border-gold)', background: 'rgba(255,193,7,0.01)' }}>
            <div className="transaksi-title" style={{ color: 'var(--gold)' }}>
              <i className="fa-solid fa-database"></i> Blockchain Ledger Registry (SianAI DevNet Sandbox)
            </div>
            <div className="transaksi-actions">
              <span className="badge badge-green"><i className="fa-solid fa-server"></i> NODE OPERASIONAL</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="trans-table">
              <thead>
                <tr>
                  <th>BLOK INDEX</th>
                  <th>WAKTU BLOK</th>
                  <th>TRANSAKSI HASH (TXHASH)</th>
                  <th>PREVIEW DATA MUATAN</th>
                  <th>GAS FEE</th>
                  <th style={{ textAlign: 'right' }}>BUKTI KRIPTOGRAFI</th>
                </tr>
              </thead>
              <tbody>
                {ledger.slice().reverse().map(block => (
                  <tr key={block.index}>
                    <td><span className="badge badge-blue">#{block.index}</span></td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(block.timestamp).toLocaleString('id-ID')}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {block.txHash ? block.txHash.substring(0, 20) + '...' : '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {block.payload?.description || block.payload?.message || JSON.stringify(block.payload).substring(0, 40) + '...'}
                    </td>
                    <td style={{ fontSize: '12px' }}>{block.gasUsed ? `${block.gasUsed.toLocaleString()} gas` : '0 gas'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-page" style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '11px' }} onClick={() => handleBlockClick(block)}>
                        <i className="fa-solid fa-magnifying-glass"></i> Explorer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom Row */}
        <div className="bottom-row">
          <div className="product-card">
            <img src="/assets/ulos1.jpg" alt="Ulos Ragidup Silk" className="product-img" />
            <span className="product-chip certified">✦ DIGITAL AUTHENTICITY CERTIFICATE</span>
            <div className="product-info">
              <div className="product-name">Ulos Ragidup Silk</div>
              <div className="product-sub">Metadata digital tercatat pada blockchain ERC-721.</div>
            </div>
          </div>
          <div className="product-card">
            <img src="/assets/ulos2.jpg" alt="Hand-Woven Process" className="product-img" />
            <span className="product-chip heritage">🏛 WARISAN BUDAYA BATAK</span>
            <div className="product-info">
              <div className="product-name">Hand-Woven Process</div>
              <div className="product-sub">Melindungi kerajinan tenun tradisional lewat desentralisasi.</div>
            </div>
          </div>
          <div className="ai-card">
            <div className="ai-card-header">
              <div className="ai-icon"><i className="fa-solid fa-robot"></i></div>
              <span className="ai-card-title">Rekomendasi Blockchain SianAI</span>
            </div>
            <div className="ai-card-body">
              Simpan data transaksi mingguan Anda secara kolektif ke blockchain. Keabsahan pembukuan terenkripsi memudahkan verifikasi pengajuan kredit bank!
            </div>
          </div>
        </div>

      </main>

      {/* ── Modal: Manual Transaksi ── */}
      {showManualModal && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget) setShowManualModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '480px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', textAlign: 'center', color: 'var(--white)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <i className="fa-solid fa-plus-circle"></i> Tambah Transaksi Manual
            </h3>
            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>Deskripsi Transaksi</label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Contoh: Penjualan Ulos Ragidup" required style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>Jenis</label>
                  <select name="type" value={form.type} onChange={handleFormChange} style={{ padding: '10px', background: '#0c0204', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>Kategori</label>
                  <select name="category" value={form.category} onChange={handleFormChange} style={{ padding: '10px', background: '#0c0204', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}>
                    {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>Nominal (Rp)</label>
                <input name="amount" value={form.amount} onChange={handleFormChange} type="number" placeholder="Contoh: 3500000" required style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>Tanggal</label>
                  <input name="date" value={form.date} onChange={handleFormChange} type="date" style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>Waktu</label>
                  <input name="time" value={form.time} onChange={handleFormChange} type="time" style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
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

      {/* ── Modal: Web3 Processing ── */}
      {showWeb3Modal && (
        <div className="web3-modal active">
          <div className="web3-modal-content">
            <div className="blockchain-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-core"><i className="fa-solid fa-link"></i></div>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{web3ModalStatus.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{web3ModalStatus.message}</p>
          </div>
        </div>
      )}

      {/* ── Modal: Block Explorer ── */}
      {showExplorerModal && selectedBlock && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget) setShowExplorerModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '580px' }}>
            <i className="fa-solid fa-circle-nodes" style={{ fontSize: '36px', color: 'var(--gold)', marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(255,193,7,0.3))' }}></i>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>SianAI Block Explorer</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Kriptografi Transaksi Terverifikasi di Blok Ledger</p>
            <div className="explorer-modal-grid">
              {[
                { label: 'Blok Index', val: `#${selectedBlock.index}` },
                { label: 'Waktu Blok', val: new Date(selectedBlock.timestamp).toLocaleString('id-ID') },
                { label: 'Hash Transaksi (TxHash)', val: selectedBlock.txHash },
                { label: 'Hash Blok Sebelumnya', val: selectedBlock.previousHash },
                { label: 'Gas Digunakan', val: `${selectedBlock.gasUsed?.toLocaleString() || 0} gas` },
                { label: 'Miner Address', val: selectedBlock.miner || '—' },
              ].map(item => (
                <div key={item.label} className="explorer-item">
                  <span className="explorer-label">{item.label}</span>
                  <span className="explorer-val hash-val" style={{ fontSize: '11.5px', wordBreak: 'break-all' }}>{item.val}</span>
                </div>
              ))}
            </div>
            <button className="btn-close-modal" style={{ marginTop: '20px' }} onClick={() => setShowExplorerModal(false)}>Tutup Explorer</button>
          </div>
        </div>
      )}
    </div>
  );
}

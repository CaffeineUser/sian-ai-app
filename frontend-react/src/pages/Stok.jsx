import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import Topbar from '../components/Topbar';
import '../styles/stok.css';

const CATALOG_ITEMS = [
  { id: 'cat-1', name: 'Ulos Ragidup Silk Grade A', type: 'Ragidup', region: 'Toba', price: 3500000, stock: 8, status: 'RARE', image: '/assets/ulos1.jpg' },
  { id: 'cat-2', name: 'Ulos Ragi Hotang Handwoven', type: 'Ragi Hotang', region: 'Simalungun', price: 2800000, stock: 15, status: 'READY', image: '/assets/ulos2.jpg' },
  { id: 'cat-3', name: 'Ulos Bintang Maratur Premium', type: 'Bintang Maratur', region: 'Angkola', price: 4200000, stock: 3, status: 'LIMITED', image: '/assets/ulos1.jpg' },
  { id: 'cat-4', name: 'Ulos Sadum Heritage Collection', type: 'Sadum', region: 'Toba', price: 5500000, stock: 1, status: 'RARE', image: '/assets/ulos2.jpg' },
];

const ULOS_TYPES = ['Ragidup', 'Bintang Maratur', 'Sadum', 'Sibolang', 'Mangiring', 'Ragi Hotang', 'Lainnya'];

export default function Stok() {
  const navigate = useNavigate();
  const { wallet, inventory, saveInventory, mintUlosCertificate, certificates } = useBlockchain();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWeb3Modal, setShowWeb3Modal] = useState(false);
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [web3Status, setWeb3Status] = useState({ title: 'Menerbitkan Sertifikat', message: 'Memproses sertifikat keaslian...' });

  const [form, setForm] = useState({ name: '', type: 'Ragidup', price: '', description: '' });
  const [imagePreview, setImagePreview] = useState(null);

  const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddInventory = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    const newItem = {
      id: `inv-${Date.now()}`,
      name: form.name,
      ulosType: form.type,
      costPrice: parseInt(form.price),
      description: form.description,
      image: imagePreview || '/assets/ulos1.jpg',
      dateAdded: new Date().toISOString().split('T')[0],
    };
    saveInventory([...inventory, newItem]);
    setForm({ name: '', type: 'Ragidup', price: '', description: '' });
    setImagePreview(null);
    setShowAddModal(false);
  };

  const handleMintCert = async (item) => {
    if (!wallet.connected) {
      alert('Hubungkan dompet kripto terlebih dahulu!');
      return;
    }
    setShowWeb3Modal(true);
    try {
      const cert = await mintUlosCertificate(item, (status, data) => {
        setWeb3Status({ title: 'Menerbitkan Sertifikat', message: data.message });
      });
      setShowWeb3Modal(false);
      setSelectedCert({ ...cert, ulosName: item.name });
      setShowExplorerModal(true);
    } catch (err) {
      alert('Error: ' + err.message);
      setShowWeb3Modal(false);
    }
  };

  const handleViewCert = (item) => {
    const cert = certificates[item.id] || certificates[item.name];
    if (!cert) { alert('Belum ada sertifikat. Mint terlebih dahulu.'); return; }
    setSelectedCert({ ...cert, ulosName: item.name });
    setShowExplorerModal(true);
  };

  const filteredCatalog = CATALOG_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadgeStyle = (status) => {
    if (status === 'RARE') return { bg: 'rgba(255,51,75,0.15)', color: 'var(--primary)', border: 'rgba(255,51,75,0.3)' };
    if (status === 'LIMITED') return { bg: 'rgba(255,193,7,0.15)', color: 'var(--gold)', border: 'rgba(255,193,7,0.3)' };
    return { bg: 'rgba(0,230,118,0.15)', color: 'var(--green)', border: 'rgba(0,230,118,0.3)' };
  };

  return (
    <div className="stok-content">
      {/* Topbar */}
      <Topbar
        searchPlaceholder="Cari produk inventori..."
        onSearch={setSearchQuery}
        onExport={() => alert('Laporan Inventaris berhasil diekspor!')}
      />

      <main className="page-content">
        {/* Page Header */}
        <div className="stok-page-header">
          <div>
            <h1>Manajemen Inventaris &amp; Tren</h1>
            <p className="stok-page-sub">Pantau aset digital Ulos Anda dan analisis pergerakan stok real-time melalui blockchain.</p>
          </div>
          <div className="stok-header-actions">
            <button className="btn-topbar-export" style={{ padding: '10px 18px', fontSize: '13px', fontWeight: 700 }} onClick={() => alert('Laporan Inventaris berhasil diekspor!')}>
              <i className="fa-solid fa-download"></i> Ekspor Laporan
            </button>
            <button className="btn-save-artisan" onClick={() => setShowAddModal(true)}>
              <i className="fa-solid fa-plus"></i> Tambah Koleksi
            </button>
          </div>
        </div>

        {/* Top Grid: Chart + Dead Stock */}
        <div className="inv-top-grid">
          <div className="inv-chart-card">
            <div className="inv-chart-header">
              <div>
                <h3 className="inv-chart-title">Siklus Inventaris Musiman</h3>
                <p className="inv-chart-sub">Visualisasi perputaran stok 12 bulan terakhir</p>
              </div>
              <div className="inv-toggle-btns">
                <button className="inv-toggle-btn active">Volume</button>
                <button className="inv-toggle-btn">Nilai Aset</button>
              </div>
            </div>
            <div className="inv-chart-body">
              <svg viewBox="0 0 700 200" preserveAspectRatio="none" style={{ width: '100%', height: '190px', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="invLineGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff334b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ff334b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="30" x2="700" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="80" x2="700" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="130" x2="700" y2="130" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="180" x2="700" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <path d="M 20 140 Q 70 110 120 130 T 220 80 T 320 150 T 420 60 T 520 100 T 620 40 T 680 70" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(255,51,75,0.6))' }} />
                <path d="M 20 140 Q 70 110 120 130 T 220 80 T 320 150 T 420 60 T 520 100 T 620 40 T 680 70 L 680 180 L 20 180 Z" fill="url(#invLineGlow)" />
                <circle cx="120" cy="130" r="4" fill="var(--primary)" />
                <circle cx="220" cy="80" r="4" fill="var(--gold)" />
                <circle cx="420" cy="60" r="4" fill="var(--primary)" />
                <circle cx="620" cy="40" r="5" fill="var(--green)" style={{ filter: 'drop-shadow(0 0 6px var(--green))' }} />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>
                {['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'].map(m => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="dead-stock-alert-card">
            <div>
              <div className="dead-stock-tag"><i className="fa-solid fa-triangle-exclamation"></i> Analisis Stok Macet</div>
              <h3 className="dead-stock-heading">12 Produk tidak bergerak dalam 90 hari terakhir.</h3>
            </div>
            <div>
              <div className="dead-stock-stat-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  <span>Stok Macet 90 Hari</span>
                  <span style={{ color: 'var(--gold)', fontSize: '14px' }}>Rp18.5M</span>
                </div>
                <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.1)' }}>
                  <div className="progress-fill" style={{ width: '65%', background: 'var(--green)' }}></div>
                </div>
              </div>
              <button className="btn-promo-flash" onClick={() => alert('Promo Flash diaktifkan! 12 produk macet otomatis diberi diskon khusus di katalog.')}>
                Mulai Promo Flash <i className="fa-solid fa-bolt"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Penenun's Added Collections */}
        {inventory.length > 0 && (
          <div className="penenun-collection-section" style={{ marginBottom: '32px', background: 'rgba(255,193,7,0.03)', border: '1px solid rgba(255,193,7,0.25)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-gem" style={{ color: 'var(--gold)' }}></i> Koleksi Ditambahkan Penenun
                </h2>
                <p style={{ fontSize: '12.5px', color: '#ffffff', marginTop: '2px' }}>Daftar mahakarya Ulos hasil entri penenun yang telah diverifikasi dan tersimpan secara digital.</p>
              </div>
              <span style={{ background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.3)', color: 'var(--gold)', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>
                {inventory.length} Koleksi
              </span>
            </div>
            <div className="stok-product-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: 0 }}>
              {inventory.map(item => {
                const cert = certificates[item.id] || certificates[item.name];
                return (
                  <div key={item.id} className="product-stok-card">
                    <div className="stok-card-img-wrap">
                      <img src={item.image || '/assets/ulos1.jpg'} alt={item.name} className="stok-card-img" />
                      <span className="stok-status-badge" style={{ background: 'rgba(255,193,7,0.2)', color: 'var(--gold)', border: '1px solid rgba(255,193,7,0.4)' }}>CUSTOM</span>
                    </div>
                    <div className="stok-card-body">
                      <div className="stok-card-type">{item.ulosType}</div>
                      <div className="stok-card-name">{item.name}</div>
                      <div className="stok-card-price">Rp{item.costPrice?.toLocaleString('id-ID')}</div>
                      {item.description && <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>{item.description}</p>}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        {cert ? (
                          <button className="btn-cert-view" onClick={() => handleViewCert(item)}>
                            <i className="fa-solid fa-award"></i> Lihat Sertifikat
                          </button>
                        ) : (
                          <button className="btn-mint-cert" onClick={() => handleMintCert(item)}>
                            <i className="fa-solid fa-certificate"></i> Mint Sertifikat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Catalog */}
        <div className="catalog-header-row">
          <h2 className="catalog-title">Ulos Premium Catalog</h2>
          <div className="catalog-filters">
            <select className="inv-filter-select">
              <option>Semua Region</option>
              <option>Toba, Sumatera Utara</option>
              <option>Simalungun</option>
              <option>Angkola</option>
            </select>
            <select className="inv-filter-select">
              <option>Urutkan: Stok Terbaru</option>
              <option>Harga Tertinggi</option>
              <option>Harga Terendah</option>
            </select>
          </div>
        </div>

        <div className="stok-product-grid">
          {filteredCatalog.map(item => {
            const s = statusBadgeStyle(item.status);
            const cert = certificates[item.id] || certificates[item.name];
            return (
              <div key={item.id} className="product-stok-card">
                <div className="stok-card-img-wrap">
                  <img src={item.image} alt={item.name} className="stok-card-img" />
                  <span className="stok-status-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{item.status}</span>
                </div>
                <div className="stok-card-body">
                  <div className="stok-card-type">{item.type} · {item.region}</div>
                  <div className="stok-card-name">{item.name}</div>
                  <div className="stok-card-price">Rp{item.price.toLocaleString('id-ID')}</div>
                  <div className="stok-card-stock">
                    <i className="fa-solid fa-boxes-stacked"></i> Stok: {item.stock} unit
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    {cert ? (
                      <button className="btn-cert-view" onClick={() => handleViewCert(item)}>
                        <i className="fa-solid fa-award"></i> Lihat Sertifikat
                      </button>
                    ) : (
                      <button className="btn-mint-cert" onClick={() => handleMintCert(item)}>
                        <i className="fa-solid fa-certificate"></i> Mint Sertifikat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="inv-stats-grid">
          <div className="inv-stat-widget">
            <div className="inv-stat-icon gold"><i className="fa-solid fa-box-archive"></i></div>
            <div>
              <div className="inv-stat-lbl">Total Koleksi Aktif</div>
              <div className="inv-stat-val">{CATALOG_ITEMS.length + inventory.length} Items</div>
            </div>
          </div>
          <div className="inv-stat-widget">
            <div className="inv-stat-icon maroon"><i className="fa-solid fa-wallet"></i></div>
            <div>
              <div className="inv-stat-lbl">Estimasi Nilai Stok</div>
              <div className="inv-stat-val">Rp428.5M</div>
            </div>
          </div>
          <div className="inv-stat-widget" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="inv-stat-icon cyan"><i className="fa-solid fa-diagram-project"></i></div>
              <div>
                <div className="inv-stat-lbl">Sertifikasi Blockchain</div>
                <div className="inv-stat-val">94.2%</div>
              </div>
            </div>
            <button className="qr-code-btn" title="Pindai QR Sertifikat" onClick={() => alert('Pemindai QR Sertifikat Blockchain Aktif')}>
              <i className="fa-solid fa-qrcode"></i>
            </button>
          </div>
        </div>

      </main>

      {/* ── Modal: Tambah Inventori ── */}
      {showAddModal && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '500px', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', color: 'var(--white)', textAlign: 'center' }}>
              <i className="fa-solid fa-plus-circle"></i> Tambah Koleksi Ulos
            </h3>
            <form onSubmit={handleAddInventory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>1. Nama Produk</label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Contoh: Ulos Ragidup Silk Grade A" required style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>2. Jenis Produk</label>
                <select name="type" value={form.type} onChange={handleFormChange} style={{ padding: '10px', background: '#0c0204', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}>
                  {ULOS_TYPES.map(t => <option key={t} value={t}>{t === 'Lainnya' ? 'Kain Adat / Aksesoris Lainnya' : `Ulos ${t}`}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>3. Harga Produk (Rp)</label>
                <input name="price" value={form.price} onChange={handleFormChange} type="number" placeholder="Contoh: 3500000" required style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>4. Gambar Produk</label>
                <div className="image-upload-box" onClick={() => document.getElementById('imgInput').click()} style={{ cursor: 'pointer', position: 'relative' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: '6px' }} />
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '4px' }}></i>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Klik atau Import Gambar dari Perangkat</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>PNG, JPG (Maks. 2MB)</span>
                    </>
                  )}
                </div>
                <input id="imgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)' }}>5. Deskripsi Produk</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Masukkan deskripsi produk Ulos..." style={{ padding: '10px', height: '80px', resize: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--white)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit', fontSize: '12px', lineHeight: 1.5 }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-close-modal" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn-save-artisan" style={{ flex: 1 }}>Simpan Koleksi</button>
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
              <div className="spinner-core"><i className="fa-solid fa-certificate"></i></div>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{web3Status.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{web3Status.message}</p>
          </div>
        </div>
      )}

      {/* ── Modal: Certificate Explorer ── */}
      {showExplorerModal && selectedCert && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget) setShowExplorerModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '540px' }}>
            <i className="fa-solid fa-award" style={{ fontSize: '42px', color: 'var(--gold)', marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(255,193,7,0.3))' }}></i>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>Sertifikat Keaslian Digital</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Bukti Kriptografis Keaslian Kain Ulos Batak (ERC-721 Token)</p>
            <div className="explorer-modal-grid" style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Sertifikat Token ID', val: selectedCert.tokenId },
                { label: 'Nama Kain Ulos', val: selectedCert.ulosName },
                { label: 'Waktu Penerbitan', val: new Date(selectedCert.timestamp).toLocaleString('id-ID') },
                { label: 'Alamat Pemilik (Dompet)', val: selectedCert.ownerAddress },
                { label: 'Hash Transaksi Mint', val: selectedCert.txHash },
                { label: 'Nomor Blok Ledger', val: `#${selectedCert.blockNumber}` },
              ].map(item => (
                <div key={item.label} className="explorer-item">
                  <span className="explorer-label">{item.label}</span>
                  <span className="explorer-val" style={{ fontWeight: 700, color: item.label === 'Sertifikat Token ID' ? 'var(--gold)' : undefined, fontSize: '11.5px', wordBreak: 'break-all' }}>{item.val}</span>
                </div>
              ))}
            </div>
            <button className="btn-close-modal" style={{ marginTop: '20px' }} onClick={() => setShowExplorerModal(false)}>Tutup Sertifikat</button>
          </div>
        </div>
      )}
    </div>
  );
}

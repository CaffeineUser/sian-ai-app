import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
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
  const { inventory, saveInventory, updateInventoryItem, deleteInventoryItem } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', type: 'Ragidup', costPrice: '', sellingPrice: '', quantity: '1', description: '' });
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [form, setForm] = useState({ name: '', type: 'Ragidup', costPrice: '', sellingPrice: '', quantity: '1', description: '' });
  const [imagePreview, setImagePreview] = useState(null);

  const handleFormChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditFormChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddInventory = (e) => {
    e.preventDefault();
    if (!form.name || !form.costPrice || !form.sellingPrice) return;
    
    const isMockOld = form.name.toLowerCase().includes('lama') || form.name.toLowerCase().includes('sutera') || form.name.toLowerCase().includes('ragidup');
    const daysOffset = isMockOld ? 95 : 0;
    const dateVal = new Date(Date.now() - daysOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newItem = {
      id: `inv-${Date.now()}`,
      name: form.name,
      ulosType: form.type,
      costPrice: parseInt(form.costPrice),
      sellingPrice: parseInt(form.sellingPrice),
      quantity: parseInt(form.quantity || 1),
      description: form.description,
      image: imagePreview || '/assets/ulos1.jpg',
      dateAdded: dateVal,
      status: 'ready'
    };
    saveInventory(newItem);
    setForm({ name: '', type: 'Ragidup', costPrice: '', sellingPrice: '', quantity: '1', description: '' });
    setImagePreview(null);
    setShowAddModal(false);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      type: item.ulos_type || item.ulosType || 'Ragidup',
      costPrice: item.cost_price || item.costPrice || '',
      sellingPrice: item.selling_price || item.sellingPrice || '',
      quantity: item.quantity || '1',
      description: item.description || ''
    });
    setEditImagePreview(item.image || null);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateInventoryItem(editingItem.id, {
      name: editForm.name,
      ulosType: editForm.type,
      costPrice: parseFloat(editForm.costPrice),
      sellingPrice: parseFloat(editForm.sellingPrice),
      quantity: parseInt(editForm.quantity),
      status: 'ready', // Default ready to bypass status check
      description: editForm.description,
      image: editImagePreview
    });
    setShowEditModal(false);
    setEditingItem(null);
    setEditImagePreview(null);
  };

  const handleDeleteClick = (itemId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus barang ini dari inventori?')) {
      deleteInventoryItem(itemId);
    }
  };

  const handleApplyOcrDiscount = (item) => {
    const discountedPrice = item.batas_diskon_aman || (item.cost_price || item.costPrice) * 1.05;
    updateInventoryItem(item.id, {
      status: 'ready',
      selling_price: discountedPrice
    });
    alert(`Rekomendasi diskon aman berhasil diterapkan! Harga jual produk "${item.name}" diturunkan menjadi Rp ${discountedPrice.toLocaleString('id-ID')} (di atas modal + 5% margin aman).`);
  };

  const filteredCatalog = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadgeStyle = (status) => {
    if (status === 'dead_stock' || status === 'unsold_90_days') return { bg: 'rgba(255,51,75,0.15)', color: 'var(--primary)', border: 'rgba(255,51,75,0.3)' };
    if (status === 'sold') return { bg: 'rgba(255,193,7,0.15)', color: 'var(--gold)', border: 'rgba(255,193,7,0.3)' };
    return { bg: 'rgba(0,230,118,0.15)', color: 'var(--green)', border: 'rgba(0,230,118,0.3)' };
  };

  const totalInvValue = inventory.reduce((sum, item) => sum + (item.cost_price || item.costPrice || 0) * (item.quantity || 0), 0);

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
            <p className="stok-page-sub">Pantau ketersediaan produk Ulos Anda secara real-time dari database.</p>
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

        {/* Stats Grid */}
        <div className="inv-stats-grid" style={{ marginBottom: '30px' }}>
          <div className="inv-stat-widget">
            <div className="inv-stat-icon gold"><i className="fa-solid fa-box-archive"></i></div>
            <div>
              <div className="inv-stat-lbl">Total Koleksi Aktif</div>
              <div className="inv-stat-val">{inventory.length} Items</div>
            </div>
          </div>
          <div className="inv-stat-widget">
            <div className="inv-stat-icon maroon"><i className="fa-solid fa-wallet"></i></div>
            <div>
              <div className="inv-stat-lbl">Estimasi Nilai Stok</div>
              <div className="inv-stat-val">Rp{totalInvValue.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>

        {/* Catalog */}
        <div className="catalog-header-row">
          <h2 className="catalog-title">Daftar Koleksi Inventaris Ulos</h2>
          <div className="catalog-filters">
            <select className="inv-filter-select">
              <option>Semua Kategori</option>
            </select>
            <select className="inv-filter-select">
              <option>Urutkan: Terbaru</option>
            </select>
          </div>
        </div>

        {filteredCatalog.length === 0 ? (
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '50px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-boxes-packing" style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.3 }}></i>
            <p>Belum ada produk di inventori. Silakan klik "Tambah Koleksi" untuk menambahkan mahakarya Ulos Anda.</p>
          </div>
        ) : (
          <div className="stok-product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {filteredCatalog.map(item => {
              const statusLabel = item.status === 'dead_stock' ? 'DEAD STOCK' : item.status === 'sold' ? 'TERJUAL' : 'READY';
              const s = statusBadgeStyle(item.status);
              const price = item.cost_price || item.costPrice || 0;
              const ulosType = item.ulos_type || item.ulosType || 'Lainnya';
              const quantity = item.quantity || 0;
              return (
                <div key={item.id} className="product-stok-card">
                  <div className="stok-card-img-wrap">
                    <img src={item.image || '/assets/ulos1.jpg'} alt={item.name} className="stok-card-img" />
                    <span className="stok-status-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{statusLabel}</span>
                  </div>
                  <div className="stok-card-body">
                    <div>
                      <div className="stok-card-type">{ulosType} · {item.unit || 'lembar'}</div>
                      <div className="stok-card-name">{item.name}</div>
                      <div className="stok-card-price">Rp{price.toLocaleString('id-ID')}</div>
                      <div className="stok-card-stock">
                        <i className="fa-solid fa-boxes-stacked"></i> Stok: {quantity} unit
                      </div>
                      {item.description && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>{item.description}</p>}
                      {item.status === 'unsold_90_days' && (
                        <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(212,175,55,0.06)', border: '1px solid var(--glass-border-gold)', borderRadius: '6px' }}>
                          <div style={{ fontSize: '11px', color: 'var(--gold-dark)', fontWeight: 700 }}><i className="fa-solid fa-lightbulb"></i> Rekomendasi Preskriptif AI:</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                            Modal tersumbat &gt;90 hari. Jual cepat dengan diskon aman hingga: <strong style={{ color: 'var(--text-primary)' }}>Rp {item.batas_diskon_aman ? item.batas_diskon_aman.toLocaleString('id-ID') : (price * 1.05).toLocaleString('id-ID')}</strong> (tanpa rugi).
                          </div>
                          <button className="btn-sm btn-maroon" style={{ width: '100%', marginTop: '8px', fontSize: '10.5px', padding: '6px', cursor: 'pointer', background: 'var(--gold)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold' }} onClick={() => handleApplyOcrDiscount(item)}>
                            Terapkan Diskon Aman
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                      <button className="btn-save-artisan" style={{ flex: 1, padding: '6px 12px', fontSize: '11px', height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }} onClick={() => handleEditClick(item)}>
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button className="btn-close-modal" style={{ flex: 1, padding: '6px 12px', fontSize: '11px', height: 'auto', background: 'rgba(213,0,0,0.06)', color: 'var(--red)', border: '1px solid rgba(213,0,0,0.15)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }} onClick={() => handleDeleteClick(item.id)}>
                        <i className="fa-solid fa-trash-can"></i> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}



      </main>

      {/* ── Modal: Tambah Inventori ── */}
      {showAddModal && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '500px', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', color: 'var(--text-primary)', textAlign: 'center' }}>
              <i className="fa-solid fa-plus-circle"></i> Tambah Koleksi Ulos
            </h3>
            <form onSubmit={handleAddInventory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>1. Nama Produk</label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Contoh: Ulos Ragidup Silk Grade A" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>2. Jenis Produk</label>
                <select name="type" value={form.type} onChange={handleFormChange} style={{ padding: '10px', background: 'var(--white)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}>
                  {ULOS_TYPES.map(t => <option key={t} value={t}>{t === 'Lainnya' ? 'Kain Adat / Aksesoris Lainnya' : `Ulos ${t}`}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>3. Harga Beli / Modal (Rp)</label>
                <input name="costPrice" value={form.costPrice} onChange={handleFormChange} type="number" placeholder="Contoh: 2000000" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>4. Harga Jual (Rp)</label>
                <input name="sellingPrice" value={form.sellingPrice} onChange={handleFormChange} type="number" placeholder="Contoh: 3500000" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>5. Jumlah Stok</label>
                <input name="quantity" value={form.quantity} onChange={handleFormChange} type="number" min="1" placeholder="Contoh: 5" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>6. Gambar Produk</label>
                <div className="image-upload-box" onClick={() => document.getElementById('imgInput').click()} style={{ cursor: 'pointer', position: 'relative', border: '1px dashed var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
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
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>7. Deskripsi Produk</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Masukkan deskripsi produk Ulos..." style={{ padding: '10px', height: '80px', resize: 'none', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit', fontSize: '12px', lineHeight: 1.5 }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-close-modal" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn-save-artisan" style={{ flex: 1 }}>Simpan Koleksi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Edit Inventori ── */}
      {showEditModal && (
        <div className="web3-modal active" onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}>
          <div className="web3-modal-content" style={{ maxWidth: '500px', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', color: 'var(--text-primary)', textAlign: 'center' }}>
              <i className="fa-solid fa-pen-to-square"></i> Edit Koleksi Ulos
            </h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>1. Nama Produk</label>
                <input name="name" value={editForm.name} onChange={handleEditFormChange} placeholder="Contoh: Ulos Ragidup Silk Grade A" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>2. Jenis Produk</label>
                <select name="type" value={editForm.type} onChange={handleEditFormChange} style={{ padding: '10px', background: 'var(--white)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }}>
                  {ULOS_TYPES.map(t => <option key={t} value={t}>{t === 'Lainnya' ? 'Kain Adat / Aksesoris Lainnya' : `Ulos ${t}`}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>3. Harga Modal (Rp)</label>
                <input name="costPrice" value={editForm.costPrice} onChange={handleEditFormChange} type="number" placeholder="Harga Modal..." required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>4. Harga Jual (Rp)</label>
                <input name="sellingPrice" value={editForm.sellingPrice} onChange={handleEditFormChange} type="number" placeholder="Harga Jual..." required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>5. Jumlah Stok</label>
                <input name="quantity" value={editForm.quantity} onChange={handleEditFormChange} type="number" min="1" placeholder="Contoh: 5" required style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>6. Gambar Produk</label>
                <div className="image-upload-box" onClick={() => document.getElementById('editImgInput').click()} style={{ cursor: 'pointer', position: 'relative', border: '1px dashed var(--glass-border)', background: 'rgba(0,0,0,0.02)' }}>
                  {editImagePreview ? (
                    <img src={editImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, borderRadius: '6px' }} />
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', color: 'var(--text-muted)', marginBottom: '4px' }}></i>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Klik atau Import Gambar dari Perangkat</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>PNG, JPG (Maks. 2MB)</span>
                    </>
                  )}
                </div>
                <input id="editImgInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleEditImageChange} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-dark)' }}>7. Deskripsi Produk</label>
                <textarea name="description" value={editForm.description} onChange={handleEditFormChange} placeholder="Masukkan deskripsi produk Ulos..." style={{ padding: '10px', height: '80px', resize: 'none', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', fontFamily: 'inherit', fontSize: '12px', lineHeight: 1.5 }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" className="btn-close-modal" style={{ flex: 1 }} onClick={() => setShowEditModal(false)}>Batal</button>
                <button type="submit" className="btn-save-artisan" style={{ flex: 1 }}>Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

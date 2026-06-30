import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';

/**
 * Shared Topbar component — used on all pages.
 * Props:
 *   searchPlaceholder  — string for the search input placeholder
 *   onSearch           — optional callback for search input changes
 *   exportLabel        — optional label for export button (default "Export Data")
 *   onExport           — optional callback for export button click
 */
export default function Topbar({
  searchPlaceholder = 'Cari data...',
  onSearch,
  exportLabel = 'Export Data',
  onExport,
}) {
  const navigate = useNavigate();
  const { wallet, connectWallet, disconnectWallet } = useBlockchain();
  const [searchValue, setSearchValue] = useState('');
  const [connecting, setConnecting] = useState(false);

  const shortAddress = wallet.connected && wallet.address
    ? wallet.address.substring(0, 6) + '...' + wallet.address.substring(wallet.address.length - 4)
    : null;

  const handleWalletClick = async () => {
    if (wallet.connected) {
      disconnectWallet();
    } else {
      setConnecting(true);
      try { await connectWallet(); }
      catch (err) { alert('Koneksi gagal: ' + err.message); }
      finally { setConnecting(false); }
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleExport = () => {
    if (onExport) onExport();
    else alert('Data berhasil diekspor!');
  };

  return (
    <header className="topbar-v2">
      {/* ── LEFT: Logo ── */}
      <div className="topbar-v2-left">
        <a
          href="/"
          className="topbar-v2-logo"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
        >
          SianAI <span className="topbar-v2-logo-badge">WEB3</span>
        </a>
      </div>

      {/* ── RIGHT: Wallet + Search + Bell + User + Export ── */}
      <div className="topbar-v2-right">
        {/* Wallet Button */}
        <button
          className={`topbar-v2-wallet${wallet.connected ? ' connected' : ''}`}
          onClick={handleWalletClick}
          disabled={connecting}
        >
          {connecting ? (
            <><i className="fa-solid fa-spinner fa-spin"></i> Menghubungkan...</>
          ) : wallet.connected ? (
            <><i className="fa-solid fa-circle-check"></i> {shortAddress}</>
          ) : (
            <><i className="fa-solid fa-wallet"></i> Hubungkan Dompet</>
          )}
        </button>

        {/* Search */}
        <div className="topbar-v2-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearch}
          />
        </div>

        {/* Bell */}
        <button className="topbar-v2-bell" title="Notifikasi">
          <i className="fa-regular fa-bell"></i>
          <span className="topbar-v2-bell-dot"></span>
        </button>

        {/* User Profile */}
        <div className="topbar-v2-user" onClick={() => navigate('/akun')}>
          <div className="topbar-v2-user-text">
            <span className="topbar-v2-username">Penenun123</span>
            <span className="topbar-v2-userrole">PEMILIK USAHA</span>
          </div>
          <div className="topbar-v2-avatar">PE</div>
          <i className="fa-solid fa-chevron-down topbar-v2-chevron"></i>
        </div>

        {/* Export */}
        <button className="topbar-v2-export" onClick={handleExport}>
          <i className="fa-solid fa-download"></i>
          <span>{exportLabel}</span>
        </button>
      </div>
    </header>
  );
}

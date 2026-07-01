import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

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
  const [searchValue, setSearchValue] = useState('');

  const userObj = (() => {
    try {
      const u = localStorage.getItem('sianai_user');
      return u ? JSON.parse(u) : {};
    } catch {
      return {};
    }
  })();

  const initials = userObj.name
    ? userObj.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PE';

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
          SianAI
        </a>
      </div>

      {/* ── RIGHT: User Profile Only ── */}
      <div className="topbar-v2-right">
        {/* User Profile */}
        <div className="topbar-v2-user" onClick={() => navigate('/akun')}>
          <div className="topbar-v2-user-text">
            <span className="topbar-v2-username">{userObj.name || 'Penenun123'}</span>
            <span className="topbar-v2-userrole">PEMILIK USAHA</span>
          </div>
          <div className="topbar-v2-avatar">{initials}</div>
          <i className="fa-solid fa-chevron-down topbar-v2-chevron"></i>
        </div>
      </div>
    </header>
  );
}

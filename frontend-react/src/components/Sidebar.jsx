import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const navLinks = [
  { to: '/dashboard', icon: 'fa-solid fa-house', label: 'Beranda', end: true },
  { to: '/laporan', icon: 'fa-solid fa-chart-simple', label: 'Laporan Keuangan' },
  { to: '/stok', icon: 'fa-solid fa-box', label: 'Inventory' },
  { to: '/chatbot', icon: 'fa-solid fa-comments', label: 'Tanya Adat (AI)' },
  { to: '/forecasting', icon: 'fa-solid fa-arrow-trend-up', label: 'Forecasting' },
  { to: '/akun', icon: 'fa-regular fa-user', label: 'Manajemen Akun' },
];

export default function Sidebar() {
  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('sianai_auth_token');
    localStorage.removeItem('sianai_user');
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/sianailogo.png" alt="SianAI Logo" className="sidebar-logo-img" />
      </div>

      <ul className="nav-menu" style={{ listStyle: 'none', padding: 0 }}>
        {navLinks.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <i className={link.icon}></i> {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-bottom">
        <a href="#" className="nav-item">
          <i className="fa-regular fa-circle-question"></i> Support
        </a>
        <a href="#" className="nav-item" onClick={handleSignOut}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
        </a>
      </div>
    </aside>
  );
}

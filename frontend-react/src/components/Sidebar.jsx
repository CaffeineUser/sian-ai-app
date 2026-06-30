import { NavLink, useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';

const navLinks = [
  { to: '/', icon: 'fa-solid fa-house', label: 'Beranda', end: true },
  { to: '/laporan', icon: 'fa-solid fa-chart-simple', label: 'Laporan Keuangan' },
  { to: '/stok', icon: 'fa-solid fa-box', label: 'Inventory' },
  { to: '/akun', icon: 'fa-regular fa-user', label: 'Manajemen Akun' },
  { to: '/forecasting', icon: 'fa-solid fa-arrow-trend-up', label: 'Forecasting' },
  { to: '/settings', icon: 'fa-solid fa-gear', label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { wallet, connectWallet, disconnectWallet } = useBlockchain();

  const handleFotoNota = () => navigate('/laporan?open_camera=true');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/assets/sianailogo.png" alt="SianAI Logo" className="sidebar-logo-img" />
      </div>

      <ul className="nav-menu">
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
        <button className="btn-foto-nota" onClick={handleFotoNota}>
          <i className="fa-solid fa-camera"></i> Foto Nota
        </button>
        <a href="#" className="nav-item">
          <i className="fa-regular fa-circle-question"></i> Support
        </a>
        <a href="#" className="nav-item">
          <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
        </a>
      </div>
    </aside>
  );
}

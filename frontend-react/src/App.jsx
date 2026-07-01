import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Sidebar from './components/Sidebar';
import AmbientBackground from './components/AmbientBackground';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import Laporan from './pages/Laporan';
import Stok from './pages/Stok';
import Akun from './pages/Akun';
import Chatbot from './pages/Chatbot';
import Forecasting from './pages/Forecasting';

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('sianai_auth_token');

  // Check if we are on landing or login page
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';

  return isAuthPage ? (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  ) : (
    <div className="app-layout">
      <Sidebar />
      <Routes>
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={token ? <Beranda /> : <Navigate to="/login" />} />
        <Route path="/laporan" element={token ? <Laporan /> : <Navigate to="/login" />} />
        <Route path="/stok" element={token ? <Stok /> : <Navigate to="/login" />} />
        <Route path="/akun" element={token ? <Akun /> : <Navigate to="/login" />} />
        <Route path="/chatbot" element={token ? <Chatbot /> : <Navigate to="/login" />} />
        <Route path="/forecasting" element={token ? <Forecasting /> : <Navigate to="/login" />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AmbientBackground />
        <AppContent />
      </DataProvider>
    </BrowserRouter>
  );
}

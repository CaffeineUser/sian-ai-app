import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlockchainProvider } from './context/BlockchainContext';
import Sidebar from './components/Sidebar';
import AmbientBackground from './components/AmbientBackground';
import Beranda from './pages/Beranda';
import Laporan from './pages/Laporan';
import Stok from './pages/Stok';
import Akun from './pages/Akun';
import Forecasting from './pages/Forecasting';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <BlockchainProvider>
        <AmbientBackground />
        <div className="app-layout">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/stok" element={<Stok />} />
            <Route path="/akun" element={<Akun />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </BlockchainProvider>
    </BrowserRouter>
  );
}

import { useData } from '../context/DataContext';

export default function WalletButton() {
  const { wallet, connectWallet, disconnectWallet } = useData();

  const handleClick = async () => {
    if (wallet.connected) {
      disconnectWallet();
    } else {
      try {
        await connectWallet();
      } catch (err) {
        alert('Koneksi gagal: ' + err.message);
      }
    }
  };

  const shortAddress = wallet.connected && wallet.address
    ? wallet.address.substring(0, 6) + '...' + wallet.address.substring(wallet.address.length - 4)
    : null;

  return (
    <button
      className={`btn-wallet-connect${wallet.connected ? ' connected' : ''}`}
      onClick={handleClick}
    >
      {wallet.connected ? (
        <>
          <i className="fa-solid fa-circle-check" style={{ color: 'var(--green)' }}></i>
          {shortAddress} ({wallet.network})
        </>
      ) : (
        <>
          <i className="fa-solid fa-wallet"></i> Hubungkan Dompet
        </>
      )}
    </button>
  );
}

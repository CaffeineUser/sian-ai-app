import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ────────────────────────────────────────────────────────
//  SianAI Blockchain Core (ported from blockchain.js)
// ────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  LEDGER: 'sianai_blockchain_ledger',
  WALLET: 'sianai_wallet_state',
  PENDING: 'sianai_pending_txs',
  CERTIFICATES: 'sianai_ulos_certificates',
  TRANSACTIONS: 'sianai_transactions',
};

const SEED_TRANSACTIONS = [
  { id: 'tx-1', name: 'Ulos Ragidup Silk Grade A', type: 'income', category: 'Penjualan Produk', amount: 3500000, date: '2026-06-22', time: '14:20', status: 'Selesai' },
  { id: 'tx-2', name: 'Pembelian Benang Sutra Mas (50 Roll)', type: 'expense', category: 'Bahan Baku', amount: 850000, date: '2026-06-22', time: '10:05', status: 'Diproses' },
  { id: 'tx-3', name: 'Pembelian Benang Katun (100 Roll)', type: 'expense', category: 'Bahan Baku', amount: 1700000, date: '2026-06-21', time: '17:05', status: 'Diproses' },
  { id: 'tx-4', name: 'Ulos Ragihotang Handwoven Custom', type: 'income', category: 'Penjualan Produk', amount: 1800000, date: '2026-06-21', time: '16:45', status: 'Selesai' },
  { id: 'tx-5', name: 'Ulos Mangiring Handwoven Custom', type: 'income', category: 'Penjualan Produk', amount: 800000, date: '2026-06-21', time: '10:45', status: 'Selesai' },
  { id: 'tx-6', name: 'Ulos Sibolang Handwoven Custom', type: 'income', category: 'Penjualan Produk', amount: 1200000, date: '2026-06-20', time: '09:45', status: 'Selesai' },
  { id: 'tx-7', name: 'Sewa Booth Pameran Craftina', type: 'expense', category: 'Marketing', amount: 5000000, date: '2026-06-18', time: '11:00', status: 'Diproses' },
  { id: 'tx-8', name: 'Tagihan Listrik Workshop (Jan)', type: 'expense', category: 'Operasional', amount: 850000, date: '2026-06-15', time: '15:30', status: 'Selesai' },
];

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getRawLedger() {
  const data = localStorage.getItem(STORAGE_KEYS.LEDGER);
  return data ? JSON.parse(data) : [];
}

function getStoredTransactions() {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : null;
}

function getStoredWallet() {
  const data = localStorage.getItem(STORAGE_KEYS.WALLET);
  return data ? JSON.parse(data) : { connected: false, address: null, network: 'SianAI DevNet Sandbox', balance: '0.00 ETH' };
}

function getStoredCerts() {
  const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
  return data ? JSON.parse(data) : {};
}

// ────────────────────────────────────────────────────────
//  Context
// ────────────────────────────────────────────────────────
const BlockchainContext = createContext(null);

export function BlockchainProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [wallet, setWallet] = useState(getStoredWallet);
  const [certificates, setCertificates] = useState(getStoredCerts);
  const [inventory, setInventory] = useState([]);

  // ── Seed & Init ──────────────────────────────────────
  useEffect(() => {
    // Seed transactions if not exist
    const stored = getStoredTransactions();
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
      setTransactions(SEED_TRANSACTIONS);
    } else {
      setTransactions(stored);
    }

    // Init genesis block if not exist
    const initLedger = async () => {
      let ledgerData = getRawLedger();
      if (ledgerData.length === 0) {
        const genesisBlock = {
          index: 0,
          timestamp: new Date('2026-06-01T00:00:00Z').getTime(),
          txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          payload: { message: 'SianAI Genesis Block — Batak Cultural Heritage Ledger Initialized', network: 'SianAI DevNet Sandbox v1.0', difficulty: '0x1' },
          gasUsed: 0,
          miner: '0x0000000000000000000000000000000000000000',
          hash: '',
        };
        genesisBlock.hash = await sha256(JSON.stringify(genesisBlock));
        ledgerData = [genesisBlock];
        localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(ledgerData));
      }
      setLedger(ledgerData);
    };
    initLedger();

    // Load inventory
    const storedInv = localStorage.getItem('sianai_inventory');
    if (storedInv) setInventory(JSON.parse(storedInv));
  }, []);

  // ── Helpers ──────────────────────────────────────────
  const saveTransactions = useCallback((txs) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    setTransactions(txs);
  }, []);

  const saveLedger = useCallback((newLedger) => {
    localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(newLedger));
    setLedger([...newLedger]);
  }, []);

  const saveWallet = useCallback((state) => {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(state));
    setWallet({ ...state });
  }, []);

  const saveCerts = useCallback((certs) => {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
    setCertificates({ ...certs });
  }, []);

  const saveInventory = useCallback((items) => {
    localStorage.setItem('sianai_inventory', JSON.stringify(items));
    setInventory([...items]);
  }, []);

  // ── Computed ─────────────────────────────────────────
  const stats = (() => {
    const baseBalance = 42850000;
    let income = 0, expense = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });
    return { balance: baseBalance + income - expense, income, expense };
  })();

  const isTransactionSynced = useCallback((txId) => {
    return ledger.find(b => b.payload && b.payload.id === txId) || null;
  }, [ledger]);

  // ── Wallet Actions ────────────────────────────────────
  const connectWallet = useCallback(async () => {
    const hasMetaMask = typeof window.ethereum !== 'undefined';
    if (hasMetaMask) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      let networkName = 'Ethereum Mainnet';
      if (chainId === '0xaa36a7') networkName = 'Sepolia Testnet';
      else if (chainId === '0x5') networkName = 'Goerli Testnet';
      else if (chainId === '0x13881') networkName = 'Polygon Mumbai';
      else if (chainId !== '0x1') networkName = 'Unknown Web3 Network';
      let balanceVal = '1.45 ETH';
      try {
        const rawBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] });
        const eth = (parseInt(rawBalance, 16) / 1e18).toFixed(4);
        balanceVal = `${eth} ETH`;
      } catch (_) {}
      const state = { connected: true, address, network: networkName, balance: balanceVal, isRealMetaMask: true };
      saveWallet(state);
      return state;
    } else {
      const state = { connected: true, address: '0x71C246d89547d287661849202685933f92de3A39', network: 'SianAI DevNet Sandbox', balance: '10.00 DEV', isRealMetaMask: false };
      saveWallet(state);
      return state;
    }
  }, [saveWallet]);

  const disconnectWallet = useCallback(() => {
    const state = { connected: false, address: null, network: 'SianAI DevNet Sandbox', balance: '0.00 ETH', isRealMetaMask: false };
    saveWallet(state);
  }, [saveWallet]);

  // ── Blockchain Write ──────────────────────────────────
  const writeTransaction = useCallback(async (txData, onStatus = () => {}) => {
    if (!wallet.connected) throw new Error('Dompet belum terhubung!');
    const payload = {
      id: txData.id || `TX-${Date.now()}`,
      description: txData.name || 'Transaksi SianAI',
      amount: txData.amount || 0,
      type: txData.type || 'expense',
      category: txData.category || 'Lainnya',
      date: txData.date || new Date().toISOString().split('T')[0],
      merchantAddress: wallet.address,
    };
    onStatus('PREPARING', { message: 'Mempersiapkan data transaksi...' });
    await new Promise(r => setTimeout(r, 1000));
    const gasEstimate = Math.floor(21000 + Math.random() * 25000);
    onStatus('SIGNING', { message: 'Menunggu tanda tangan kriptografis...', payload });
    let signature = '';
    if (wallet.isRealMetaMask && window.ethereum) {
      const hashPayload = await sha256(JSON.stringify(payload));
      const msg = `SianAI Ledger Entry Verification:\nTXID: ${payload.id}\nNominal: Rp ${payload.amount.toLocaleString('id-ID')}\nHash: ${hashPayload}`;
      signature = await window.ethereum.request({ method: 'personal_sign', params: [msg, wallet.address] });
    } else {
      await new Promise(r => setTimeout(r, 1200));
      signature = '0x' + (await sha256(JSON.stringify(payload) + wallet.address + Date.now())).substring(0, 130);
    }
    onStatus('BROADCASTING', { message: 'Menyiarkan transaksi ke mempool...', gasLimit: gasEstimate });
    await new Promise(r => setTimeout(r, 800));
    onStatus('MINING', { message: 'Menambang blok di Sandbox...' });
    await new Promise(r => setTimeout(r, 1500));
    const currentLedger = getRawLedger();
    const prevBlock = currentLedger[currentLedger.length - 1];
    const newIndex = prevBlock.index + 1;
    const timestamp = Date.now();
    const txHash = '0x' + await sha256(signature + timestamp);
    const newBlock = { index: newIndex, timestamp, txHash, previousHash: prevBlock.hash, payload, gasUsed: gasEstimate, miner: wallet.isRealMetaMask ? '0x821F...221b (Pool)' : '0x71c2...3a39 (Self)', signature, hash: '' };
    newBlock.hash = await sha256(JSON.stringify(newBlock));
    currentLedger.push(newBlock);
    saveLedger(currentLedger);
    onStatus('CONFIRMED', { message: 'Ledger berhasil diamankan ke blockchain!', blockNumber: newIndex, txHash, gasUsed: gasEstimate });
    return newBlock;
  }, [wallet, saveLedger]);

  // ── Add Transaction ───────────────────────────────────
  const addTransaction = useCallback((tx) => {
    const newTx = { id: `tx-${Date.now()}`, ...tx };
    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    return newTx;
  }, [transactions, saveTransactions]);

  // ── Mint Certificate ──────────────────────────────────
  const mintUlosCertificate = useCallback(async (itemData, onStatus = () => {}) => {
    if (!wallet.connected) throw new Error('Dompet belum terhubung!');
    onStatus('PREPARING', { message: 'Menyusun metadata ERC-721...' });
    await new Promise(r => setTimeout(r, 800));
    const tokenId = Math.floor(100000 + Math.random() * 900000);
    const payload = { certificateType: 'Authenticity Token (ERC-721)', tokenId, ulosName: itemData.name, ulosType: itemData.ulosType || 'Sadum', costPrice: itemData.costPrice || 0, dateAdded: itemData.dateAdded || new Date().toISOString().split('T')[0], origin: 'UMKM Tenun Ulos Batak - SianAI Heritage', ownerAddress: wallet.address };
    onStatus('SIGNING', { message: 'Menyetujui Mint Sertifikat...' });
    let signature = '';
    if (wallet.isRealMetaMask && window.ethereum) {
      const msg = `SianAI Mint Certificate Token ID: ${tokenId}\nProduct: ${itemData.name}`;
      signature = await window.ethereum.request({ method: 'personal_sign', params: [msg, wallet.address] });
    } else {
      await new Promise(r => setTimeout(r, 1000));
      signature = '0x' + (await sha256(JSON.stringify(payload) + wallet.address)).substring(0, 130);
    }
    onStatus('MINING', { message: 'Minting NFT di blockchain...' });
    await new Promise(r => setTimeout(r, 1600));
    const currentLedger = getRawLedger();
    const prevBlock = currentLedger[currentLedger.length - 1];
    const newIndex = prevBlock.index + 1;
    const timestamp = Date.now();
    const txHash = '0x' + await sha256(signature + timestamp);
    const newBlock = { index: newIndex, timestamp, txHash, previousHash: prevBlock.hash, payload, gasUsed: 85000, miner: '0x71c2...3a39', signature, hash: '' };
    newBlock.hash = await sha256(JSON.stringify(newBlock));
    currentLedger.push(newBlock);
    saveLedger(currentLedger);
    const certKey = itemData.id || itemData.name;
    const newCerts = { ...certificates, [certKey]: { tokenId, txHash, blockNumber: newIndex, timestamp, ownerAddress: wallet.address, signature } };
    saveCerts(newCerts);
    onStatus('CONFIRMED', { message: 'Sertifikat berhasil dicetak!', tokenId, blockNumber: newIndex, txHash });
    return newCerts[certKey];
  }, [wallet, saveLedger, certificates, saveCerts]);

  return (
    <BlockchainContext.Provider value={{
      transactions, ledger, wallet, certificates, inventory,
      stats, isTransactionSynced,
      connectWallet, disconnectWallet,
      addTransaction, writeTransaction, mintUlosCertificate,
      saveInventory,
    }}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchain() {
  const ctx = useContext(BlockchainContext);
  if (!ctx) throw new Error('useBlockchain must be used within BlockchainProvider');
  return ctx;
}

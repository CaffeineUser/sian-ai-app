/**
 * SianAI Blockchain Ledger Service
 * Menyediakan integrasi Web3 Dompet (MetaMask) dan node simulasi lokal (SianAI DevNet Sandbox)
 * menggunakan LocalStorage untuk persistensi multi-halaman.
 */

class SianAIBlockchain {
    constructor() {
        this.storageKeyLedger = 'sianai_blockchain_ledger';
        this.storageKeyWallet = 'sianai_wallet_state';
        this.storageKeyPending = 'sianai_pending_txs';
        this.storageKeyCertificates = 'sianai_ulos_certificates';
        this.storageKeyTransactions = 'sianai_transactions';
        
        this.initializeLedger();
        this.seedTransactions();
    }

    // --- ENKRIPSI / HASHING SEDERHANA SHA-256 ---
    async sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // --- INISIALISASI LEDGER ---
    async initializeLedger() {
        let ledger = this.getRawLedger();
        if (!ledger || ledger.length === 0) {
            // Buat Genesis Block (Blok Perdana)
            const genesisBlock = {
                index: 0,
                timestamp: new Date('2026-06-01T00:00:00Z').getTime(),
                txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                payload: {
                    message: "SianAI Genesis Block — Batak Cultural Heritage Ledger Initialized",
                    network: "SianAI DevNet Sandbox v1.0",
                    difficulty: "0x1"
                },
                gasUsed: 0,
                miner: "0x0000000000000000000000000000000000000000",
                hash: ''
            };
            genesisBlock.hash = await this.sha256(JSON.stringify(genesisBlock));
            this.saveLedger([genesisBlock]);
        }
    }

    // --- SEED TRANSACTION DATABASE ---
    seedTransactions() {
        let txs = localStorage.getItem(this.storageKeyTransactions);
        if (!txs) {
            const initialTxs = [
                { id: 'tx-1', name: 'Ulos Ragidup Silk Grade A', type: 'income', category: 'Penjualan Produk', amount: 3500000, date: '2026-06-22', time: '14:20', status: 'Selesai' },
                { id: 'tx-2', name: 'Pembelian Benang Sutra Mas (50 Roll)', type: 'expense', category: 'Bahan Baku', amount: 850000, date: '2026-06-22', time: '10:05', status: 'Diproses' },
                { id: 'tx-3', name: 'Pembelian Benang Katun (100 Roll)', type: 'expense', category: 'Bahan Baku', amount: 1700000, date: '2026-06-21', time: '17:05', status: 'Diproses' },
                { id: 'tx-4', name: 'Ulos Ragihotang Handwoven Custom', type: 'income', category: 'Penjualan Produk', amount: 1800000, date: '2026-06-21', time: '16:45', status: 'Selesai' },
                { id: 'tx-5', name: 'Ulos Mangiring Handwoven Custom', type: 'income', category: 'Penjualan Produk', amount: 800000, date: '2026-06-21', time: '10:45', status: 'Selesai' },
                { id: 'tx-6', name: 'Ulos Sibolang Handwoven Custom', type: 'income', category: 'Penjualan Produk', amount: 1200000, date: '2026-06-20', time: '09:45', status: 'Selesai' },
                { id: 'tx-7', name: 'Sewa Booth Pameran Craftina', type: 'expense', category: 'Marketing', amount: 5000000, date: '2026-06-18', time: '11:00', status: 'Diproses' },
                { id: 'tx-8', name: 'Tagihan Listrik Workshop (Jan)', type: 'expense', category: 'Operasional', amount: 850000, date: '2026-06-15', time: '15:30', status: 'Selesai' }
            ];
            localStorage.setItem(this.storageKeyTransactions, JSON.stringify(initialTxs));
        }
    }

    // --- DATABASE UTILITIES ---
    getRawLedger() {
        const data = localStorage.getItem(this.storageKeyLedger);
        return data ? JSON.parse(data) : [];
    }

    saveLedger(ledger) {
        localStorage.setItem(this.storageKeyLedger, JSON.stringify(ledger));
        window.dispatchEvent(new Event('sianai_blockchain_updated'));
    }

    getTransactions() {
        const data = localStorage.getItem(this.storageKeyTransactions);
        return data ? JSON.parse(data) : [];
    }

    saveTransactions(txs) {
        localStorage.setItem(this.storageKeyTransactions, JSON.stringify(txs));
        window.dispatchEvent(new Event('sianai_transactions_updated'));
    }

    getPendingTransactions() {
        const data = localStorage.getItem(this.storageKeyPending);
        return data ? JSON.parse(data) : [];
    }

    savePendingTransactions(txs) {
        localStorage.setItem(this.storageKeyPending, JSON.stringify(txs));
    }

    getUlosCertificates() {
        const data = localStorage.getItem(this.storageKeyCertificates);
        return data ? JSON.parse(data) : {};
    }

    saveUlosCertificates(certs) {
        localStorage.setItem(this.storageKeyCertificates, JSON.stringify(certs));
        window.dispatchEvent(new Event('sianai_certs_updated'));
    }

    // --- METAMASK / WALLET UTILITIES ---
    async checkMetaMaskInstallation() {
        return typeof window.ethereum !== 'undefined';
    }

    getWalletState() {
        const data = localStorage.getItem(this.storageKeyWallet);
        return data ? JSON.parse(data) : {
            connected: false,
            address: null,
            network: 'SianAI DevNet Sandbox',
            balance: '0.00 ETH'
        };
    }

    saveWalletState(state) {
        localStorage.setItem(this.storageKeyWallet, JSON.stringify(state));
        window.dispatchEvent(new Event('sianai_wallet_updated'));
    }

    async connectWallet() {
        const hasMetaMask = await this.checkMetaMaskInstallation();
        
        if (hasMetaMask) {
            try {
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
                    const rawBalance = await window.ethereum.request({
                        method: 'eth_getBalance',
                        params: [address, 'latest']
                    });
                    const wei = parseInt(rawBalance, 16);
                    const eth = (wei / 1e18).toFixed(4);
                    balanceVal = `${eth} ETH`;
                } catch (e) {
                    console.log("Gagal mengambil balance asli, menggunakan simulasi:", e);
                }

                const state = {
                    connected: true,
                    address: address,
                    network: networkName,
                    balance: balanceVal,
                    isRealMetaMask: true
                };
                
                this.saveWalletState(state);
                return state;
            } catch (error) {
                console.error("User menolak koneksi MetaMask:", error);
                throw error;
            }
        } else {
            const mockAddress = '0x71C246d89547d287661849202685933f92de3A39';
            const state = {
                connected: true,
                address: mockAddress,
                network: 'SianAI DevNet Sandbox',
                balance: '10.00 DEV',
                isRealMetaMask: false
            };
            this.saveWalletState(state);
            return state;
        }
    }

    disconnectWallet() {
        const state = {
            connected: false,
            address: null,
            network: 'SianAI DevNet Sandbox',
            balance: '0.00 ETH',
            isRealMetaMask: false
        };
        this.saveWalletState(state);
        return state;
    }

    // --- TRANSAKSI LEDGER BLOCKCHAIN ---
    
    isTransactionSynced(txId) {
        const ledger = this.getRawLedger();
        return ledger.find(block => block.payload && block.payload.id === txId) || null;
    }

    async writeTransaction(txData, onStatusCallback = () => {}) {
        const wallet = this.getWalletState();
        if (!wallet.connected) {
            throw new Error("Dompet belum terhubung! Silakan hubungkan dompet Anda terlebih dahulu.");
        }

        const payload = {
            id: txData.id || `TX-${Date.now()}`,
            description: txData.name || txData.description || 'Transaksi SianAI',
            amount: txData.amount || txData.nominal || 0,
            type: txData.type || 'expense',
            category: txData.category || 'Lainnya',
            date: txData.date || new Date().toISOString().split('T')[0],
            merchantAddress: wallet.address
        };

        // STEP 1: Persiapan data
        onStatusCallback('PREPARING', { message: 'Mempersiapkan data transaksi & menghitung estimasi gas...' });
        await new Promise(r => setTimeout(r, 1000));

        const gasEstimate = Math.floor(21000 + Math.random() * 25000);
        
        // STEP 2: Tanda tangan dompet
        onStatusCallback('SIGNING', { 
            message: 'Menunggu tanda tangan kriptografis dari dompet...',
            payload: payload 
        });

        let signature = '';
        if (wallet.isRealMetaMask && window.ethereum) {
            try {
                const hashPayload = await this.sha256(JSON.stringify(payload));
                const messageToSign = `SianAI Ledger Entry Verification:\nTXID: ${payload.id}\nNominal: Rp ${payload.amount.toLocaleString('id-ID')}\nHash: ${hashPayload}`;
                signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [messageToSign, wallet.address]
                });
            } catch (err) {
                console.error("MetaMask signature rejected:", err);
                throw new Error("Penandatanganan dibatalkan oleh pengguna.");
            }
        } else {
            await new Promise(r => setTimeout(r, 1200));
            signature = '0x' + (await this.sha256(JSON.stringify(payload) + wallet.address + Date.now())).substring(0, 130);
        }

        // STEP 3: Penyiaran ke Jaringan
        onStatusCallback('BROADCASTING', { 
            message: 'Menyiarkan transaksi ke antrean mempool...',
            gasLimit: gasEstimate,
            signature: signature
        });
        await new Promise(r => setTimeout(r, 800));

        // STEP 4: Menambang Blok
        onStatusCallback('MINING', { message: 'Transaksi masuk blok baru. Menambang blok di Sandbox...' });
        await new Promise(r => setTimeout(r, 1500));

        const ledger = this.getRawLedger();
        const previousBlock = ledger[ledger.length - 1];
        const newIndex = previousBlock.index + 1;
        const timestamp = Date.now();
        const txHash = '0x' + await this.sha256(signature + timestamp);

        const newBlock = {
            index: newIndex,
            timestamp: timestamp,
            txHash: txHash,
            previousHash: previousBlock.hash,
            payload: payload,
            gasUsed: gasEstimate,
            miner: wallet.isRealMetaMask ? '0x821F...221b (Pool)' : '0x71c2...3a39 (Self-Miners)',
            signature: signature,
            hash: ''
        };

        newBlock.hash = await this.sha256(JSON.stringify(newBlock));
        ledger.push(newBlock);
        this.saveLedger(ledger);

        // Potong saldo simulated jika sandbox
        if (!wallet.isRealMetaMask) {
            const currentBal = parseFloat(wallet.balance.split(' ')[0]);
            const gasCost = (gasEstimate * 0.000005);
            const newBal = (currentBal - gasCost).toFixed(4);
            wallet.balance = `${newBal} DEV`;
            this.saveWalletState(wallet);
        }

        onStatusCallback('CONFIRMED', { 
            message: 'Ledger berhasil diamankan ke blockchain!',
            blockNumber: newIndex,
            txHash: txHash,
            gasUsed: gasEstimate
        });

        return newBlock;
    }

    // --- MINT SERTIFIKAT KEASLIAN ULOS (NFT) ---
    async mintUlosCertificate(itemData, onStatusCallback = () => {}) {
        const wallet = this.getWalletState();
        if (!wallet.connected) {
            throw new Error("Dompet belum terhubung! Silakan hubungkan dompet Anda terlebih dahulu.");
        }

        onStatusCallback('PREPARING', { message: 'Menyusun sertifikat keaslian metadata ERC-721...' });
        await new Promise(r => setTimeout(r, 800));

        const tokenId = Math.floor(100000 + Math.random() * 900000);
        const payload = {
            certificateType: "Authenticity Token (ERC-721)",
            tokenId: tokenId,
            ulosName: itemData.name,
            ulosType: itemData.ulosType || 'Sadum',
            costPrice: itemData.costPrice || itemData.amount || 0,
            dateAdded: itemData.dateAdded || new Date().toISOString().split('T')[0],
            origin: "UMKM Tenun Ulos Batak - SianAI Heritage",
            ownerAddress: wallet.address
        };

        onStatusCallback('SIGNING', { message: 'Menyetujui transaksi Mint Sertifikat Keaslian...' });
        
        let signature = '';
        if (wallet.isRealMetaMask && window.ethereum) {
            try {
                const messageToSign = `SianAI Mint Certificate Token ID: ${tokenId}\nProduct: ${itemData.name}`;
                signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [messageToSign, wallet.address]
                });
            } catch (err) {
                throw new Error("Transaksi dibatalkan oleh pengguna.");
            }
        } else {
            await new Promise(r => setTimeout(r, 1000));
            signature = '0x' + (await this.sha256(JSON.stringify(payload) + wallet.address)).substring(0, 130);
        }

        onStatusCallback('MINING', { message: 'Proses pencetakan sertifikat (Minting NFT) di blockchain...' });
        await new Promise(r => setTimeout(r, 1600));

        const ledger = this.getRawLedger();
        const previousBlock = ledger[ledger.length - 1];
        const newIndex = previousBlock.index + 1;
        const timestamp = Date.now();
        const txHash = '0x' + await this.sha256(signature + timestamp);

        const newBlock = {
            index: newIndex,
            timestamp: timestamp,
            txHash: txHash,
            previousHash: previousBlock.hash,
            payload: payload,
            gasUsed: 85000,
            miner: wallet.isRealMetaMask ? '0x821F...221b (Pool)' : '0x71c2...3a39 (Self-Miners)',
            signature: signature,
            hash: ''
        };

        newBlock.hash = await this.sha256(JSON.stringify(newBlock));
        ledger.push(newBlock);
        this.saveLedger(ledger);

        const certs = this.getUlosCertificates();
        certs[itemData.id || itemData.name] = {
            tokenId: tokenId,
            txHash: txHash,
            blockNumber: newIndex,
            timestamp: timestamp,
            ownerAddress: wallet.address,
            signature: signature
        };
        this.saveUlosCertificates(certs);

        if (!wallet.isRealMetaMask) {
            const currentBal = parseFloat(wallet.balance.split(' ')[0]);
            const gasCost = (85000 * 0.000005);
            const newBal = (currentBal - gasCost).toFixed(4);
            wallet.balance = `${newBal} DEV`;
            this.saveWalletState(wallet);
        }

        onStatusCallback('CONFIRMED', {
            message: 'Sertifikat Keaslian berhasil dicetak di Blockchain!',
            tokenId: tokenId,
            blockNumber: newIndex,
            txHash: txHash
        });

        return certs[itemData.id || itemData.name];
    }
}

window.SianAIBlockchainInstance = new SianAIBlockchain();

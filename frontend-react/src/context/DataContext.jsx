import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Fetch all transactions and inventory from the database
  const fetchFromDB = useCallback(async () => {
    const token = localStorage.getItem('sianai_auth_token');
    if (!token) return;

    try {
      // 1. Fetch Transactions
      const txRes = await fetch('http://127.0.0.1:8000/api/v1/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        if (txData.success) {
          setTransactions(txData.transactions);
        }
      }

      // 2. Fetch Inventory
      const invRes = await fetch('http://127.0.0.1:8000/api/v1/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        if (invData.success) {
          const itemsWithImages = invData.inventory.map(item => {
            const savedImage = localStorage.getItem(`sianai_inventory_image_${item.id}`);
            return {
              ...item,
              image: savedImage || '/assets/ulos1.jpg'
            };
          });
          setInventory(itemsWithImages);
        }
      }
    } catch (error) {
      console.error('Error fetching database:', error);
    }
  }, []);

  useEffect(() => {
    fetchFromDB();
  }, [fetchFromDB]);

  const saveInventory = useCallback(async (itemsOrItem) => {
    const token = localStorage.getItem('sianai_auth_token');
    
    let allItems = [];
    let isSingleNewItem = false;
    let newItem = null;

    if (Array.isArray(itemsOrItem)) {
      allItems = itemsOrItem;
    } else if (itemsOrItem && typeof itemsOrItem === 'object') {
      isSingleNewItem = true;
      newItem = itemsOrItem;
      allItems = [...inventory, newItem];
    }

    // If not logged in, fallback to state & localstorage
    if (!token) {
      localStorage.setItem('sianai_inventory', JSON.stringify(allItems));
      if (isSingleNewItem && newItem && newItem.image) {
        localStorage.setItem(`sianai_inventory_image_${newItem.id}`, newItem.image);
      }
      setInventory(allItems);
      return;
    }

    try {
      if (isSingleNewItem) {
        const res = await fetch('http://127.0.0.1:8000/api/v1/inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: newItem.name,
            ulos_type: newItem.ulosType || 'Lainnya',
            cost_price: parseFloat(newItem.costPrice),
            selling_price: parseFloat(newItem.sellingPrice),
            quantity: parseInt(newItem.quantity || 1),
            unit: 'lembar',
            status: 'active'
          })
        });
        const data = await res.json();
        if (data.success && data.item) {
          if (newItem.image) {
            localStorage.setItem(`sianai_inventory_image_${data.item.id}`, newItem.image);
          }
        }
        fetchFromDB();
      } else {
        setInventory(allItems);
      }
    } catch (e) {
      console.error(e);
      setInventory(allItems);
    }
  }, [inventory, fetchFromDB]);

  // Computed Balance
  const stats = (() => {
    const baseBalance = 0;
    let income = 0, expense = 0;
    transactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });
    return { balance: baseBalance + income - expense, income, expense };
  })();

  const isTransactionSynced = useCallback(() => null, []);

  const connectWallet = useCallback(async () => {
    return { connected: false, address: null, network: 'Localhost', balance: '0 ETH' };
  }, []);

  const disconnectWallet = useCallback(() => {}, []);

  const addTransaction = useCallback(async (tx) => {
    const token = localStorage.getItem('sianai_auth_token');
    if (!token) {
      const newTx = { id: `tx-${Date.now()}`, ...tx };
      setTransactions(prev => [newTx, ...prev]);
      return newTx;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: tx.name,
          type: tx.type,
          category: tx.category,
          amount: parseFloat(tx.amount),
          date: tx.date || new Date().toISOString().split('T')[0]
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchFromDB();
        return data.transaction;
      }
    } catch (e) {
      console.error(e);
      const newTx = { id: `tx-${Date.now()}`, ...tx };
      setTransactions(prev => [newTx, ...prev]);
      return newTx;
    }
  }, [fetchFromDB]);

  const writeTransaction = useCallback(async () => {}, []);
  const mintUlosCertificate = useCallback(async () => ({}), []);

  const deleteInventoryItem = useCallback(async (itemId) => {
    const token = localStorage.getItem('sianai_auth_token');
    if (!token) {
      const updated = inventory.filter(item => item.id !== itemId);
      setInventory(updated);
      localStorage.setItem('sianai_inventory', JSON.stringify(updated));
      localStorage.removeItem(`sianai_inventory_image_${itemId}`);
      return;
    }
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/inventory/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem(`sianai_inventory_image_${itemId}`);
      fetchFromDB();
    } catch (e) {
      console.error(e);
    }
  }, [inventory, fetchFromDB]);

  const updateInventoryItem = useCallback(async (itemId, updatedData) => {
    const token = localStorage.getItem('sianai_auth_token');
    
    if (updatedData.image) {
      localStorage.setItem(`sianai_inventory_image_${itemId}`, updatedData.image);
    }

    if (!token) {
      const updated = inventory.map(item => item.id === itemId ? { ...item, ...updatedData } : item);
      setInventory(updated);
      localStorage.setItem('sianai_inventory', JSON.stringify(updated));
      return;
    }
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/inventory/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: updatedData.name,
          ulos_type: updatedData.ulosType || updatedData.ulos_type,
          cost_price: updatedData.costPrice || updatedData.cost_price,
          selling_price: updatedData.sellingPrice || updatedData.selling_price,
          quantity: parseInt(updatedData.quantity),
          status: updatedData.status
        })
      });
      fetchFromDB();
    } catch (e) {
      console.error(e);
    }
  }, [inventory, fetchFromDB]);

  return (
    <DataContext.Provider value={{
      transactions, ledger: [], wallet: { connected: false, address: null }, certificates: {}, inventory,
      stats, isTransactionSynced,
      connectWallet, disconnectWallet,
      addTransaction, writeTransaction, mintUlosCertificate,
      saveInventory, updateInventoryItem, deleteInventoryItem, fetchFromDB
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

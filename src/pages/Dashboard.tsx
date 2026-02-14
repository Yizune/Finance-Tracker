import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../context';
import * as api from '../api';
import type { Transaction, PopupMode, SortOrder } from '../types';

import Header from '../components/Header';
import Filters from '../components/Filters';
import TransactionTable from '../components/TransactionTable';
import Popup from '../components/Popup';
import StatCards from '../components/StatCards';
import Chart from '../components/Chart';
import Footer from '../components/Footer';

export default function Dashboard() {
  const {
    transactions,
    categories,
    loading,
    addTransaction,
    removeTransactions,
    updateTransaction,
    setTransactions,
  } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ignore');
  const [categoryFilter, setCategoryFilter] = useState('ignore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('ignore');

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [popupMode, setPopupMode] = useState<PopupMode>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [removeMessage, setRemoveMessage] = useState('');

  const [sortedFromApi, setSortedFromApi] = useState<Transaction[] | null>(null);

  const handleSortChange = useCallback(
    async (val: SortOrder) => {
      setSortOrder(val);
      if (val !== 'ignore') {
        try {
          const sort = val === 'ascAmount' ? 'asc' : 'desc';
          const sorted = await api.fetchSortedTransactions(sort as 'asc' | 'desc');
          setSortedFromApi(sorted);
        } catch (err) {
          console.error('Error fetching sorted transactions:', err);
          setSortedFromApi(null);
        }
      } else {
        setSortedFromApi(null);
      }
    },
    []
  );

  const filteredData = useMemo(() => {
    let data = sortedFromApi ?? [...transactions].sort((a, b) => a.id - b.id);

    if (typeFilter !== 'ignore') {
      data = data.filter((t) =>
        typeFilter === 'Expenses' ? t.type === 'expense' : t.type === 'income'
      );
    }

    if (categoryFilter !== 'ignore') {
      data = data.filter((t) => t.category === categoryFilter);
    }

    const q = search.toUpperCase();
    if (q) {
      data = data.filter(
        (t) =>
          t.type.toUpperCase().includes(q) ||
          t.category.toUpperCase().includes(q) ||
          t.description.toUpperCase().includes(q) ||
          t.date.includes(search) ||
          String(t.amount).includes(search)
      );
    }

    return data;
  }, [transactions, sortedFromApi, typeFilter, categoryFilter, search]);

  const anyFilterActive =
    search !== '' ||
    typeFilter !== 'ignore' ||
    categoryFilter !== 'ignore' ||
    sortOrder !== 'ignore';

  function clearFilters() {
    setSearch('');
    setTypeFilter('ignore');
    setCategoryFilter('ignore');
    setSortOrder('ignore');
    setSortedFromApi(null);
  }

  async function handleAdd(data: Omit<Transaction, 'id'>) {
    try {
      const created = await api.createTransaction(data);
      addTransaction(created);
      setPopupMode(null);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  }

  async function handleEdit(data: Omit<Transaction, 'id'>) {
    if (!editingTransaction) return;
    try {
      const updated = await api.updateTransaction(editingTransaction.id, data);
      updateTransaction(updated);
      const refreshed = await api.fetchTransactions();
      setTransactions(refreshed);
      setSelectedIds(new Set());
      setPopupMode(null);
      setEditingTransaction(null);
    } catch (err) {
      console.error('Error editing transaction:', err);
    }
  }

  async function handleRemove() {
    const ids = Array.from(selectedIds).map(String);
    try {
      await api.deleteTransactions(ids);
      removeTransactions(ids);
      setSelectedIds(new Set());
      setPopupMode(null);
    } catch (err) {
      console.error('Error deleting transactions:', err);
    }
  }

  function openAdd() {
    setPopupMode('add');
  }

  function openRemove() {
    if (selectedIds.size === 0) return;
    const msg =
      selectedIds.size > 1
        ? `Are you sure you want to delete the selected ${selectedIds.size} rows?`
        : 'Are you sure you want to delete the selected row?';
    setRemoveMessage(msg);
    setPopupMode('remove');
  }

  function openEdit() {
    if (selectedIds.size !== 1) return;
    const id = Array.from(selectedIds)[0];
    const t = transactions.find((tx) => tx.id === id);
    if (t) {
      setEditingTransaction(t);
      setPopupMode('edit');
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />

      <Filters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        categories={categories}
        anyFilterActive={anyFilterActive}
        onClear={clearFilters}
        onAdd={openAdd}
        onRemove={openRemove}
        onEdit={openEdit}
        selectedCount={selectedIds.size}
      />

      <TransactionTable
        data={filteredData}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />

      <Popup
        mode={popupMode}
        onClose={() => {
          setPopupMode(null);
          setEditingTransaction(null);
        }}
        categories={categories}
        editTransaction={editingTransaction}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onConfirmRemove={handleRemove}
        removeMessage={removeMessage}
      />

      <StatCards transactions={transactions} />

      <Chart transactions={transactions} />

      <Footer />
    </div>
  );
}

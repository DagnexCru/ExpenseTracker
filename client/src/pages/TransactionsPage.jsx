import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Receipt } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  getTransactionsApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
} from '../api/transactions';
import TransactionStatsMini from '../components/transactions/TransactionStatsMini';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import EmptyTransactionsState from '../components/transactions/EmptyTransactionsState';
import TransactionModal from '../components/transactions/TransactionModal';
import DeleteConfirmModal from '../components/transactions/DeleteConfirmModal';
import Button from '../components/ui/Button';
import Alert from '../ui/Alert';
import Spinner from '../components/ui/Spinner';

export const TransactionsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'ETB';

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTransactionsApi();
      setTransactions(data.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle Create or Update
  const handleSubmitTransaction = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        await updateTransactionApi(editingTransaction.id, formData);
      } else {
        await createTransactionApi(formData);
      }
      await fetchTransactions();
      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await deleteTransactionApi(deletingTransaction.id);
      await fetchTransactions();
      setDeletingTransaction(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter transactions in memory
  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (categoryFilter && tx.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const desc = (tx.description || '').toLowerCase();
      const cat = (tx.category || '').toLowerCase();
      if (!desc.includes(query) && !cat.includes(query)) return false;
    }
    return true;
  });

  const hasActiveFilters = typeFilter !== 'all' || categoryFilter !== '' || searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Transactions Management
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
              Phase 3 Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Record, organize, and monitor all personal income and expense transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchTransactions}
            isLoading={isLoading}
            className="text-slate-600"
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Mini KPI Summary Cards */}
      <TransactionStatsMini transactions={transactions} currency={currency} />

      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Transaction Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search & Filter Bar */}
      <TransactionFilters
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onReset={() => {
          setTypeFilter('all');
          setCategoryFilter('');
          setSearchQuery('');
        }}
      />

      {/* Data Section */}
      {isLoading && transactions.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <Spinner size="lg" className="text-brand-600" />
          <p className="text-xs text-slate-500 font-medium">Loading your transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <EmptyTransactionsState
          hasFilters={hasActiveFilters}
          onAddClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          onResetFilters={() => {
            setTypeFilter('all');
            setCategoryFilter('');
            setSearchQuery('');
          }}
        />
      ) : (
        <TransactionTable
          transactions={filteredTransactions}
          currency={currency}
          onEdit={(tx) => {
            setEditingTransaction(tx);
            setIsModalOpen(true);
          }}
          onDelete={(tx) => setDeletingTransaction(tx)}
        />
      )}

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        transaction={editingTransaction}
        isLoading={isSubmitting}
        currency={currency}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        transaction={deletingTransaction}
        isDeleting={isDeleting}
        currency={currency}
      />
    </div>
  );
};

export default TransactionsPage;

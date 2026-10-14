import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import PaginationControls from '../components/transactions/PaginationControls';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';

export const TransactionsPage = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'ETB';

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting state
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1); // reset to page 1 on new search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch transactions from server with all query parameters
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (typeFilter && typeFilter !== 'all') {
        params.type = typeFilter;
      }
      if (categoryFilter) {
        params.category = categoryFilter;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const res = await getTransactionsApi(params);
      const txList = res?.data?.transactions || [];
      setTransactions(txList);

      if (res?.pagination) {
        setPagination(res.pagination);
      } else {
        setPagination({
          page,
          limit,
          totalCount: txList.length,
          totalPages: Math.max(1, Math.ceil(txList.length / limit)),
          hasNextPage: false,
          hasPrevPage: page > 1,
        });
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortBy, sortOrder, typeFilter, categoryFilter, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter change handlers that reset page to 1
  const handleTypeChange = (type) => {
    setTypeFilter(type);
    setCategoryFilter(''); // reset category on type switch to avoid mismatch
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    setPage(1);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setPage(1);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setPage(1);
  };

  const handleSortByChange = (field) => {
    setSortBy(field);
    setPage(1);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setPage(1);
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('');
    setSearchQuery('');
    setDebouncedSearch('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
    setPage(1);
  };

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
      // If we are on a page with 1 item that was deleted, go back 1 page if possible
      if (transactions.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await fetchTransactions();
      }
      setDeletingTransaction(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    typeFilter !== 'all' ||
    categoryFilter !== '' ||
    searchQuery.trim() !== '' ||
    startDate !== '' ||
    endDate !== '' ||
    sortBy !== 'date' ||
    sortOrder !== 'desc';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE4D9]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Transactions Management
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs">
              Live Ledger & Filters Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Filter by date, category, type, search descriptions, and paginate through records seamlessly.
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

      {/* Advanced Search & Filter Bar */}
      <TransactionFilters
        typeFilter={typeFilter}
        onTypeFilterChange={handleTypeChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        startDate={startDate}
        onStartDateChange={handleStartDateChange}
        endDate={endDate}
        onEndDateChange={handleEndDateChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
        onReset={handleResetFilters}
      />

      {/* Data Section */}
      {isLoading && transactions.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <Spinner size="lg" className="text-brand-600" />
          <p className="text-xs text-slate-500 font-medium">Filtering your transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <EmptyTransactionsState
          hasFilters={hasActiveFilters}
          onAddClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="space-y-4">
          <TransactionTable
            transactions={transactions}
            currency={currency}
            onEdit={(tx) => {
              setEditingTransaction(tx);
              setIsModalOpen(true);
            }}
            onDelete={(tx) => setDeletingTransaction(tx)}
          />

          {/* Pagination Controls */}
          <PaginationControls
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
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

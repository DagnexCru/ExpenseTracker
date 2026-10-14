import React, { useState, useEffect } from 'react';
import { Plus, Check, DollarSign, Calendar, Tag, CreditCard, AlignLeft } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
} from '../../constants/transactionCategories';

/**
 * Modal to add or edit a transaction record
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSubmit - receives formData
 * @param {Object} [props.transaction] - if editing
 * @param {boolean} props.isLoading
 * @param {string} [props.currency='ETB']
 */
export const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  transaction = null,
  isLoading = false,
  currency = 'ETB',
}) => {
  const isEditing = Boolean(transaction);

  // Form State
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [errorAlert, setErrorAlert] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Reset or pre-fill on open/change
  useEffect(() => {
    if (transaction) {
      setType(transaction.type || 'expense');
      setAmount(transaction.amount ? String(transaction.amount) : '');
      setCategory(transaction.category || '');
      setDate(
        transaction.date
          ? new Date(transaction.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setDescription(transaction.description || '');
      setPaymentMethod(transaction.paymentMethod || 'cash');
    } else {
      setType('expense');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0]?.name || 'Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setPaymentMethod('cash');
    }
    setErrorAlert(null);
    setFormErrors({});
  }, [transaction, isOpen]);

  // When type changes, ensure category matches the new type
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'expense') {
      setCategory(EXPENSE_CATEGORIES[0]?.name || 'Food & Dining');
    } else {
      setCategory(INCOME_CATEGORIES[0]?.name || 'Salary');
    }
  };

  const validate = () => {
    const errors = {};
    const numAmount = Number(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0.';
    }

    if (!category) {
      errors.category = 'Please select a category.';
    }

    if (!date) {
      errors.date = 'Please select a transaction date.';
    }

    if (description && description.length > 200) {
      errors.description = 'Description cannot exceed 200 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        type,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
        description: description.trim(),
        paymentMethod,
      });
      onClose();
    } catch (err) {
      setErrorAlert(err.response?.data?.error?.message || err.message || 'Operation failed');
    }
  };

  const currentCategoryList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Record New Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorAlert && (
          <Alert variant="error" title="Validation Error" onClose={() => setErrorAlert(null)}>
            {errorAlert}
          </Alert>
        )}

        {/* Transaction Type Segmented Switcher */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF5F0] border border-[#EDE4D9] rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Income</span>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Amount ({currency})
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              {currency}
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (formErrors.amount) setFormErrors((p) => ({ ...p, amount: null }));
              }}
              required
              className={`w-full pl-12 pr-3 py-2 bg-[#FAF5F0]/60 hover:bg-white focus:bg-white border rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${
                formErrors.amount ? 'border-rose-400' : 'border-[#EDE4D9]'
              }`}
            />
          </div>
          {formErrors.amount && (
            <p className="text-[11px] text-rose-500 mt-1 font-medium">{formErrors.amount}</p>
          )}
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (formErrors.category) setFormErrors((p) => ({ ...p, category: null }));
              }}
              required
              className="w-full px-3 py-2 bg-[#FAF5F0]/60 hover:bg-white focus:bg-white border border-[#EDE4D9] rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              {currentCategoryList.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Payment Method Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#FAF5F0]/60 hover:bg-white focus:bg-white border border-[#EDE4D9] rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF5F0]/60 hover:bg-white focus:bg-white border border-[#EDE4D9] rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Traditional dinner with family"
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF5F0]/60 hover:bg-white focus:bg-white border border-[#EDE4D9] rounded-xl text-xs placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#EDE4D9]">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Save Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;

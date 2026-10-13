import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

/**
 * Modal to confirm transaction deletion
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onConfirm
 * @param {Object} props.transaction
 * @param {boolean} props.isDeleting
 * @param {string} [props.currency='ETB']
 */
export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isDeleting,
  currency = 'ETB',
}) => {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Transaction">
      <div className="space-y-4">
        {/* Warning Icon & Text */}
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200/60 rounded-xl text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Are you sure you want to delete this record?</p>
            <p className="mt-0.5 text-rose-600">
              This will permanently remove the transaction from your database records. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Category:</span>
            <span className="font-semibold text-slate-800">{transaction.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Amount:</span>
            <span
              className={`font-bold font-mono ${
                transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'} {currency}{' '}
              {Number(transaction.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Date:</span>
            <span className="text-slate-700">
              {new Date(transaction.date).toLocaleDateString()}
            </span>
          </div>
          {transaction.description && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Description:</span>
              <span className="text-slate-700 truncate max-w-[200px]">
                {transaction.description}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;

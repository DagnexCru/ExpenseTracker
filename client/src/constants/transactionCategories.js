/**
 * @file transactionCategories.js
 * @description Frontend category definitions with icons and color badges
 */

export const EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: 'Utensils', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  { name: 'Transportation', icon: 'Car', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  { name: 'Housing & Rent', icon: 'Home', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  { name: 'Utilities', icon: 'Zap', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  { name: 'Healthcare', icon: 'Activity', color: 'bg-rose-500/10 text-rose-600 border-rose-200' },
  { name: 'Education', icon: 'BookOpen', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' },
  { name: 'Entertainment', icon: 'Film', color: 'bg-pink-500/10 text-pink-600 border-pink-200' },
  { name: 'Shopping', icon: 'ShoppingBag', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200' },
  { name: 'Personal Care', icon: 'Smile', color: 'bg-teal-500/10 text-teal-600 border-teal-200' },
  { name: 'Other Expense', icon: 'MoreHorizontal', color: 'bg-slate-500/10 text-slate-600 border-slate-200' },
];

export const INCOME_CATEGORIES = [
  { name: 'Salary', icon: 'Briefcase', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  { name: 'Freelance & Consulting', icon: 'Laptop', color: 'bg-teal-500/10 text-teal-600 border-teal-200' },
  { name: 'Business', icon: 'TrendingUp', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  { name: 'Investments', icon: 'PiggyBank', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  { name: 'Rental Income', icon: 'Key', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  { name: 'Gift & Grant', icon: 'Gift', color: 'bg-rose-500/10 text-rose-600 border-rose-200' },
  { name: 'Other Income', icon: 'DollarSign', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
  { id: 'mobile_money', label: 'Mobile Money (Telebirr / CBE Birr)' },
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'debit_card', label: 'Debit Card' },
  { id: 'other', label: 'Other' },
];

export const getCategoryMetadata = (categoryName) => {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  return (
    all.find((c) => c.name === categoryName) || {
      name: categoryName,
      icon: 'Tag',
      color: 'bg-slate-100 text-slate-600 border-[#EDE4D9]',
    }
  );
};

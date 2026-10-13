import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { roundMonetaryAmount } from '../utils/amount.util.js';

/**
 * Dashboard Service
 * High-performance MongoDB aggregation pipelines for financial calculations
 * All calculations are strictly isolated by authenticated user ID.
 */
export const dashboardService = {
  /**
   * Get financial summary (Total Income, Total Expenses, Net Balance, Savings Rate, Recent Transactions)
   */
  async getSummary(userId, { startDate, endDate } = {}) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const matchFilter = { user: userObjectId };

    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) {
        matchFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Include the entire end date by setting hours to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchFilter.date.$lte = end;
      }
    }

    // Pipeline 1: Aggregation for totals by type
    const totalsAggregation = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    totalsAggregation.forEach((group) => {
      if (group._id === 'income') {
        totalIncome = roundMonetaryAmount(group.totalAmount);
        incomeCount = group.count;
      } else if (group._id === 'expense') {
        totalExpenses = roundMonetaryAmount(group.totalAmount);
        expenseCount = group.count;
      }
    });

    const netBalance = roundMonetaryAmount(totalIncome - totalExpenses);
    const transactionCount = incomeCount + expenseCount;

    // Savings rate: percentage of income saved (0 if no income)
    let savingsRate = 0;
    if (totalIncome > 0) {
      const rate = ((totalIncome - totalExpenses) / totalIncome) * 100;
      savingsRate = Math.round(rate * 10) / 10; // Round to 1 decimal place
    }

    // Pipeline 2: Fetch 5 most recent transactions
    const recentTransactions = await Transaction.find(matchFilter)
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .lean();

    const formattedRecent = recentTransactions.map((t) => ({
      id: t._id.toString(),
      type: t.type,
      amount: t.amount,
      category: t.category,
      description: t.description || '',
      date: t.date,
      paymentMethod: t.paymentMethod,
    }));

    return {
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
        savingsRate,
        transactionCount,
        incomeCount,
        expenseCount,
        hasData: transactionCount > 0,
      },
      recentTransactions: formattedRecent,
    };
  },

  /**
   * Get monthly trends (Income vs Expenses over time)
   */
  async getMonthlyTrend(userId, { year, months = 6 } = {}) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const matchFilter = { user: userObjectId };

    let startDate;
    let endDate = new Date();

    if (year) {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    } else {
      // Default: Last N months from current month
      const count = Math.min(Math.max(months, 1), 24);
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - (count - 1));
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      matchFilter.date = { $gte: startDate, $lte: endDate };
    }

    // Pipeline: Group transactions by Year, Month, and Type
    const monthlyData = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Build continuous monthly slots to prevent gaps in chart
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const slots = [];
    const currentIter = new Date(startDate);
    const endIter = new Date(endDate);

    while (
      currentIter.getFullYear() < endIter.getFullYear() ||
      (currentIter.getFullYear() === endIter.getFullYear() &&
        currentIter.getMonth() <= endIter.getMonth())
    ) {
      const y = currentIter.getFullYear();
      const m = currentIter.getMonth() + 1; // 1-indexed
      const monthKey = `${y}-${String(m).padStart(2, '0')}`;
      const shortName = monthNames[m - 1];
      const label = `${shortName} ${y}`;

      slots.push({
        monthKey,
        label,
        shortMonth: shortName,
        year: y,
        month: m,
        income: 0,
        expenses: 0,
        net: 0,
      });

      // Advance one month
      currentIter.setMonth(currentIter.getMonth() + 1);
    }

    // Map aggregated data into slots
    const slotMap = new Map();
    slots.forEach((s) => slotMap.set(s.monthKey, s));

    monthlyData.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      const slot = slotMap.get(key);
      if (slot) {
        if (item._id.type === 'income') {
          slot.income = roundMonetaryAmount(item.total);
        } else if (item._id.type === 'expense') {
          slot.expenses = roundMonetaryAmount(item.total);
        }
      }
    });

    // Calculate net for each slot
    slots.forEach((s) => {
      s.net = roundMonetaryAmount(s.income - s.expenses);
    });

    return {
      monthly: slots,
      period: {
        startDate,
        endDate,
        totalMonths: slots.length,
      },
    };
  },

  /**
   * Get category breakdown (spending grouped by category with percentages)
   */
  async getCategoryBreakdown(userId, { type = 'expense', startDate, endDate } = {}) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const matchFilter = { user: userObjectId, type };

    if (startDate || endDate) {
      matchFilter.date = {};
      if (startDate) {
        matchFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchFilter.date.$lte = end;
      }
    }

    const categoriesAggregation = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    const totalAmount = roundMonetaryAmount(
      categoriesAggregation.reduce((acc, curr) => acc + curr.totalAmount, 0)
    );

    const categories = categoriesAggregation.map((cat) => {
      const roundedTotal = roundMonetaryAmount(cat.totalAmount);
      const percentage =
        totalAmount > 0 ? Math.round((roundedTotal / totalAmount) * 1000) / 10 : 0;

      return {
        category: cat._id,
        total: roundedTotal,
        count: cat.count,
        percentage,
      };
    });

    return {
      type,
      totalAmount,
      categoryCount: categories.length,
      categories,
    };
  },
};

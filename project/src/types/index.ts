export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  notes?: string;
  createdAt: string;
}

export interface Income extends Transaction {}

export interface Expense extends Transaction {}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  categorizedIncome: {
    categoryId: string;
    categoryName: string;
    amount: number;
  }[];
  categorizedExpenses: {
    categoryId: string;
    categoryName: string;
    amount: number;
  }[];
}

export interface DashboardStats {
  currentMonthIncome: number;
  currentMonthExpenses: number;
  currentMonthProfit: number;
  previousMonthProfit: number;
  profitTrend: number; // percentage change
  topIncomeCategories: {
    categoryId: string;
    categoryName: string;
    amount: number;
  }[];
  topExpenseCategories: {
    categoryId: string;
    categoryName: string;
    amount: number;
  }[];
}
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Income, Expense, Category, DashboardStats } from '../types';
import { generateId } from '../utils/helpers';

// Estado inicial
interface FinanceState {
  income: Income[];
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
}

const initialState: FinanceState = {
  income: [],
  expenses: [],
  categories: [
    { id: '1', name: 'Vendas diárias', type: 'income', color: '#10B981' },
    { id: '2', name: 'Eventos especiais', type: 'income', color: '#3B82F6' },
    { id: '3', name: 'Catering', type: 'income', color: '#F59E0B' },
    { id: '4', name: 'Ingredientes', type: 'expense', color: '#EF4444' },
    { id: '5', name: 'Funcionários', type: 'expense', color: '#8B5CF6' },
    { id: '6', name: 'Utilidades', type: 'expense', color: '#EC4899' },
    { id: '7', name: 'Equipamentos', type: 'expense', color: '#6366F1' },
  ],
  isLoading: false,
};

// Ações do reducer
type FinanceAction =
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_DATA'; payload: Partial<FinanceState> };

// Reducer
const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'ADD_INCOME':
      return { ...state, income: [...state.income, action.payload] };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'DELETE_INCOME':
      return { ...state, income: state.income.filter(item => item.id !== action.payload) };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(item => item.id !== action.payload) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY': {
      const updatedCategories = state.categories.map(cat => 
        cat.id === action.payload.id ? action.payload : cat
      );
      return { ...state, categories: updatedCategories };
    }
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(cat => cat.id !== action.payload) };
    case 'SET_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// Contexto
interface FinanceContextValue extends FinanceState {
  addIncome: (data: Omit<Income, 'id' | 'createdAt'>) => void;
  addExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  addCategory: (data: Omit<Category, 'id'>) => void;
  updateCategory: (data: Category) => void;
  deleteCategory: (id: string) => void;
  calculateDashboardStats: () => DashboardStats;
  getCategoryById: (id: string) => Category | undefined;
}

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

// Provider
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedData = localStorage.getItem('cantinaFinanceData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'SET_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage quando o estado mudar
  useEffect(() => {
    localStorage.setItem('cantinaFinanceData', JSON.stringify({
      income: state.income,
      expenses: state.expenses,
      categories: state.categories,
    }));
  }, [state.income, state.expenses, state.categories]);

  // Funções auxiliares
  const addIncome = (data: Omit<Income, 'id' | 'createdAt'>) => {
    const newIncome: Income = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_INCOME', payload: newIncome });
  };

  const addExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
  };

  const deleteIncome = (id: string) => {
    dispatch({ type: 'DELETE_INCOME', payload: id });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const addCategory = (data: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...data,
      id: generateId(),
    };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const updateCategory = (data: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: data });
  };

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(cat => cat.id === id);
  };

  const calculateDashboardStats = (): DashboardStats => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Filtrar transações do mês atual
    const currentMonthIncome = state.income.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });
    
    const currentMonthExpenses = state.expenses.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });

    // Filtrar transações do mês anterior
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const prevMonthIncome = state.income.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear() === prevYear && date.getMonth() === prevMonth;
    });
    
    const prevMonthExpenses = state.expenses.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear() === prevYear && date.getMonth() === prevMonth;
    });

    // Calcular totais
    const totalCurrentIncome = currentMonthIncome.reduce((acc, item) => acc + item.amount, 0);
    const totalCurrentExpenses = currentMonthExpenses.reduce((acc, item) => acc + item.amount, 0);
    const currentProfit = totalCurrentIncome - totalCurrentExpenses;
    
    const totalPrevIncome = prevMonthIncome.reduce((acc, item) => acc + item.amount, 0);
    const totalPrevExpenses = prevMonthExpenses.reduce((acc, item) => acc + item.amount, 0);
    const prevProfit = totalPrevIncome - totalPrevExpenses;
    
    // Calcular tendência de lucro (% de mudança)
    const profitTrend = prevProfit === 0 
      ? currentProfit > 0 ? 100 : 0
      : ((currentProfit - prevProfit) / Math.abs(prevProfit)) * 100;

    // Calcular top categorias
    const incomeByCat = new Map<string, number>();
    const expensesByCat = new Map<string, number>();
    
    currentMonthIncome.forEach(item => {
      const current = incomeByCat.get(item.categoryId) || 0;
      incomeByCat.set(item.categoryId, current + item.amount);
    });
    
    currentMonthExpenses.forEach(item => {
      const current = expensesByCat.get(item.categoryId) || 0;
      expensesByCat.set(item.categoryId, current + item.amount);
    });
    
    const topIncomeCategories = Array.from(incomeByCat.entries())
      .map(([categoryId, amount]) => {
        const category = state.categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Desconhecido',
          amount,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    
    const topExpenseCategories = Array.from(expensesByCat.entries())
      .map(([categoryId, amount]) => {
        const category = state.categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Desconhecido',
          amount,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    
    return {
      currentMonthIncome: totalCurrentIncome,
      currentMonthExpenses: totalCurrentExpenses,
      currentMonthProfit: currentProfit,
      previousMonthProfit: prevProfit,
      profitTrend,
      topIncomeCategories,
      topExpenseCategories,
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        ...state,
        addIncome,
        addExpense,
        deleteIncome,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        calculateDashboardStats,
        getCategoryById,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Hook para usar o contexto
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
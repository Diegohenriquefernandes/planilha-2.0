import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import { Receipt } from 'lucide-react';

const Expenses: React.FC = () => {
  const { expenses, categories, addExpense, deleteExpense } = useFinance();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Gestão de Despesas</h2>
        <p className="text-sm text-gray-500">
          Adicione e gerencie as despesas da cantina
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm
            categories={categories}
            type="expense"
            onSubmit={addExpense}
          />
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center">
            <Receipt size={20} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">Lista de Despesas</h3>
          </div>
          
          <TransactionTable
            transactions={expenses}
            categories={categories}
            onDelete={deleteExpense}
            emptyMessage="Nenhuma despesa registrada. Adicione uma nova despesa usando o formulário."
          />
        </div>
      </div>
    </div>
  );
};

export default Expenses;
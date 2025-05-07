import React from 'react';
import { useFinance } from '../contexts/FinanceContext';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import { Coins } from 'lucide-react';

const Income: React.FC = () => {
  const { income, categories, addIncome, deleteIncome } = useFinance();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Gestão de Receitas</h2>
        <p className="text-sm text-gray-500">
          Adicione e gerencie as receitas da cantina
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm
            categories={categories}
            type="income"
            onSubmit={addIncome}
          />
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center">
            <Coins size={20} className="text-emerald-600 mr-2" />
            <h3 className="text-lg font-medium">Lista de Receitas</h3>
          </div>
          
          <TransactionTable
            transactions={income}
            categories={categories}
            onDelete={deleteIncome}
            emptyMessage="Nenhuma receita registrada. Adicione uma nova receita usando o formulário."
          />
        </div>
      </div>
    </div>
  );
};

export default Income;
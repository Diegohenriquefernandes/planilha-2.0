import React, { useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import StatCard from '../components/StatCard';
import CategoryBadge from '../components/CategoryBadge';
import { TrendingUp, TrendingDown, DollarSign, BarChart } from 'lucide-react';
import { formatCurrency, calculatePercentage } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { categories, calculateDashboardStats } = useFinance();
  
  const stats = useMemo(() => calculateDashboardStats(), [calculateDashboardStats]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Resumo Financeiro</h2>
        <p className="text-sm text-gray-500">
          Visão geral das finanças da cantina no mês atual
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Receitas do Mês"
          value={stats.currentMonthIncome}
          type="income"
          icon={<TrendingUp size={20} />}
        />
        
        <StatCard
          title="Despesas do Mês"
          value={stats.currentMonthExpenses}
          type="expense"
          icon={<TrendingDown size={20} />}
        />
        
        <StatCard
          title="Lucro/Prejuízo"
          value={stats.currentMonthProfit}
          previousValue={stats.previousMonthProfit}
          trend={stats.profitTrend}
          icon={<DollarSign size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4">
            <TrendingUp size={18} className="text-emerald-600 mr-2" />
            <h3 className="text-lg font-medium">Principais Receitas</h3>
          </div>
          
          {stats.topIncomeCategories.length > 0 ? (
            <div>
              {stats.topIncomeCategories.map((item) => {
                const category = categories.find(c => c.id === item.categoryId);
                if (!category) return null;
                
                const percentage = calculatePercentage(
                  item.amount, 
                  stats.currentMonthIncome
                );
                
                return (
                  <CategoryBadge
                    key={item.categoryId}
                    category={category}
                    amount={item.amount}
                    percentage={percentage}
                  />
                );
              })}
              
              <div className="mt-4 text-right">
                <p className="text-sm text-gray-600">
                  Total: {formatCurrency(stats.currentMonthIncome)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Nenhuma receita registrada neste mês
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-4">
            <TrendingDown size={18} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">Principais Despesas</h3>
          </div>
          
          {stats.topExpenseCategories.length > 0 ? (
            <div>
              {stats.topExpenseCategories.map((item) => {
                const category = categories.find(c => c.id === item.categoryId);
                if (!category) return null;
                
                const percentage = calculatePercentage(
                  item.amount, 
                  stats.currentMonthExpenses
                );
                
                return (
                  <CategoryBadge
                    key={item.categoryId}
                    category={category}
                    amount={item.amount}
                    percentage={percentage}
                  />
                );
              })}
              
              <div className="mt-4 text-right">
                <p className="text-sm text-gray-600">
                  Total: {formatCurrency(stats.currentMonthExpenses)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Nenhuma despesa registrada neste mês
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <BarChart size={18} className="text-amber-600 mr-2" />
          <h3 className="text-lg font-medium">Desempenho Financeiro</h3>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Receitas vs Despesas</span>
            <span className="text-sm font-medium text-gray-600">
              Lucro: {formatCurrency(stats.currentMonthProfit)}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="relative w-full h-full">
              {/* Barra de despesas */}
              <div
                className="absolute left-0 top-0 bg-blue-500 h-full rounded-full"
                style={{
                  width: stats.currentMonthIncome > 0
                    ? `${Math.min(100, (stats.currentMonthExpenses / stats.currentMonthIncome) * 100)}%`
                    : '0%'
                }}
              ></div>
              
              {/* Barra de receitas (sempre 100%) */}
              <div className="absolute right-0 top-0 bg-emerald-500 h-full rounded-full"
                style={{
                  width: '100%',
                  clipPath: stats.currentMonthIncome > 0
                    ? `inset(0 0 0 ${(stats.currentMonthExpenses / stats.currentMonthIncome) * 100}%)`
                    : 'inset(0 0 0 100%)'
                }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-xs text-gray-600">Receitas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-gray-600">Despesas</span>
            </div>
          </div>
        </div>
        
        {/* Tendência de lucro */}
        {stats.previousMonthProfit !== 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-2">
              Comparado ao mês anterior:
            </p>
            <div className={`flex items-center ${
              stats.profitTrend >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {stats.profitTrend >= 0 ? (
                <>
                  <TrendingUp className="mr-1" size={16} />
                  <span>Aumento de {stats.profitTrend.toFixed(1)}% no lucro</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1" size={16} />
                  <span>Redução de {Math.abs(stats.profitTrend).toFixed(1)}% no lucro</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
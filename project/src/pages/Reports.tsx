import React, { useState, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { formatCurrency, formatMonth } from '../utils/helpers';
import { BarChart, TrendingUp, TrendingDown, FileDown } from 'lucide-react';
import CategoryBadge from '../components/CategoryBadge';

const Reports: React.FC = () => {
  const { income, expenses, categories } = useFinance();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  // Obter anos disponíveis das transações
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    [...income, ...expenses].forEach(transaction => {
      const date = new Date(transaction.date);
      years.add(date.getFullYear());
    });
    
    return Array.from(years).sort((a, b) => b - a);
  }, [income, expenses]);

  // Se não houver anos disponíveis, adicionar o ano atual
  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }

  // Filtrar transações do mês selecionado
  const filteredTransactions = useMemo(() => {
    const filteredIncome = income.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
    });
    
    const filteredExpenses = expenses.filter(item => {
      const date = new Date(item.date);
      return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
    });
    
    return { filteredIncome, filteredExpenses };
  }, [income, expenses, selectedYear, selectedMonth]);

  // Calcular totais e categorias
  const reportData = useMemo(() => {
    const { filteredIncome, filteredExpenses } = filteredTransactions;
    
    const totalIncome = filteredIncome.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    const profit = totalIncome - totalExpenses;
    
    // Agrupar por categorias
    const incomeByCategory = new Map<string, number>();
    const expensesByCategory = new Map<string, number>();
    
    filteredIncome.forEach(item => {
      const current = incomeByCategory.get(item.categoryId) || 0;
      incomeByCategory.set(item.categoryId, current + item.amount);
    });
    
    filteredExpenses.forEach(item => {
      const current = expensesByCategory.get(item.categoryId) || 0;
      expensesByCategory.set(item.categoryId, current + item.amount);
    });
    
    // Converter para arrays
    const incomeByCategoryArray = Array.from(incomeByCategory.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Desconhecido',
          amount,
          percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
    
    const expensesByCategoryArray = Array.from(expensesByCategory.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Desconhecido',
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
    
    return {
      totalIncome,
      totalExpenses,
      profit,
      incomeByCategoryArray,
      expensesByCategoryArray,
    };
  }, [filteredTransactions, categories]);

  // Exportar CSV
  const exportCSV = () => {
    const { filteredIncome, filteredExpenses } = filteredTransactions;
    
    const rows = [
      ['Tipo', 'Data', 'Descrição', 'Categoria', 'Valor (R$)', 'Observações'],
      ...filteredIncome.map(item => [
        'Receita',
        new Date(item.date).toLocaleDateString('pt-BR'),
        item.description,
        categories.find(c => c.id === item.categoryId)?.name || 'Desconhecido',
        item.amount.toString().replace('.', ','),
        item.notes || '',
      ]),
      ...filteredExpenses.map(item => [
        'Despesa',
        new Date(item.date).toLocaleDateString('pt-BR'),
        item.description,
        categories.find(c => c.id === item.categoryId)?.name || 'Desconhecido',
        item.amount.toString().replace('.', ','),
        item.notes || '',
      ]),
    ];
    
    // Adicionar totais
    rows.push(['', '', '', '', '', '']);
    rows.push(['Totais', '', '', '', '', '']);
    rows.push(['Total de Receitas', '', '', '', reportData.totalIncome.toString().replace('.', ','), '']);
    rows.push(['Total de Despesas', '', '', '', reportData.totalExpenses.toString().replace('.', ','), '']);
    rows.push(['Lucro/Prejuízo', '', '', '', reportData.profit.toString().replace('.', ','), '']);
    
    // Converter para CSV
    const csvContent = rows.map(row => row.join(';')).join('\n');
    
    // Criar link de download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-cantina-${selectedYear}-${selectedMonth + 1}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Relatórios Financeiros</h2>
        <p className="text-sm text-gray-500">
          Analise os dados financeiros da cantina por período
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">
              Ano
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-1">
              Mês
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>
                  {formatMonth(i, 2000).charAt(0).toUpperCase() + formatMonth(i, 2000).slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="ml-auto">
            <button
              onClick={exportCSV}
              className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm transition-colors"
            >
              <FileDown size={16} className="mr-2" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="text-emerald-600 mr-2" />
            <h3 className="text-lg font-medium">Receitas</h3>
          </div>
          
          {reportData.incomeByCategoryArray.length > 0 ? (
            <div>
              {reportData.incomeByCategoryArray.map((item) => {
                const category = categories.find(c => c.id === item.categoryId);
                if (!category) return null;
                
                return (
                  <CategoryBadge
                    key={item.categoryId}
                    category={category}
                    amount={item.amount}
                    percentage={item.percentage}
                  />
                );
              })}
              
              <div className="mt-4 text-right font-medium">
                Total: {formatCurrency(reportData.totalIncome)}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Nenhuma receita registrada no período selecionado
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <TrendingDown size={20} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">Despesas</h3>
          </div>
          
          {reportData.expensesByCategoryArray.length > 0 ? (
            <div>
              {reportData.expensesByCategoryArray.map((item) => {
                const category = categories.find(c => c.id === item.categoryId);
                if (!category) return null;
                
                return (
                  <CategoryBadge
                    key={item.categoryId}
                    category={category}
                    amount={item.amount}
                    percentage={item.percentage}
                  />
                );
              })}
              
              <div className="mt-4 text-right font-medium">
                Total: {formatCurrency(reportData.totalExpenses)}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Nenhuma despesa registrada no período selecionado
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <BarChart size={20} className="text-amber-600 mr-2" />
          <h3 className="text-lg font-medium">Resultado do Período</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-100">
            <div className="text-sm text-emerald-600 mb-1">Total de Receitas</div>
            <div className="text-xl font-bold text-emerald-700">
              {formatCurrency(reportData.totalIncome)}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-100">
            <div className="text-sm text-blue-600 mb-1">Total de Despesas</div>
            <div className="text-xl font-bold text-blue-700">
              {formatCurrency(reportData.totalExpenses)}
            </div>
          </div>
          
          <div className={`border rounded-lg p-4 ${
            reportData.profit >= 0 
              ? 'bg-amber-50 border-amber-100'
              : 'bg-red-50 border-red-100'
          }`}>
            <div className={`text-sm mb-1 ${
              reportData.profit >= 0 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {reportData.profit >= 0 ? 'Lucro' : 'Prejuízo'}
            </div>
            <div className={`text-xl font-bold ${
              reportData.profit >= 0 ? 'text-amber-700' : 'text-red-700'
            }`}>
              {formatCurrency(Math.abs(reportData.profit))}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Visão Geral de Receitas e Despesas
          </h4>
          <div className="h-12 bg-gray-100 rounded-lg overflow-hidden">
            {reportData.totalIncome > 0 || reportData.totalExpenses > 0 ? (
              <div className="relative h-full w-full">
                {/* Barra de receitas */}
                <div 
                  className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500 ease-in-out"
                  style={{ 
                    width: `${(reportData.totalIncome / Math.max(reportData.totalIncome, reportData.totalExpenses)) * 100}%` 
                  }}
                ></div>
                
                {/* Barra de despesas */}
                <div 
                  className="absolute right-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                  style={{ 
                    width: `${(reportData.totalExpenses / Math.max(reportData.totalIncome, reportData.totalExpenses)) * 100}%` 
                  }}
                ></div>
                
                {/* Indicadores de valor */}
                {reportData.totalIncome > 0 && (
                  <div 
                    className="absolute left-0 top-0 px-2 h-full flex items-center text-white text-sm font-medium"
                    style={{ 
                      left: `${Math.min(50, (reportData.totalIncome / Math.max(reportData.totalIncome, reportData.totalExpenses)) * 100 / 2)}%` 
                    }}
                  >
                    {formatCurrency(reportData.totalIncome)}
                  </div>
                )}
                
                {reportData.totalExpenses > 0 && (
                  <div 
                    className="absolute right-0 top-0 px-2 h-full flex items-center text-white text-sm font-medium"
                    style={{ 
                      right: `${Math.min(50, (reportData.totalExpenses / Math.max(reportData.totalIncome, reportData.totalExpenses)) * 100 / 2)}%` 
                    }}
                  >
                    {formatCurrency(reportData.totalExpenses)}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Sem dados para exibir neste período
              </div>
            )}
          </div>
          <div className="flex justify-between mt-2">
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
        
        <div className="mt-6 text-center">
          <div className={`text-lg font-medium ${
            reportData.profit >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {reportData.profit >= 0 
              ? `Resultado Positivo: Lucro de ${formatCurrency(reportData.profit)}`
              : `Resultado Negativo: Prejuízo de ${formatCurrency(Math.abs(reportData.profit))}`
            }
          </div>
          
          {(reportData.totalIncome > 0 || reportData.totalExpenses > 0) && (
            <p className="text-sm text-gray-500 mt-2">
              {reportData.profit >= 0 
                ? `As receitas superaram as despesas em ${formatCurrency(reportData.profit)} neste período.`
                : `As despesas superaram as receitas em ${formatCurrency(Math.abs(reportData.profit))} neste período.`
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
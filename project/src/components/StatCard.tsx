import React from 'react';
import { formatCurrency } from '../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  trend?: number;
  type?: 'income' | 'expense' | 'profit';
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  previousValue,
  trend,
  type = 'profit',
  icon,
}) => {
  const getColorClass = () => {
    switch (type) {
      case 'income':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'expense':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return value >= 0
          ? 'bg-amber-50 text-amber-600 border-amber-100'
          : 'bg-red-50 text-red-600 border-red-100';
    }
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    
    if (trend >= 0) {
      return (
        <div className="flex items-center text-emerald-600">
          <TrendingUp size={14} className="mr-1" />
          <span className="text-xs">{trend.toFixed(1)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown size={14} className="mr-1" />
          <span className="text-xs">{Math.abs(trend).toFixed(1)}%</span>
        </div>
      );
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getColorClass()}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      <p className="text-2xl font-bold">{formatCurrency(value)}</p>
      
      {(previousValue !== undefined || trend !== undefined) && (
        <div className="mt-2 flex items-center text-xs">
          {previousValue !== undefined && (
            <span className="opacity-80 mr-2">
              Mês anterior: {formatCurrency(previousValue)}
            </span>
          )}
          {getTrendIcon()}
        </div>
      )}
    </div>
  );
};

export default StatCard;
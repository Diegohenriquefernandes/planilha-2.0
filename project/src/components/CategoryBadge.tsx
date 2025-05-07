import React from 'react';
import { Category } from '../types';
import { getLighterColor } from '../utils/helpers';

interface CategoryBadgeProps {
  category: Category;
  amount?: number;
  percentage?: number;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  amount,
  percentage,
}) => {
  return (
    <div 
      className="flex items-center justify-between rounded-md px-3 py-2 mb-2"
      style={{ 
        backgroundColor: getLighterColor(category.color, 0.15),
        borderLeft: `4px solid ${category.color}`
      }}
    >
      <span className="font-medium" style={{ color: category.color }}>
        {category.name}
      </span>
      
      {(amount !== undefined || percentage !== undefined) && (
        <div className="flex items-center">
          {amount !== undefined && (
            <span className="text-sm font-medium text-gray-700 mr-2">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(amount)}
            </span>
          )}
          
          {percentage !== undefined && (
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ 
                backgroundColor: getLighterColor(category.color, 0.3),
                color: category.color 
              }}
            >
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryBadge;
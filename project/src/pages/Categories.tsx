import React, { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Category } from '../types';
import { Tag, Trash2, Edit, Check, X } from 'lucide-react';

const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    type: 'income',
    color: '#10B981',
  });
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const colorOptions = [
    { color: '#10B981', name: 'Verde' },
    { color: '#3B82F6', name: 'Azul' },
    { color: '#F59E0B', name: 'Amarelo' },
    { color: '#EF4444', name: 'Vermelho' },
    { color: '#8B5CF6', name: 'Roxo' },
    { color: '#EC4899', name: 'Rosa' },
    { color: '#6366F1', name: 'Índigo' },
    { color: '#14B8A6', name: 'Turquesa' },
  ];

  const validateCategory = (category: Omit<Category, 'id'>): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!category.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!category.color) {
      newErrors.color = 'Cor é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = () => {
    if (validateCategory(newCategory)) {
      addCategory(newCategory);
      setNewCategory({
        name: '',
        type: 'income',
        color: '#10B981',
      });
      setErrors({});
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setErrors({});
  };

  const handleUpdateCategory = () => {
    if (editingCategory && validateCategory(editingCategory)) {
      updateCategory(editingCategory);
      setEditingCategory(null);
      setErrors({});
    }
  };

  const confirmDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    setShowDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">Gestão de Categorias</h2>
        <p className="text-sm text-gray-500">
          Adicione e gerencie as categorias de receitas e despesas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Tag size={18} className="text-amber-600 mr-2" />
              <h3 className="text-lg font-medium">Nova Categoria</h3>
            </div>
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Vendas diárias"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-l-md ${
                    newCategory.type === 'income'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-r-md ${
                    newCategory.type === 'expense'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Despesa
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.color}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color: option.color })}
                    className={`w-full h-8 rounded-md border-2 ${
                      newCategory.color === option.color ? 'border-gray-700' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: option.color }}
                    title={option.name}
                  />
                ))}
              </div>
              {errors.color && <p className="mt-1 text-sm text-red-500">{errors.color}</p>}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors"
              >
                Adicionar Categoria
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <h3 className="text-lg font-medium">Categorias de Receitas</h3>
            </div>
            
            {incomeCategories.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {incomeCategories.map((category) => (
                    <li key={category.id} className="px-6 py-4 hover:bg-gray-50">
                      {editingCategory && editingCategory.id === category.id ? (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })}
                              className={`w-full px-3 py-2 border rounded-md ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <div className="flex space-x-1">
                              {colorOptions.map((option) => (
                                <button
                                  key={option.color}
                                  type="button"
                                  onClick={() => setEditingCategory({
                                    ...editingCategory,
                                    color: option.color,
                                  })}
                                  className={`w-6 h-6 rounded-full border ${
                                    editingCategory.color === option.color
                                      ? 'border-gray-700'
                                      : 'border-transparent'
                                  }`}
                                  style={{ backgroundColor: option.color }}
                                />
                              ))}
                            </div>
                            <button
                              onClick={handleUpdateCategory}
                              className="text-emerald-600 hover:text-emerald-800"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="flex-1">{category.name}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(category)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Edit size={16} />
                            </button>
                            
                            {showDeleteConfirm === category.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-600 hover:text-red-900 text-xs"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={cancelDelete}
                                  className="text-gray-600 hover:text-gray-900 text-xs"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => confirmDelete(category.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                Nenhuma categoria de receita definida.
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <h3 className="text-lg font-medium">Categorias de Despesas</h3>
            </div>
            
            {expenseCategories.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {expenseCategories.map((category) => (
                    <li key={category.id} className="px-6 py-4 hover:bg-gray-50">
                      {editingCategory && editingCategory.id === category.id ? (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) => setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })}
                              className={`w-full px-3 py-2 border rounded-md ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <div className="flex space-x-1">
                              {colorOptions.map((option) => (
                                <button
                                  key={option.color}
                                  type="button"
                                  onClick={() => setEditingCategory({
                                    ...editingCategory,
                                    color: option.color,
                                  })}
                                  className={`w-6 h-6 rounded-full border ${
                                    editingCategory.color === option.color
                                      ? 'border-gray-700'
                                      : 'border-transparent'
                                  }`}
                                  style={{ backgroundColor: option.color }}
                                />
                              ))}
                            </div>
                            <button
                              onClick={handleUpdateCategory}
                              className="text-emerald-600 hover:text-emerald-800"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="flex-1">{category.name}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(category)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Edit size={16} />
                            </button>
                            
                            {showDeleteConfirm === category.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-600 hover:text-red-900 text-xs"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={cancelDelete}
                                  className="text-gray-600 hover:text-gray-900 text-xs"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => confirmDelete(category.id)}
                                className="text-gray-500 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                Nenhuma categoria de despesa definida.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
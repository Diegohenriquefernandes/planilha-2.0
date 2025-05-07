import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  Tag,
  Settings
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/income', icon: <TrendingUp size={20} />, label: 'Receitas' },
    { to: '/expenses', icon: <TrendingDown size={20} />, label: 'Despesas' },
    { to: '/reports', icon: <BarChart size={20} />, label: 'Relatórios' },
    { to: '/categories', icon: <Tag size={20} />, label: 'Categorias' },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-emerald-800 text-white">
      <div className="p-4 border-b border-emerald-700">
        <h1 className="text-xl font-bold flex items-center">
          <Settings className="mr-2" /> Cantina Financeira
        </h1>
      </div>
      <nav className="flex-1 pt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="mb-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm transition-colors duration-150 hover:bg-emerald-700 ${
                    isActive ? 'bg-emerald-700 font-medium' : ''
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 text-xs text-emerald-300 border-t border-emerald-700">
        <p>v1.0.0 Cantina Financeira</p>
      </div>
    </aside>
  );
};

export default Sidebar;
import React from 'react';
import { Menu, X, UserCircle, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/income':
        return 'Receitas';
      case '/expenses':
        return 'Despesas';
      case '/reports':
        return 'Relatórios';
      case '/categories':
        return 'Categorias';
      default:
        return 'Dashboard';
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const exportData = () => {
    alert('Exportando dados...');
    // Implementação da exportação de dados seria aqui
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden mr-4 text-gray-600"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportData}
            className="text-sm flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <Download size={18} className="mr-1" />
            <span className="hidden md:inline">Exportar</span>
          </button>
          <div className="flex items-center">
            <span className="hidden md:block text-sm text-gray-600 mr-2">Administrador</span>
            <UserCircle size={24} className="text-gray-600" />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-emerald-800 text-white">
          <div className="py-3">
            <NavItem to="/" label="Dashboard" icon={<LayoutDashboard size={18} />} onClick={toggleMobileMenu} />
            <NavItem to="/income" label="Receitas" icon={<TrendingUp size={18} />} onClick={toggleMobileMenu} />
            <NavItem to="/expenses" label="Despesas" icon={<TrendingDown size={18} />} onClick={toggleMobileMenu} />
            <NavItem to="/reports" label="Relatórios" icon={<BarChart size={18} />} onClick={toggleMobileMenu} />
            <NavItem to="/categories" label="Categorias" icon={<Tag size={18} />} onClick={toggleMobileMenu} />
          </div>
        </nav>
      )}
    </header>
  );
};

// Componente de item de navegação para o menu mobile
const NavItem = ({ to, label, icon, onClick }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 transition-colors duration-150 hover:bg-emerald-700 ${
          isActive ? 'bg-emerald-700 font-medium' : ''
        }`
      }
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Header;
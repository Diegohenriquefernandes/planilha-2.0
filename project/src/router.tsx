import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Categories from './pages/Categories';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'income',
        element: <Income />,
      },
      {
        path: 'expenses',
        element: <Expenses />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
    ],
  },
]);

export default router;
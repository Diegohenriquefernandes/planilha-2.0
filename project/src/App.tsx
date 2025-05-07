import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { FinanceProvider } from './contexts/FinanceContext';
import router from './router';

function App() {
  return (
    <FinanceProvider>
      <RouterProvider router={router} />
    </FinanceProvider>
  );
}

export default App;
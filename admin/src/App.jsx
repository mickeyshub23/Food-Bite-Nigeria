import React, { useEffect } from 'react';
import { supabase } from './utils/supabase';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import OrdersManagement from './pages/OrdersManagement';
import CategoriesManagement from './pages/CategoriesManagement';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-warm_off_white">
        <Routes />
      </div>
    </AuthProvider>
  );
};

const Routes = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <LoginPage />;
  return <AdminDashboard />;
};

export default App;
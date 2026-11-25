import { supabase } from './utils/supabase';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
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
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <LoginPage />;
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    supabase.auth.signOut();
    return <div className="flex items-center justify-center h-screen text-center">Access denied</div>;
  }
  return <AdminDashboard />;
};

export default App;
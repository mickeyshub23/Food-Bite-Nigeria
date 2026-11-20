import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { count: todayOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      const { data: paid } = await supabase
        .from('orders')
        .select('total_kobo')
        .eq('status', 'delivered');
      const revenue = paid?.reduce((sum, o) => sum + parseInt(o.total_kobo), 0) || 0;
      const formattedRevenue = '₦' + Math.round(revenue / 100).toLocaleString();

      const { count: pending } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock', 5)
        .gt('stock', 0);

      setStats({ todayOrders, revenue: formattedRevenue, pending, lowStockCount });

      const { data: recent } = await apiFetch('/api/admin/orders');
      setRecentOrders(recent?.data?.slice(0, 5) || []);

      const { data: lowStockItems } = await supabase
        .from('products')
        .select('*')
        .lte('stock', 5)
        .gt('stock', 0)
        .order('stock', { ascending: true });
      setLowStock(lowStockItems || []);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-warm_off_white">
      <nav className="border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <span className="font-headline font-bold text-xl text-dark_gray">
                <span className="text-rust">Food Bite</span> Admin
              </span>
              <a href="/admin/products" className="text-sm text-medium_gray hover:text-rust transition-colors">Products</a>
              <a href="/admin/orders" className="text-sm text-medium_gray hover:text-rust transition-colors">Orders</a>
              <a href="/admin/categories" className="text-sm text-medium_gray hover:text-rust transition-colors">Categories</a>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-medium_gray hover:text-rust transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">{stats?.todayOrders || 0} orders today</h3>
            <p className="font-headline font-bold text-2xl text-rust">{stats?.revenue || '₦0'}</p>
          </div>
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">Revenue</h3>
            <p className="font-headline font-bold text-2xl text-rust">{stats?.revenue || '₦0'}</p>
          </div>
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">{stats?.pending || 0} pending orders</h3>
            <p className="font-headline font-bold text-2xl text-amber-600">{stats?.pending || 0}</p>
          </div>
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">{stats?.lowStockCount || 0} low stock items</h3>
            <p className="font-headline font-bold text-2xl text-amber-600">{stats?.lowStockCount || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-card border border-border p-5">
            <h2 className="font-headline font-bold text-lg text-dark_gray mb-4">Recent orders</h2>
            {loading ? (
              <Skeleton variant="text" count={4} />
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} className="w-6 h-6 text-xs" />
                      <span className="font-medium">{order.order_number}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline font-bold text-rust">{'₦' + Math.round(order.total_kobo / 100).toLocaleString()}</span>
                      <p className="text-xs text-medium_gray">{order.items_count || 0} items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-card border border-border p-5">
            <h2 className="font-headline font-bold text-lg text-dark_gray mb-4">Low stock alerts</h2>
            {lowStock.length === 0 ? (
              <EmptyState title="No low stock items" description="All products are well stocked." />
            ) : (
              <div className="space-y-3">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-amber-600 font-label font-semibold">{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import CategoryChip from '../components/CategoryChip';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadOrders();
  }, []);

  const loadStats = async () => {
    try {
      // Today's orders
      const today = new Date().toISOString().split('T')[0];
      const { count: todayOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Revenue
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total_kobo')
        .eq('status', 'delivered');

      const revenue = paidOrders?.reduce((sum, o) => sum + parseInt(o.total_kobo), 0) || 0;
      const formattedRevenue = '₦' + Math.round(revenue / 100).toLocaleString();

      // Pending orders
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Low stock items
      const { count: lowStock } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock', 5)
        .gt('stock', 0);

      setStats({
        todayOrders,
        revenue: formattedRevenue,
        pendingOrders,
        lowStock
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const { data: o } = await apiFetch('/api/admin/orders');
      setOrders(o?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-gray-200 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-dark_gray">Admin dashboard</h2>
          <p className="text-medium_gray mb-8">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm_off_white">
      <nav className="border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="font-headline font-bold text-xl text-dark_gray">
                <span className="text-rust">Food Bite</span> Admin
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-medium_gray">
              <span>Welcome, {user?.email?.split('@')[0] || 'Admin'}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-rust hover:underline font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's orders */}
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">{stats.todayOrders} orders today</h3>
            <p className="font-headline font-bold text-2xl text-rust">{stats.revenue}</p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">Revenue</h3>
            <p className="font-headline font-bold text-2xl text-rust">{stats.revenue}</p>
          </div>

          {/* Pending orders */}
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">
              {stats.pendingOrders} pending
            </h3>
            <p className="font-headline font-bold text-2xl text-amber-600">
              {stats.pendingOrders}
            </p>
          </div>

          {/* Low stock items */}
          <div className="bg-white rounded-card border border-border p-5">
            <h3 className="font-label text-xs uppercase tracking-wider text-medium_gray mb-3">
              {stats.lowStock} low stock
            </h3>
            <p className="font-headline font-bold text-2xl text-amber-600">
              {stats.lowStock}
            </p>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-card border border-border p-5">
          <h2 className="font-headline font-bold text-lg text-dark_gray mb-4">Recent orders</h2>
          {orders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description="Orders will appear here."
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} className="w-6 h-6 text-xs" />
                    <span className="font-medium">{order.order_number}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-headline font-bold text-rust">{order.total_kobo}</span>
                    <p className="text-xs text-medium_gray">{order.items_count || 0} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { apiFetch } from '../utils/api';
import { UseAuth } from '../context/AuthContext';
import Button from './components/Button';
import StatusBadge from './components/StatusBadge';
import EmptyState from './components/EmptyState';
import Skeleton from './components/Skeleton';

const OrdersManagement = () => {
  const { user } = UseAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data: o } = await apiFetch('/api/admin/orders');
      setOrders(o?.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage({ show: true, text: 'Error loading orders', type: 'error' });
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
      loadOrders();
      setMessage({ show: true, text: 'Order status updated', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ show: true, text: 'Error updating order', type: 'error' });
    }
  };

  if (!user) return null;

  return (
    <div className="bg-warm_off_white">
      <header className="border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <span className="font-headline font-bold text-xl text-dark_gray">
                <span className="text-rust">Food Bite</span> Admin
              </span>
            </div>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-medium_gray hover:text-rust transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-card border border-border p-5 mb-6">
          <h2 className="font-headline font-bold text-lg text-dark_gray mb-4">Orders</h2>
          {loading ? (
            <Skeleton variant="text" count={4} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="font-label font-semibold text-medium_gray text-left">Order #</th>
                    <th className="font-label font-semibold text-medium_gray text-left">Customer</th>
                    <th className="font-label font-semibold text-medium_gray text-left">Total</th>
                    <th className="font-label font-semibold text-medium_gray text-left">Status</th>
                    <th className="font-label font-semibold text-medium_gray text-left">Items</th>
                    <th className="font-label font-semibold text-medium_gray text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-gray-50">
                      <td className="font-medium">{order.order_number}</td>
                      <td>{order.contact_email}</td>
                      <td>{'₦' + Math.round(order.total_kobo / 100).toLocaleString()}</td>
                      <td><StatusBadge status={order.status} className="text-xs" /></td>
                      <td>{order.items_count || 0}</td>
                      <td className="text-right">
                        <select
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="w-24 px-2 py-1 rounded-lg bg-white shadow-sm border border-border text-sm focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="on_the_way">On the way</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {message.show && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-{message.type === 'success' ? 'green' : 'red'}-50 border border-{message.type === 'success' ? 'green' : 'red'}-200 rounded-md p-4 text-{message.type === 'success' ? 'green' : 'red'}-700 text-sm">
              {message.text}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersManagement;
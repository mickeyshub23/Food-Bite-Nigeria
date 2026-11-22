import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { apiFetch } from '../utils/supabase';
import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import StatusBadge from '../components/StatusBadge';

const AccountPage = () => {
  const { orderId } = useParams();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Profile
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(prof);

    // Orders
    const { data: ords } = await apiFetch('/api/orders');
    setOrders(ords?.data || []);

    // Addresses
    const { data: addrs } = await supabase
      .from('addresses')
      .select('*')
      .eq('profile_id', user.id);
    setAddresses(addrs || []);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm_off_white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse mb-4 mx-auto" />
          <p className="text-sm text-medium_gray">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm_off_white">
      <header className="border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="font-headline font-bold text-xl text-dark_gray">
              <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-medium_gray hover:text-rust transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-headline font-bold text-3xl text-dark_gray mb-6">My account</h1>

        {orderId ? (
          <div className="bg-white rounded-card border border-border p-6">
            <h2 className="font-headline font-bold text-xl text-dark_gray mb-4">
              Order #{orderId}
            </h2>
            {/* Order detail timeline would go here */}
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-6 border-b border-border mb-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'text-rust border-b-2 border-rust' : 'text-medium_gray hover:text-rust'}`}
              >
                My orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`py-3 text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'text-rust border-b-2 border-rust' : 'text-medium_gray hover:text-rust'}`}
              >
                My addresses
              </button>
            </div>

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <EmptyState
                    title="No orders yet"
                    description="Start shopping to see your orders here."
                    actionText="Browse menu"
                    onAction={() => window.location.href = '/shop'}
                  />
                ) : (
                  orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <EmptyState
                    title="No addresses saved"
                    description="Add your address to make checkout easier."
                    actionText="Add address"
                    onAction={() => {
                      // Would open a modal or navigate
                      alert('Address form would go here');
                    }}
                  />
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="bg-white rounded-card border border-border p-4">
                      <h3 className="font-headline font-semibold text-base text-dark_gray mb-2">
                        {addr.recipient_name}
                      </h3>
                      <p className="text-sm text-medium_gray mb-2">
                        {addr.address_line_1}{addr.address_line_2 && `, ${addr.address_line_2}`}
                      </p>
                      <p className="text-xs text-medium_gray mb-2">
                        {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      <span className="text-xs font-medium text-medium_gray">
                        Phone: {addr.phone}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AccountPage;
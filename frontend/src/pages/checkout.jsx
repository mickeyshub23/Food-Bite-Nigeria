import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiFetch, supabase } from '../utils/supabase';
import EmptyState from '../components/EmptyState';

const formatNaira = (kobo) => '₦' + Math.round(kobo / 100).toLocaleString();

const CheckoutPage = () => {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    recipientName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    deliveryZoneId: null,
    promoCode: ''
  });
  const [deliveryQuotes, setDeliveryQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setProfile({ email: session.user.email });
      }
    };
    loadProfile();
  }, []);

  const loadDeliveryQuotes = async () => {
    if (!form.city || !form.state) return;
    try {
      const { data, error } = await apiFetch(`/api/delivery/quote?zone_id=${form.deliveryZoneId}`);
      if (!error) setDeliveryQuotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaystack = async (e) => {
    e.preventDefault();
    if (!selectedQuote) {
      setError('Please select a delivery zone');
      return;
    }
    if (total <= 0) {
      setError('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items,
          delivery_address: {
            recipient_name: form.recipientName,
            phone: form.phone,
            address_line_1: form.addressLine1,
            address_line_2: form.addressLine2 || '',
            city: form.city,
            state: form.state,
            postal_code: form.postalCode
          },
          delivery_zone_id: selectedQuote.zone_id,
          promo_code: form.promoCode || undefined,
          contact_email: profile?.email || '',
          contact_phone: form.phone
        })
      });

      if (error) throw new Error(error.message);

      // Redirect to Paystack
      window.location.href = `/payment/callback?reference=${data.data.order.order_number}`;
    } catch (err) {
      setError(err.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm_off_white">
      <header className="border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="font-headline font-bold text-xl text-dark_gray">
              <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left: Order details */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-headline font-bold text-2xl text-dark_gray">Order details</h2>

            {/* Items */}
            {itemCount === 0 ? (
              <EmptyState
                title="Your cart is empty"
                description="Start adding some food to your cart."
                actionText="Browse menu"
                onAction={() => navigate('/shop')}
              />
            ) : (
              <div className="bg-white rounded-card border border-border p-4 space-y-3">
                {items.map((item) => {
                  const validation = { valid: true };
                  return (
                    <div key={item.product_id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-card overflow-hidden flex-shrink-0">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300">
                          <span className="text-xl">🍽️</span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between gap-1">
                        <h3 className="font-headline font-bold text-base text-dark_gray">{item.product_name}</h3>
                        <span className="text-xs text-medium_gray">{formatNaira(item.unit_price_kobo)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-card border border-border p-4">
              <h3 className="font-label font-semibold text-medium_gray uppercase tracking-wider text-xs mb-3">Order summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-medium_gray">Subtotal</span>
                  <span className="font-semibold">{formatNaira(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium_gray">Delivery fee</span>
                  <span className="font-semibold">₦{selectedQuote?.fee_kobo / 100 || 500}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium_gray">Cooler deposit (refundable)</span>
                  <span className="font-semibold">₦500</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-lg">
                  <span className="text-dark_gray">Total</span>
                  <span className="text-rust">{formatNaira(total + 600)}</span>
                </div>
              </div>
            </div>

            {/* Address form */}
            <div className="mt-6">
              <h3 className="font-label font-semibold text-medium_gray mb-4">Delivery details</h3>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={(e) => handlePaystack(e)} className="space-y-4">
                <div>
                  <label className="block text-sm text-medium_gry mb-1">Recipient name</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={form.recipientName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-medium_gray mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    placeholder="+234 800..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-medium_gray mb-1">Address</label>
                  <textarea
                    name="addressLine1"
                    placeholder="Street address"
                    value={form.addressLine1}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-medium_gray mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-medium_gray mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-medium_gray mb-1">Postal code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                  />
                </div>

                {/* Delivery zone selector */}
                <div>
                  <label className="block text-sm text-medium_gray mb-1">Delivery zone</label>
                  <select
                    name="deliveryZoneId"
                    value={form.deliveryZoneId || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                  >
                    <option value="">Select delivery zone</option>
                    {deliveryQuotes.map((q) => (
                      <option key={q.zone_id} value={q.zone_id}>
                        {q.zone_name} - ₦{q.fee_kobo / 100}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Promo code */}
                <div>
                  <label className="block text-sm text-medium_gray mb-1">Promo code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="promoCode"
                      value={form.promoCode}
                      onChange={handleChange}
                      placeholder="NAIJAFEAST"
                      className="flex-1 px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                    />
                    <button
                      type="button"
                      className="px-4 py-3 bg-rust text-white font-headline font-semibold rounded-md"
                      onClick={() => apiFetch('/api/promo/validate', {
                        method: 'POST',
                        body: JSON.stringify({ code: form.promoCode, order_total_kobo: total })
                      })}
                    >
                      Validate
                    </button>
                  </div>
                  {form.promoCode && (
                    <p className="mt-2 text-sm text-amber-600">
                      {form.promoCode} gives {parseFloat(form.promoCode.percent || 0)}% off orders above ₦25,000
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rust text-white font-headline font-semibold py-3 rounded-md hover:bg-rust/90 transition-colors"
                >
                  {loading ? 'Processing...' : 'Place order'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Cart preview */}
          <div className="lg:col-span-1 bg-white rounded-card border border-border p-4 sticky top-24">
            <h3 className="font-label font-semibold text-medium_gray uppercase tracking-wider text-xs mb-3">Cart</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatNaira(total)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span>Delivery</span>
                <span>₦{selectedQuote?.fee_kobo / 100 || 500}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatNaira(total + 600)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
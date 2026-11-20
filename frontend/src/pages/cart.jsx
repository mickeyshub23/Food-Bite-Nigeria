import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../utils/api';
import EmptyState from '../components/EmptyState';

const CartPage = () => {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [validatedItems, setValidatedItems] = useState({});

  useEffect(() => {
    validateCart();
  }, [items]);

  const validateCart = async () => {
    const cartItems = items.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
    try {
      const response = await apiFetch('/api/cart/validate', {
        method: 'POST',
        body: JSON.stringify({ items: cartItems })
      });
      const results = {};
      response.data.forEach(item => {
        results[item.product_id] = item;
      });
      setValidatedItems(results);
    } catch (err) {
      console.error(err);
    }
  };

  const formatNaira = (kobo) => '₦' + Math.round(kobo / 100).toLocaleString();

  if (itemCount === 0) {
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            title="Your cart is empty"
            description="Start adding some delicious food to your cart."
            actionText="Browse menu"
            onAction={() => navigate('/shop')}
          />
        </main>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-3 space-y-4">
            {items.map((item) => {
              const validation = validatedItems[item.product_id];
              const isValid = validation?.valid !== false;
              const maxQty = validation?.max_quantity || item.stock || 99;
              const currentPrice = validation?.current_price_kobo || item.unit_price_kobo;
              const lineTotal = currentPrice * item.quantity;

              return (
                <div key={item.product_id} className="bg-white rounded-card border border-border p-4 flex items-center gap-4">
                  <div className="w-24 h-24 rounded-card overflow-hidden flex-shrink-0">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-headline font-bold text-base text-dark_gray">
                        {item.product_name}
                      </h3>
                      <span className="font-label text-xs text-medium_gray">
                        {formatNaira(currentPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-warm_off_white flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        disabled={!isValid}
                      >
                        -
                      </button>
                      <span className="font-headline font-semibold w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, Math.min(maxQty, item.quantity + 1))}
                        className="w-8 h-8 rounded-lg bg-warm_off_white flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        disabled={!isValid || item.quantity >= maxQty}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-headline font-bold text-lg text-rust">
                      {formatNaira(lineTotal)}
                    </span>
                    {!isValid && validation?.reason && (
                      <span className="text-xs font-label text-red-600 bg-red-50 px-2 py-1 rounded-md mt-1">
                        {validation.reason}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1={18} y1={6} x2={6} y2={18} />
                      <line x1={6} y1={6} x2={18} y2={18} />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1 bg-white rounded-card border border-border p-5 space-y-4 sticky top-24">
            <h3 className="font-label font-semibold text-medium_gray uppercase tracking-wider text-xs mb-3">Order summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-medium_gray">Subtotal</span>
                <span className="font-semibold">{formatNaira(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium_gray">Delivery fee</span>
                <span className="font-semibold">₦500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium_gray">Cooler deposit (refundable)</span>
                <span className="font-semibold">₦500</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-semibold text-lg">
                <span className="text-dark_gray">Total</span>
                <span className="text-rust">{formatNaira(total + 1000)}</span>
              </div>
            </div>

            <button
              className="w-full bg-rust text-white font-headline font-semibold py-3 rounded-md hover:bg-rust/90 transition-colors"
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
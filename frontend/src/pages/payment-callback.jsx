import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/supabase';
import { supabase } from '../utils/supabase';

const PaymentCallbackPage = () => {
  const navigate = useNavigate();
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference');
    setReference(ref || '');
    if (ref) {
      verifyPayment(ref);
    } else {
      setError('Missing payment reference');
      setLoading(false);
    }
  }, []);

  const verifyPayment = async (ref) => {
    try {
      const { data, error: apiError } = await apiFetch(`/api/payments/verify?reference=${ref}`);
      if (apiError) throw new Error(apiError.message);
      setStatus(data.data.status);
      setOrder(data.data.order);
      if (data.data.status === 'success') {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Verification failed');
      setLoading(false);
    }
  };

  const goToAccount = () => {
    navigate('/account/orders');
  };

  const goToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm_off_white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse mb-4 mx-auto" />
          <p className="text-sm text-medium_gray">Verifying payment...</p>
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
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-card border border-border p-8 text-center">
          {status === 'success' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-green-600">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-headline font-bold text-2xl text-dark_gray mb-2">
                Payment successful!
              </h1>
              <p className="text-sm text-medium_gray mb-4">
                Your order has been confirmed. We'll notify you via email when it ships.
              </p>
              <p className="text-xs text-medium_gray mb-6">
                Reference: <span className="font-medium">{reference}</span>
              </p>
              <button
                onClick={goToAccount}
                className="w-full bg-rust text-white font-headline font-semibold py-3 rounded-md hover:bg-rust/90 transition-colors"
              >
                View order
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-red-600">
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </div>
              <h1 className="font-headline font-bold text-2xl text-dark_gray mb-2">
                Payment failed or pending
              </h1>
              <p className="text-sm text-medium_gray mb-4">
                We couldn't verify your payment. Please try again or contact support.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm mb-4">
                  {error}
                </div>
              )}
              <p className="text-xs text-medium_gray mb-6">
                Reference: <span className="font-medium">{reference}</span>
              </p>
              <button
                onClick={goToHome}
                className="w-full bg-rust text-white font-headline font-semibold py-3 rounded-md hover:bg-rust/90 transition-colors"
              >
                Continue shopping
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentCallbackPage;
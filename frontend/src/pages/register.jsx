import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(redirectTo);
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

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-card border border-border p-8">
          <h2 className="font-headline font-bold text-2xl text-dark_gray mb-2 text-center">Create account</h2>
          <p className="text-sm text-medium_gray text-center mb-8">
            Join Food Bite Services to start ordering
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-medium_gray mb-1">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800..."
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rust text-white font-headline font-semibold py-3 rounded-md hover:bg-rust/90 transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-medium_gray mt-6">
            Already have an account? <Link to="/login" className="text-rust font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
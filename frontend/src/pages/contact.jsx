import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/supabase';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
    setLoading(false);
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-headline font-bold text-3xl text-dark_gray mb-8 text-center">Contact Us</h1>

        <div className="bg-white rounded-card border border-border p-8 space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700 text-sm">
              Your message has been sent! We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-medium_gray mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              >
                <option value="">Select a topic</option>
                <option value="order">Order inquiry</option>
                <option value="delivery">Delivery question</option>
                <option value="payment">Payment issue</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-medium_gray mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rust text-white font-headline font-semibold py-3 rounded-md hover:bg-rust/90 transition-colors"
            >
              {loading ? 'Sending...' : 'Send message'}
            </button>
          </form>

          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="font-label font-semibold text-medium_gray">Or reach us directly</h3>
            <div className="text-sm text-medium_gray space-y-1">
              <p>Email: support@foodbite.ng</p>
              <p>Phone: +234-XXXX-XXXX</p>
              <p>Address: Kano, Nigeria</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
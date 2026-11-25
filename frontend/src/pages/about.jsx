import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const AboutPage = () => {
  const [, setSettings] = useState({});

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase.from('settings').select('*');
      const map = {};
      (s || []).forEach(row => { map[row.key] = row.value; });
      setSettings(map);
    };
    load();
  }, []);

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-headline font-bold text-3xl text-dark_gray mb-8 text-center">About Food Bite Services</h1>

        <div className="bg-white rounded-card border border-border p-8 space-y-6">
          <h2 className="font-headline font-bold text-xl text-dark_gray">Welcome to Food Bite Services</h2>
          <p className="text-medium_gray text-sm">
            Food Bite Services is your trusted partner in delivering authentic Nigerian cuisine to your door. We connect you with the finest food products and dishes from across the country, ensuring freshness and quality in every bite.
          </p>

          <h3 className="font-label font-semibold text-medium_gray uppercase tracking-wider text-xs">Our mission</h3>
          <p className="text-medium_gray text-sm">
            To make Nigerian food accessible and convenient for everyone, whether you're looking for everyday staples or special occasion dishes.
          </p>

          <h3 className="font-label font-semibold text-medium_gray uppercase tracking-wider text-xs">Why choose us</h3>
          <ul className="text-medium_gray text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-rust">•</span>
              <span>Fresh ingredients and authentic recipes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rust">•</span>
              <span>Fast delivery across Nigeria</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rust">•</span>
              <span>Secure payment through Paystack</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rust">•</span>
              <span>Customer-first approach</span>
            </li>
          </ul>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-medium_gray text-center">
              © 2026 Food Bite Services. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
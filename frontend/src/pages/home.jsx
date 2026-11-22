import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import CategoryChip from '../components/CategoryChip';
import StatusBadge from '../components/StatusBadge';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumb from '../components/Breadcrumb';
import FloatingBasketBar from '../components/FloatingBasketBar';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../utils/supabase';
import { useCart } from '../context/CartContext';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [promo, setPromo] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loadError, setLoadError] = useState('');
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadError('');

    // Categories
    const { data: cats, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (catError) console.error(catError);
    else setCategories(cats || []);

    // Best sellers
    const { data: best, error: bestError } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6);
    if (bestError) console.error(bestError);
    else setProducts(best || []);

    // Testimonials
    const { data: t, error: tError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (tError) console.error(tError);
    else setTestimonials(t || []);

    // Promo banner (server-side, never reads promo_codes directly)
    try {
      const promoRes = await apiFetch('/api/promo/active');
      if (promoRes?.data) setPromo(promoRes.data);
    } catch (err) {
      console.error('Promo unavailable', err);
    }

    if (catError || bestError || tError) {
      setLoadError('Some content failed to load. Please check your connection and refresh.');
    }
  };

  const handleAddToCart = async (product) => {
    // Validate against API
    const { error } = await apiFetch('/api/cart/validate', {
      method: 'POST',
      body: JSON.stringify({ items: [{ product_id: product.id, quantity: 1 }] })
    });
    if (error) {
      alert(error.message);
      return;
    }
    addItem(product, 1);
  };

  return (
    <div className="min-h-screen bg-warm_off_white">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="font-headline font-bold text-xl text-dark_gray">
              <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      {loadError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
            {loadError}
          </div>
        </div>
      )}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Promo banner */}
            {promo && (
              <div className="bg-rust text-white rounded-lg p-5 md:p-8 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-headline font-semibold">🎉 {promo.code} - {promo.percent}% OFF</span>
                </div>
                <p className="text-white/90 text-sm">{promo.description || '15% off orders above ₦25,000'}</p>
              </div>
            )}

            {/* Search & category cards */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 rounded-lg bg-white shadow-sm border border-border">
                <input
                  type="text"
                  placeholder="Search for food..."
                  className="w-full px-4 py-3 rounded-t-lg rounded-l-lg border-b border-border focus:outline-none focus:ring-2 focus:ring-rust"
                />
                <button className="px-4 py-3 rounded-b-lg rounded-r-lg bg-rust text-white font-headline font-semibold">
                  Search
                </button>
              </div>
              <button
                className="hidden lg:flex items-center justify-center gap-2 px-5 py-3 bg-rust text-white font-headline font-semibold rounded-t-lg rounded-b-lg"
              >
                <span>All Categories</span>
              </button>
            </div>

            {/* Category cards grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mt-6">
              {categories.slice(0, 6).map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-col items-center rounded-card border border-border p-4 hover:bg-rust/5 transition-colors cursor-pointer"
                >
                  <span className="text-rust text-sm font-medium mb-1">{cat.name}</span>
                  <div className="w-8 h-8 rounded-lg bg-warm_off_white flex items-center justify-center text-rust font-medium text-xs">
                    {cat.name.charAt(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="py-12 bg-white max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Home' }, { label: 'Best Sellers' }]} />
          <h2 className="font-headline font-bold text-2xl text-dark_gray mb-6 mb-lg-8">Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 bg-warm_off_white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline font-bold text-2xl text-dark_gray mb-6 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-card border border-border p-5">
                <p className="text-sm text-medium_gray mb-4">{t.content}</p>
                <div className="flex items-center gap-3">
                  <span className="text-amber-500 text-sm">★★★★★</span>
                  <span className="text-xs text-medium_gray">{t.name}</span>
                  <span className="text-xs text-medium_gray">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
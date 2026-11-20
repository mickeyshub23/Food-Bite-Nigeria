import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import CategoryChip from '../components/CategoryChip';
import StatusBadge from '../components/StatusBadge';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumb from '../components/Breadcrumb';
import FloatingBasketBar from '../components/FloatingBasketBar';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../utils/api';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({ category: null, sort: null });
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 35000 });
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: profile } = useState(() => null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const { searchParams } = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page') || '1');

    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })
      .eq('is_active', true);

    // Category filter
    if (activeFilters.category) {
      query = query.eq('category_id', activeFilters.category);
    }

    // Search
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Sort
    if (activeFilters.sort === 'price_asc') {
      query = query.order('price_kobo', { ascending: true });
    } else if (activeFilters.sort === 'price_desc') {
      query = query.order('price_kobo', { ascending: false });
    } else if (activeFilters.sort === 'rating_desc') {
      query = query.order('rating', { ascending: false });
    } else if (activeFilters.sort === 'featured') {
      query = query.eq('is_featured', true);
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;
    query = query.range(start, end);

    const { data, error, count } = await query;
    if (error) console.error(error);
    else {
      setProducts(data || []);
      setActiveFilters({
        category: searchParams.get('category') || null,
        sort: searchParams.get('sort') || null
      });
    }
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (!error) setCategories(data || []);
  };

  const handleAddToCart = async (product) => {
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

  const applyFilter = (filterType, value) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({ category: null, sort: null });
    setSearch('');
    const newUrl = `/shop?page=1`;
    // Update URL without re-rendering
    const history = window.history;
    history.pushState({}, '', newUrl);
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-warm_off_white">
      {/* Mobile menu toggle */}
      <button
        className="md:hidden mt-4 text-2xl text-rust"
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1={3} y1={6} x2={21} y2={6} />
          <line x1={3} y1={12} x2={21} y2={12} />
          <line x1={3} y1={18} x2={21} y2={18} />
        </svg>
      </button>

      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="font-headline font-bold text-xl text-dark_gray">
              <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
            </Link>

            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-4 font-label font-medium text-medium_gray">
              <select
                className="px-3 py-1.5 rounded-border border-border text-sm focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                onChange={(e) => applyFilter('sort', e.target.value)}
              >
                <option value="">Sort</option>
                <option value="featured">Featured first</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating_desc">Rating</option>
              </select>

              <select
                className="ml-4 px-3 py-1.5 rounded-border border-border text-sm focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                onChange={(e) => applyFilter('category', e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart + user */}
            <div className="flex items-center gap-3">
              <a href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-full bg-warm_off_white hover:bg-gray-100 text-dark_gray transition-colors">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 7l-5 5-5-5H3l9 9 9-9zM7 23l-3-3l5-5 3 3v5zM7 15l-3-3l5-5 3 3v5z" />
                </svg>
                {useCart ? (
                  useCart().itemCount
                ) : (
                  0
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[50] bg-white overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="font-headline font-bold text-xl text-dark_gray">Food Bite Services</Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-dark_gray">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            </div>
            <nav className="space-y-3 font-label font-medium">
              <Link to="/" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Home</Link>
              <Link to="/shop" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Shop</Link>
              <Link to="/cart" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Cart</Link>
              <Link to="/about" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">About</Link>
              <Link to="/contact" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Contact</Link>
            </nav>
          </div>
        </div>
      )}

      {/* Shop section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile filter button */}
          <button
            className="md:hidden mb-4 flex items-center gap-2 text-rust font-medium"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={8} />
              <polyline points="21 15 16 10 9 21" />
            </svg>
            <span>Filters</span>
          </button>

          {/* Filters sidebar (mobile) */}
          {isMobileMenuOpen && <FilterSidebar activeFilters={activeFilters} onClearAll={clearFilters} categories={categories} />}

          {/* Main content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Products */}
            <div className="lg:col-span-2 space-y-4">
              {/* Breadcrumb */}
              <Breadcrumb items={[{ label: 'Home' }, { label: 'Shop' }]} />

              {/* Search & sort */}
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Search for food, categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                  />
                  <button
                    className="px-4 py-3 bg-rust text-white font-headline font-semibold rounded-md"
                    onClick={() => setSearch('')}
                  >
                    Clear
                  </button>
                </div>

                <select
                  className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-rust transition-colors"
                  onChange={(e) => applyFilter('sort', e.target.value)}
                >
                  <option value="">Sort</option>
                  <option value="featured">Featured first</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="rating_desc">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {products.length > itemsPerPage && (
                <nav className="mt-6 flex justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className={`px-3 py-1 rounded border border-border ${
                        page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-rust text-white'
                      }`}
                    >
                      Prev
                    </button>
                    <span className="px-3 py-1 rounded border border-border">
                      Page {page} of {Math.ceil((products.length || 0) / itemsPerPage)}
                    </span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      className={`px-3 py-1 rounded border border-border ${
                        page >= Math.ceil((products.length || 0) / itemsPerPage) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-rust text-white'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </div>

            {/* Right: Filter sidebar (desktop) */}
            <div className="lg:col-span-1 bg-white rounded-card border border-border p-4 space-y-4">
              <FilterSidebar
                activeFilters={activeFilters}
                onClearAll={clearFilters}
                categories={categories}
              />
            </div>
          </div>

          {/* Floating basket bar */}
          <FloatingBasketBar
            itemCount={useCart ? useCart().itemCount : 0}
            totalKobo={useCart ? useCart().total : 0}
          />
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
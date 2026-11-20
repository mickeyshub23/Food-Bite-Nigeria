import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import CategoryChip from './CategoryChip';
import StatusBadge from './StatusBadge';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadCartCount = async () => {
      const cart = localStorage.getItem('foodbite_cart');
      if (cart) {
        const items = JSON.parse(cart);
        setCartCount(items.length);
      }
    };
    loadCartCount();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Desktop header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 font-headline font-bold text-xl text-dark_gray">
              <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 font-label font-medium text-medium_gray">
              <a href="/" className="hover:text-rust transition-colors">Home</a>
              <a href="/shop" className="hover:text-rust transition-colors">Shop</a>
              <a href="/about" className="hover:text-rust transition-colors">About</a>
              <a href="/contact" className="hover:text-rust transition-colors">Contact</a>
              <a href="/account" className="hover:text-rust transition-colors">My Account</a>
            </nav>

            {/* Search + Cart + User */}
            <div className="flex items-center gap-4">
              <button className="text-dark_gray hover:text-rust" onClick={() => setUserMenuOpen(!isUserMenuOpen)}>
                <User2 size={20} />
              </button>
              <a href="/cart" className="relative flex items-center justify-center w-10 h-10 rounded-full bg-warm_off_white hover:bg-gray-100 text-dark_gray transition-colors">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rust text-white text-[0.6rem] font-bold px-1 rounded-full">{cartCount}</span>
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between h-12 px-4">
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-dark_gray">
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2 font-headline font-bold text-xl text-dark_gray">
            <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
          </Link>
          <a href="/cart" className="relative flex items-center justify-center w-8 h-8 text-dark_gray">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rust text-white text-[0.5rem] font-bold px-1 rounded-full">{cartCount}</span>
            )}
          </a>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[50] bg-white overflow-y-auto">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" className="font-headline font-bold text-xl text-dark_gray">Food Bite Services</Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-dark_gray">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-3 font-label font-medium">
              <Link to="/" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Home</Link>
              <Link to="/shop" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Shop</Link>
              <Link to="/cart" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Cart</Link>
              <Link to="/about" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">About</Link>
              <Link to="/contact" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">Contact</Link>
              <Link to="/account" className="block py-2 hover:bg-rust/5 rounded-card hover:text-rust">My Account</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const FloatingBasketBar = ({ itemCount, totalKobo }) => {
  if (itemCount === 0) return null;

  const formatNaira = (kobo) => '₦' + Math.round(kobo / 100).toLocaleString();

  return (
    <Link to="/cart" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white border border-rust rounded-pill px-6 py-3 shadow-xl flex items-center gap-4 hover:shadow-2xl transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-rust/10 flex items-center justify-center">
          <ShoppingCart size={16} className="text-rust" />
        </div>
        <div className="text-left">
          <p className="font-label font-semibold text-sm text-dark_gray">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
          </p>
          <p className="font-headline font-bold text-rust text-sm">{formatNaira(totalKobo)}</p>
        </div>
      </div>
      <ArrowRight size={16} className="text-rust" />
    </Link>
  );
};

export default FloatingBasketBar;
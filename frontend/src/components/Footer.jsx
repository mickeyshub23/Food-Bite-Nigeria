import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 font-headline font-bold text-xl text-dark_gray">
            <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
          </Link>
          <p className="mt-3 text-sm text-medium_gray max-w-xs">
            Fresh Nigerian food delivered to your door. Order your favourites today.
          </p>
          <div className="flex gap-3 mt-4">
            <Link href="#" className="text-sm text-amber-500 hover:text-rust transition-colors" aria-label="Twitter">
              <Twitter size={16} />
            </Link>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-label font-semibold text-medium_gray mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-medium_gray">
            <li><a href="#" className="hover:text-rust transition-colors">Product Categories</a></li>
            <li><a href="#" className="hover:text-rust transition-colors">Delivery Info</a></li>
            <li><a href="#" className="hover:text-rust transition-colors">Return Policy</a></li>
            <li><a href="#" className="hover:text-rust transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-label font-semibold text-medium_gray mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-medium_gray">
            <li><a href="/account/addresses" className="hover:text-rust transition-colors">My Addresses</a></li>
            <li><a href="#" className="hover:text-rust transition-colors">My Orders</a></li>
            <li><a href="#" className="hover:text-rust transition-colors">Logout</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-medium_gray">
        <p>2026 Food Bite Services. All rights reserved.</p>
        <div>
          <a href="#" className="hover:text-rust transition-colors text-medium_gray underline decoration-double decoration-gray-300">Terms of Service</a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-rust transition-colors text-medium_gly">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
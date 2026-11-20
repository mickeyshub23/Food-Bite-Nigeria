import React from 'react';
import { Link } from 'react-router-dom';

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
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.58 3.18a8.11 8.11 0 0 0-1.16-1.01.06.06 0 0 0-.08-.05A5.87 5.87 0 0 0 14.06.04c-1.18 0-2.22.55-2.93 1.35.06.08.09.15.09.23 0 1.23-.25 2.28-.67 3.2.05.07.1.14.15.2 0 0 0 0 0 .07.07.14.14.14.15 0 1.47-.25 2.53-.7 3.39.06.12.12.25.18.37 0 0 0 1.18.44 2.22a12.32 12.32 0 0 1-.67 2.4 12.27 12.27 0 0 1-2.54.67 6.32 6.32 0 0 1-2.07-.67 5.51 5.51 0 0 1-.98-2.09 5.48 5.48 0 0 1-.56-2.37 8.21 8.21 0 0 0-1.17-1.08 8.07 8.07 0 0 0-1.03.02 3.94 3.94 0 0 0-.6 1.83 2.45 2.45 0 0 0-.06.03 2.45 2.45 0 0 0 .6 1.83 2.45 2.45 0 0 0 1.17.43 8.21 8.21 0 0 1-.57 2.36 5.51 5.51 0 0 1-2.04-.67 3.93 3.93 0 0 1-.99-2.09 5.48 5.48 0 0 1-.57-2.37 8.19 8.19 0 0 0-1.17-1.08 3.93 3.93 0 0 0-.6-1.83 2.45 2.45 0 0 0 .02-.03 2.45 2.45 0 0 0 .57-2.37 5.48 5.48 0 0 1-.56-2.37zM7.53 8.68a2.66 2.66 0 1 1 0-5.32 2.66 2.66 0 0 1 0 5.32zm8.62-1.58a.945.945 0 1 0 0-1.89.945.945 0 0 0 0 1.89zm1.19.95a4.49 4.49 0 1 1-4.5 4.5 4.49 4.49 0 0 1 4.5-4.5z" />
              </svg>
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
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-warm_off_white flex flex-col items-center justify-center text-center">
    <div className="text-6xl font-headline font-bold text-rust mb-4">404</div>
    <h1 className="font-headline font-bold text-2xl text-dark_gray mb-4">Page not found</h1>
    <p className="text-medium_gray text-sm mb-8 max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="bg-rust text-white font-headline font-semibold px-6 py-3 rounded-md hover:bg-rust/90 transition-colors"
    >
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;
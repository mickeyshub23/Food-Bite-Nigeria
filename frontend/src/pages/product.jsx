import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { apiFetch } from '../utils/supabase';
import ProductCard from '../components/ProductCard';
import StatusBadge from '../components/StatusBadge';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setProduct(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatNaira = (kobo) => '₦' + Math.round(kobo / 100).toLocaleString();

  if (!product || loading) {
    return (
      <div className="min-h-screen bg-warm_off_white flex items-center justify-center">
        <div className="bg-white rounded-card border border-border p-8 text-center">
          <div className="h-6 w-6 rounded-lg bg-gray-200 animate-pulse mb-4" />
          <h2 className="font-headline font-bold text-xl text-medium_gray">Product not found</h2>
          <p className="text-medium_gray mt-2">The product you're looking for may no longer be available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm_off_white">
      {/* Header */}
      <header className="border-b border-border bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="font-headline font-bold text-xl text-dark_gray">
              <span className="text-rust">Food Bite</span> <span className="text-medium_gray">Services</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Product image */}
          <div>
            <img
              src={product.image_url || '/placeholder-user-1.jpg'}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded-lg mb-4 shadow-lg"
            />
            <div className="flex gap-2">
              {product.rating > 0 && (
                <div>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-amber-500 text-xs ${i < Math.round(product.rating) ? 'filled' : ''}`}
                    >★</span>
                  ))}
                </div>
              )}
              <span className="text-xs text-medium_gray ml-1">
                {product.rating.toFixed(1)} ({product.rating_count || 0} ratings)
              </span>
            </div>
          </div>

          {/* Product details */}
          <div>
            <h1 className="font-headline font-bold text-3xl text-dark_gray mb-3">{product.name}</h1>

            <StatusBadge status={product.availability} className="mb-4" />

            <p className="text-medium_gray text-sm mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-headline font-bold text-3xl text-rust">{formatNaira(product.price_kobo)}</span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-medium_gray">Availability:</span>
              {product.availability === 'in_stock' && (
                <span className="text-green-600 font-label font-medium">In stock</span>
              )}
              {product.availability === 'low_stock' && (
                <span className="text-amber-600 font-label font-medium">
                  Only {product.stock} left
                </span>
              )}
              {product.availability === 'sold_out' && (
                <span className="text-gray-500 font-label font-medium">Sold out</span>
              )}
            </div>

            {/* Quantity */}
            <QuantityStepper
              quantity={1}
              onChange={(q) => console.log('Quantity:', q)}
            />

            {/* Add to cart */}
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              disabled={product.availability === 'sold_out'}
              onClick={() => {
                if (product.availability !== 'sold_out') {
                  addItem(product, 1);
                  alert('Added to cart!');
                }
              }}
            >
              {product.availability === 'sold_out' ? 'Sold out' : 'Add to cart'}
            </Button>

            {/* Related products */}
            <div className="mt-8">
              <h2 className="font-label font-semibold text-medium_gray mb-4">Related items</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
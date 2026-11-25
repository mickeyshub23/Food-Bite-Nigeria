import Button from './Button';

const ProductCard = ({ product, onAddToCart }) => {
  const formatNaira = (kobo) => '₦' + Math.round(kobo / 100).toLocaleString();
  const isSoldOut = product.availability === 'sold_out' || product.stock === 0;
  const isLowStock = product.availability === 'low_stock' || (product.stock > 0 && product.stock <= product.low_stock_threshold);

  return (
    <div className={`group bg-white rounded-card border border-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-rust/30 ${isSoldOut ? 'opacity-60' : ''}`}>
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <span className="text-4xl text-gray-300">🍽️</span>
          )}
        </div>
        {isLowStock && !isSoldOut && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-label font-semibold px-2.5 py-1 rounded-pill">
            Only {product.stock} left
          </span>
        )}
        {isSoldOut && (
          <span className="absolute top-2 left-2 bg-gray-600 text-white text-xs font-label font-semibold px-2.5 py-1 rounded-pill">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-headline font-bold text-base text-dark_gray mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="font-headline font-bold text-rust text-lg">{formatNaira(product.price_kobo)}</span>
          {product.rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-medium_gray">
              <span className="text-amber-500">★</span>
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <Button
          variant={isSoldOut ? 'secondary' : 'primary'}
          size="sm"
          className="w-full"
          disabled={isSoldOut}
          onClick={() => !isSoldOut && onAddToCart?.(product)}
        >
          {isSoldOut ? 'Sold out' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
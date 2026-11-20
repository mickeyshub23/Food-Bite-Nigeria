import React from 'react';
import { Link } from 'react-router-dom';
import CategoryChip from './CategoryChip';

const FilterSidebar = ({ activeFilters, onFilterToggle, categories, onClearAll }) => {
  return (
    <div className="bg-white rounded-card border border-border p-4 space-y-4 min-h-fit">
      <h3 className="font-label font-semibold text-medium_gray mb-4">Filters</h3>

      {categories && categories.length > 0 && (
        <div>
          <h4 className="font-sm text-medium_gray mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <CategoryChip
                key={cat.slug}
                name={cat.name}
                count={cat.product_count}
                active={activeFilters.category === cat.slug}
                onClick={() => onFilterToggle('category', cat.slug)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sort */}
      <div>
        <h4 className="font-sm text-medium_gray mb-2">Sort by</h4>
        <select className="w-full px-3 py-2 rounded-border border-border text-sm focus:outline-none focus:ring-2 focus:ring-rust transition-colors">
          <option value="featured">Featured first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating_desc">Rating</option>
        </select>
      </div>

      {/* Price slider */}
      <div>
        <h4 className="font-sm text-medium_gray mb-2">Price range</h4>
        <p className="text-xs text-medium_gray">
          <span>₦1,500</span> -
          <span>₦35,000</span>
        </p>
      </div>

      {/* Clear all */}
      <button
        onClick={onClearAll}
        className="w-full py-2 rounded-pill bg-warm_off_white text-dark_gray font-label font-medium hover:bg-gray-100 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default FilterSidebar;
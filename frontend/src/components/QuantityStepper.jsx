import React from 'react';

const QuantityStepper = ({ quantity, onChange, max = 99 }) => (
  <div className="inline-flex items-center border border-border rounded-pill overflow-hidden">
    <button
      onClick={() => onChange(Math.max(1, quantity - 1))}
      className="px-3 py-1.5 text-lg font-medium hover:bg-gray-100"
    >
      -
    </button>
    <span className="px-3 py-1.5 font-label font-semibold min-w-[2rem] text-center">{quantity}</span>
    <button
      onClick={() => onChange(Math.min(max, quantity + 1))}
      className="px-3 py-1.5 text-lg font-medium hover:bg-gray-100"
    >
      +
    </button>
  </div>
);

export default QuantityStepper;
import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, type = 'button', ...props }) => {
  const base = 'inline-flex items-center justify-center font-label font-semibold rounded-pill transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-rust text-white hover:bg-rust/90 shadow-sm',
    secondary: 'bg-warm_off_white text-dark_gray border border-border hover:bg-gray-100',
    outline: 'border-2 border-rust text-rust hover:bg-rust/5',
    ghost: 'text-dark_gray hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    icon: 'p-2',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
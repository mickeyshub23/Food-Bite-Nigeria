import React, { useState, useEffect } from 'react';

const Toast = ({ title, description = '', variant = 'info', autoClose = true, duration = 5000 }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [visible]);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  if (dismissed) return null;

  const configs = {
    success: { bg: 'bg-green-100 text-green-700 border-l-4 border-green-400' },
    info: { bg: 'bg-blue-100 text-blue-700 border-l-4 border-blue-400' },
    warning: { bg: 'bg-amber-100 text-amber-700 border-l-4 border-amber-400' },
    error: { bg: 'bg-red-100 text-red-700 border-l-4 border-red-400' },
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${configs[variant]} border rounded-md px-6 py-3 shadow-xl text-xs font-medium z-50 ${visible ? '' : 'opacity-0 -translate-y-2 transition-all duration-300'}`}
    >
      <div className="flex items-center gap-3">
        {variant === 'success' && (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        <span className="font-label">{title}</span>
        {description && <span>{description}</span>}
        <button
          onClick={dismiss}
          className="ml-auto text-[0.75rem] opacity-90 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1={18} y1={6} x2={6} y2={18} />
            <line x1={6} y1={6} x2={18} y2={18} />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
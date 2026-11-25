const StatusBadge = ({ status, className = '' }) => {
  const configs = {
    in_stock: { label: 'In stock', color: 'bg-green-100 text-green-700' },
    low_stock: { label: 'Low stock', color: 'bg-amber-100 text-amber-700' },
    sold_out: { label: 'Sold out', color: 'bg-gray-200 text-gray-600' },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
    preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700' },
    on_the_way: { label: 'On the way', color: 'bg-indigo-100 text-indigo-700' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-pill text-xs font-label font-semibold ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Calendar } from 'lucide-react';

const OrderCard = ({ order }) => {
  const formatNaira = (kobo) => '₦' + Math.round(kobo / 100).toLocaleString();
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white rounded-card border border-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-headline font-semibold text-base text-dark_gray">Order #{order.order_number}</h3>
          <p className="text-xs text-medium_gray flex items-center gap-1 mt-1">
            <Calendar size={12} />
            {formatDate(order.created_at)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-medium_gray">{order.order_items?.length || 0} items</span>
        <span className="font-headline font-bold text-rust">{formatNaira(order.total_kobo)}</span>
      </div>
      <Link to={`/account/orders/${order.id}`} className="mt-3 block text-center py-2 rounded-pill bg-warm_off_white text-dark_gray text-sm font-label hover:bg-gray-100 transition-colors">
        View order
      </Link>
    </div>
  );
};

export default OrderCard;
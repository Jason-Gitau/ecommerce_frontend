// src/pages/OrderDetailsPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../api/orderApi';
import { ArrowLeft, Package } from 'lucide-react';

// Re-declare or import the status colors map
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  REFUNDED: 'bg-orange-100 text-orange-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading order details...</div>;

  if (isError || !order) {
    // API returns 404 if order doesn't exist or belongs to another user
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          This order may not exist, or you do not have permission to view it.
        </p>
        <button 
          onClick={() => navigate('/orders')} 
          className="flex items-center text-blue-600 hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate('/orders')} 
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to My Orders
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Order Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${STATUS_COLORS[order.status]}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
          <ul className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">${Number(item.priceAtTime).toFixed(2)} each</p>
                  <p className="text-base font-semibold text-gray-900">
                    ${Number(item.priceAtTime * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Total Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
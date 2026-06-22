// src/pages/CartPage.tsx
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function CartPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCartStore();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <h2 className="font-display text-display text-on-surface mb-4">Your cart is empty</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">Looks like you haven't added any products yet.</p>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-4 rounded-full bg-primary-container text-on-primary-container font-medium shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px transition-all duration-300"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-hister text-hister text-on-surface mb-8">Shopping Cart ({totalItems} items)</h1>

        <div className="bg-background rounded-[2.5rem] shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] p-8 overflow-hidden">
          {/* Cart Items List */}
          <ul className="divide-y divide-outline-variant/20">
            {items.map((item) => (
              <li key={item.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0">
                <div className="flex-1">
                  <h3 className="font-medium text-body-lg text-on-surface">{item.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">${Number(item.price).toFixed(2)} each</p>
                  <p className={`text-sm mt-1 font-medium ${item.stock > 0 ? 'text-success' : 'text-error'}`}>
                    {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center rounded-full bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:text-primary text-on-surface-variant transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-on-surface">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:text-primary text-on-surface-variant transition-colors disabled:opacity-50"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[100px]">
                    <p className="font-pastin text-pastin text-on-surface">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Cart Summary Footer */}
          <div className="border-t border-outline-variant/20 mt-8 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <p className="font-body-md text-body-md text-on-surface-variant">Subtotal</p>
                <p className="font-pastin text-pastin text-on-surface mt-2">${Number(totalPrice).toFixed(2)}</p>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-primary-container text-on-primary-container rounded-full shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px font-medium transition-all duration-300 w-full sm:w-auto"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
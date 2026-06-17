// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { useState } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = useCartStore((state) => state.totalItems);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const dropdownRef = useClickOutside(() => setShowAdminMenu(false));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <Link to="/products" className="text-xl font-bold text-primary font-hister">
            PremiumStore
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-on-surface hover:text-primary font-medium transition-colors">
              Shop
            </Link>
            
            {/* Orders Link */}
            <Link to="/orders" className="text-on-surface hover:text-primary font-medium transition-colors">
              My Orders
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-on-surface hover:text-primary transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-error text-on-error text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin Panel Dropdown (Only for Admins) */}
            {user?.role === 'ADMIN' && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-container text-on-primary-container rounded-lg hover:bg-primary-fixed transition-colors font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>

                {/* Dropdown Menu */}
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-lg shadow-neu-flat border border-outline-variant py-2 z-50">
                    <div className="px-4 py-2 border-b border-outline-variant">
                      <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-high transition-colors"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-high transition-colors"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Users
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-high transition-colors"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Orders
                    </Link>
                    <Link
                      to="/admin/products/create"
                      className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-high transition-colors"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <span className="w-4 h-4 flex items-center justify-center">+</span>
                      Add Product
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3 border-l pl-6 border-outline-variant">
              <button 
                onClick={handleLogout}
                className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
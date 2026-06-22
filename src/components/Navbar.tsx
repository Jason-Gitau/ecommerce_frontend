import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Bell, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useState } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const totalItems = useCartStore((state) => state.totalItems);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const dropdownRef = useClickOutside(() => setShowAdminMenu(false));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center h-20 px-4 md:px-20 w-full sticky top-0 z-50 bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] transition-all duration-300">
      {/* Brand - Left Side */}
      <div className="flex items-center gap-4 flex-1">
        <Link to="/" className="font-pastin text-pastin text-primary tracking-tight hover:opacity-80 transition-opacity">
          SoftMart
        </Link>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6">
        {/* Bell Icon - Navigate to Products */}
        <button
          onClick={() => navigate('/products')}
          className="relative p-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px text-on-surface-variant hover:text-primary transition-all duration-300"
          title="Browse Products"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
        </button>

        {/* Shopping Cart Icon - Navigate to Cart & Show Count */}
        <Link
          to="/cart"
          className="relative p-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px text-on-surface-variant hover:text-primary transition-all duration-300"
          title="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-on-error text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Admin Menu - Only Show if Admin */}
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
              </div>
            )}
          </div>
        )}

        {/* User Menu - Show based on Authentication */}
        {isAuthenticated && user ? (
          <button
            onClick={handleLogout}
            className="p-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px text-on-surface-variant hover:text-error transition-all duration-300"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] text-on-surface font-medium transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-medium shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
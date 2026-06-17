// src/components/AdminLayout.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, Users, ShoppingBag, LogOut, Store, Package } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive
        ? 'bg-surface-container-high text-primary shadow-neu-inset'
        : 'text-on-surface-variant hover:bg-surface-bright hover:shadow-neu-flat'
    }`;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant shadow-sidebar z-40">
        <div className="flex flex-col py-8 gap-y-4 h-full">
          {/* Header */}
          <div className="px-6 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden neu-inset bg-primary-container">
              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
            <div>
              <h2 className="font-pastin text-pastin tracking-tight text-primary leading-tight">Management</h2>
              <p className="font-caption text-caption text-on-surface-variant">Premium Store</p>
            </div>
          </div>

          {/* View Store Link */}
          <div className="px-6 mb-4">
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-success text-on-primary-container font-medium py-3 rounded-xl neu-flat neu-hover neu-active transition-all flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" />
              View Store
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-2 px-4">
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </NavLink>
            
            <NavLink to="/admin/users" className={linkClass}>
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </NavLink>
            
            <NavLink to="/admin/orders" className={linkClass}>
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Orders</span>
            </NavLink>
            
            <NavLink to="/admin/products/create" className={linkClass}>
              <Package className="w-5 h-5" />
              <span className="font-medium">Add Product</span>
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="px-6 mt-auto pb-4">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-margin-desktop overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
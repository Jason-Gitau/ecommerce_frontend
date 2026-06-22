// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import CreateProductPage from './pages/admin/CreateProductPage';
import EditProductPage from './pages/admin/EditProductPage';

// components
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import AdminLayout from './components/AdminLayout';


function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet /> {/* This renders the child routes (Products, Cart, etc.) */}
    </div>
  );
}

function AdminRoute() {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || user.role !== 'ADMIN') {
    // If not admin, kick them back to the products page
    return <Navigate to="/products" replace />;
  }
  return <AdminLayout />;
}

// This layout is for pages anyone can see (Storefront, Cart)
function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet /> {/* This renders the child routes like ProductsPage */}
    </div>
  );
}


function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Check auth status on initial app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Initializing App...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/products" replace /> : <LandingPage />} />
      {/* Public Auth Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/products" replace /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* PUBLIC CUSTOMER ROUTES (No login required) */}
      <Route element={<PublicLayout />}>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
       <Route path="/cart" element={<CartPage />} />
      </Route>
      

      {/* Protected Routes (With Navbar) */}
      <Route element={<ProtectedLayout />}>
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/checkout" element={<div className="p-8">Checkout Page (Coming Next!)</div>} />
      </Route>

       {/* Protected Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminOverviewPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} /> 
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/products/create" element={<CreateProductPage />} />
        <Route path="/admin/products/:id/edit" element={<EditProductPage />} />
      </Route>
    </Routes>
  );
}

export default App;

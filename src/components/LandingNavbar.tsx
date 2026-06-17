// src/components/LandingNavbar.tsx
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-gutter h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-neu-flat group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <span className="font-hister text-2xl text-primary tracking-tight">PremiumStore</span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-6 py-2.5 rounded-xl font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium shadow-neu-flat neu-hover transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
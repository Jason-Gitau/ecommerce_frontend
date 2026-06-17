// src/pages/LandingPage.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Bell, 
  ArrowRight, 
  Monitor, 
  Check, 
  Armchair, 
  Heart, 
  Plus,
  Mail
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const categories = [
    {
      icon: Monitor,
      title: "Electronics",
      description: "Smart devices and high-fidelity audio.",
      link: "/products?search=electronics"
    },
    {
      icon: Check,
      title: "Apparel",
      description: "Premium soft textiles and modern fits.",
      link: "/products?search=apparel"
    },
    {
      icon: Armchair,
      title: "Home Essentials",
      description: "Minimalist decor for tactile living spaces.",
      link: "/products?search=home"
    }
  ];

  const featuredProducts = [
    {
      id: "1",
      name: "Aura Studio Pro",
      price: 299,
      category: "Audio",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      liked: false
    },
    {
      id: "2",
      name: "Chrono Sync",
      price: 149,
      category: "Wearables",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
      liked: true
    },
    {
      id: "3",
      name: "Premium Soft Tee",
      price: 45,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
      liked: false
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center h-20 px-4 md:px-20 w-full sticky top-0 z-50 bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] transition-all duration-300">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-pastin text-pastin text-primary tracking-tight hover:opacity-80 transition-opacity">
            SoftMart
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative flex items-center w-full h-12 rounded-full bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] overflow-hidden">
            <Search className="absolute left-4 w-5 h-5 text-outline z-10" />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full h-full bg-transparent border-none pl-12 pr-4 text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none rounded-full transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px text-on-surface-variant hover:text-primary transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
          </button>

          {/* Cart */}
          <Link to="/cart" className="p-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] hover:-translate-y-0.5 active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px text-on-surface-variant hover:text-primary transition-all duration-300">
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {/* User Avatar or Auth Buttons */}
          {isAuthenticated && user ? (
            <Link to="/products" className="w-12 h-12 rounded-full p-1 bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] transition-all duration-300 overflow-hidden">
              <div className="w-full h-full rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-6 py-2.5 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] text-on-surface font-medium transition-all duration-300">
                Sign In
              </Link>
              <Link to="/register" className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-medium shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] transition-all duration-300">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto pb-24">
        
        {/* Hero Section */}
        <section className="mt-16 px-4 md:px-20 w-full">
          <div className="bg-background rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] border border-white/40">
            <div className="flex-1 flex flex-col gap-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] w-max">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="font-label text-label text-primary uppercase tracking-wider">New Arrival</span>
              </div>
              
              <h1 className="font-display text-display text-on-surface leading-tight">
                Experience the Future of <span className="text-primary">Tactile Shopping.</span>
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Discover premium products curated for a seamless, sensory-rich digital lifestyle. Soft lines, deep shadows, and intuitive interactions await.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <Link 
                  to="/products"
                  className="px-8 py-4 rounded-full bg-primary-container text-on-primary-container font-medium text-medium shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px transition-all duration-300"
                >
                  Shop Now
                </Link>
                <button 
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-full bg-surface-container-lowest text-on-surface font-medium text-medium shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px border border-border-gold transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="flex-1 w-full aspect-square md:aspect-auto md:h-[500px] rounded-[2rem] bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] p-8 flex items-center justify-center relative overflow-hidden">
              {/* Ambient light effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/20 to-transparent pointer-events-none mix-blend-multiply"></div>
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" 
                alt="Premium headphones showcase"
                className="w-full h-full object-contain filter drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section id="categories" className="mt-32 px-4 md:px-20 w-full">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-hister text-hister text-on-surface">Explore Collections</h2>
              <p className="font-body-md text-body-md text-outline mt-2">Soft-molded interfaces for your everyday needs.</p>
            </div>
            <button className="p-4 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] text-primary transition-all duration-300">
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories.map((category) => (
              <Link 
                key={category.title}
                to={category.link}
                className="group block rounded-[2.5rem] bg-background p-8 shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] transition-all duration-400"
              >
                <div className="w-20 h-20 rounded-2xl bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center mb-8 text-primary group-hover:text-focus-glow transition-colors">
                  <category.icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-medium text-on-surface mb-2">{category.title}</h3>
                <p className="font-caption text-caption text-outline">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mt-32 px-4 md:px-20 w-full">
          <h2 className="font-hister text-hister text-on-surface mb-12">Trending Now</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="rounded-3xl bg-background p-6 shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] flex flex-col gap-6 relative group"
              >
                <div className="absolute top-8 right-8 z-20">
                  <button className="w-10 h-10 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] flex items-center justify-center text-outline hover:text-error transition-colors active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF]">
                    <Heart className={`w-5 h-5 ${product.liked ? 'fill-error text-error' : ''}`} />
                  </button>
                </div>

                <div className="w-full aspect-square rounded-2xl bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] p-6 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div>
                  <div className="font-label text-label text-primary mb-1 uppercase">{product.category}</div>
                  <h3 className="font-medium text-body-lg text-on-surface leading-tight mb-2">{product.name}</h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-pastin text-pastin text-on-surface">${product.price}</span>
                    <button className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center transition-all">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest flex flex-col items-center justify-center py-12 px-4 md:px-20 w-full mt-24 border-t border-outline-variant/30 relative z-10">
        {/* Newsletter Signup */}
        <div className="w-full max-w-2xl mx-auto mb-16 text-center">
          <h3 className="font-medium text-medium text-on-surface mb-4">Join the SoftMart Experience</h3>
          <p className="font-body-md text-outline mb-8">Subscribe for exclusive releases and sensory-driven product updates.</p>
          
          <form className="flex items-center max-w-md mx-auto relative h-16 rounded-full bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] overflow-hidden">
            <Mail className="absolute left-6 w-5 h-5 text-outline z-10" />
            <input 
              type="email" 
              placeholder="Enter your email"
              required
              className="w-full h-full bg-transparent border-none pl-16 pr-32 text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none rounded-full transition-all duration-200"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-primary-container text-on-primary-container font-label uppercase tracking-wide shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] hover:brightness-105 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1440px] gap-6">
          <div className="font-medium text-medium text-on-surface">
            SoftMart
          </div>
          
          <nav className="flex flex-wrap justify-center gap-8">
            <a href="#" className="font-label text-label text-outline hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus-glow rounded-md px-2 py-1">
              Privacy Policy
            </a>
            <a href="#" className="font-label text-label text-outline hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus-glow rounded-md px-2 py-1">
              Terms of Service
            </a>
            <a href="#" className="font-label text-label text-outline hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus-glow rounded-md px-2 py-1">
              Shipping Info
            </a>
            <a href="#" className="font-label text-label text-outline hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-focus-glow rounded-md px-2 py-1">
              Contact Us
            </a>
          </nav>
        </div>

        <div className="mt-8 font-caption text-caption text-outline w-full max-w-[1440px] text-left">
          © 2026 SoftMart Neumorphic UI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
// src/pages/ProductsPage.tsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/productApi';
import Pagination from '../components/Pagination';
import type { Product } from '../types/api';
import { ShoppingCart, Edit } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function ProductsPage() {
  // 1. Sync state with URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);

  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';

  // 2. Fetch data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', currentPage, searchQuery, inStockOnly],
    queryFn: () => getProducts({
      page: currentPage,
      search: searchQuery || undefined,
      inStock: inStockOnly || undefined,
    }),
  });

  // 3. Handle filter changes (updates URL, which triggers React Query to refetch)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ page: '1', search: searchQuery, inStock: String(inStockOnly) });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', String(newPage));
      return prev;
    });
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Render Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading products...</div>
      </div>
    );
  }

  // 5. Render Error State
  if (isError) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-red-600">
          Error loading products: {(error as Error).message}
        </div>
      </div>
    );
  }

  const products = data?.data || [];
  const pagination = data?.meta?.pagination;

  return (
    <div className="min-h-screen bg-background">
      {/* Header & Filters */}
      <div className="max-w-7xl mx-auto px-4 md:px-20 py-12">
        <h1 className="font-hister text-hister text-on-surface mb-8">Our Products</h1>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex items-center flex-1 h-12 rounded-full bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchParams(prev => {
                prev.set('search', e.target.value);
                prev.set('page', '1');
                return prev;
              })}
              className="w-full h-full bg-transparent border-none px-4 text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:outline-none"
            />
          </div>

          <label className="flex items-center space-x-2 px-4 py-3 rounded-full bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] cursor-pointer transition-all duration-300">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setSearchParams(prev => {
                prev.set('inStock', String(e.target.checked));
                prev.set('page', '1');
                return prev;
              })}
              className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded"
            />
            <span className="text-sm font-medium text-on-surface">In Stock Only</span>
          </label>

          <button
            type="submit"
            className="px-6 py-3 bg-primary-container text-on-primary-container rounded-full font-medium shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] active:translate-y-px transition-all duration-300"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-20 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body-lg text-body-lg text-on-surface-variant">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <div
                key={product.id}
                className="rounded-[2rem] bg-background p-6 shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] transition-all duration-300 flex flex-col gap-4"
              >
                {/* Product Image */}
                <div className="w-full aspect-square rounded-xl bg-background shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center">
                  <div className="text-on-surface-variant font-medium">[Product Image]</div>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <h3 className="font-medium text-body-lg text-on-surface truncate">{product.name}</h3>

                  <div className="flex items-center justify-between">
                    <span className="font-pastin text-pastin text-on-surface">${Number(product.price).toFixed(2)}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-primary-container text-on-primary-container rounded-full font-medium shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#D1D9E6,inset_-4px_-4px_8px_#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>

                    {/* Admin-only Edit Button */}
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        className="p-3 bg-background shadow-[6px_6px_12px_#D1D9E6,-6px_-6px_12px_#FFFFFF] hover:shadow-[10px_10px_20px_#D1D9E6,-10px_-10px_20px_#FFFFFF] rounded-full text-on-surface-variant hover:text-primary transition-all duration-300"
                        title="Edit Product"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="mt-12">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
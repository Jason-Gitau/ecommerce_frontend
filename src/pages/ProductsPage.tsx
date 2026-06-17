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
    <div className="min-h-screen bg-gray-50">
      {/* Header & Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchParams(prev => { 
                prev.set('search', e.target.value); 
                prev.set('page', '1'); // Reset to page 1 on new search
                return prev; 
              })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            
            <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setSearchParams(prev => {
                  prev.set('inStock', String(e.target.checked));
                  prev.set('page', '1');
                  return prev;
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>

            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Apply Filters
            </button>
          </form>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Placeholder for Product Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  [Product Image]
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button 
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    {/* Admin-only Edit Button */}
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 transition-colors"
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
          <Pagination 
            currentPage={pagination.page} 
            totalPages={pagination.totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    </div>
  );
}
// src/pages/ProductDetailsPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../api/productApi';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading product...</div>;
  
  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">This product may have been removed or the link is invalid.</p>
        <button onClick={() => navigate('/products')} className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Image Placeholder */}
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-gray-400">
            [Product Image]
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <button onClick={() => navigate('/products')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 w-fit">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600 mt-4">${Number(product.price).toFixed(2)}</p>
            
            <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm w-fit ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
                  addedFeedback 
                    ? 'bg-green-600 text-white' 
                    : product.stock > 0 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {addedFeedback ? (
                  <><CheckCircle className="w-5 h-5" /><span>Added to Cart!</span></>
                ) : (
                  <><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
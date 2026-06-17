// src/pages/admin/EditProductPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById, updateProduct, deleteProduct } from '../../api/productApi';
import type { AxiosError } from 'axios';
import { ArrowLeft, Package, Loader2, CheckCircle, Trash2 } from 'lucide-react';

// Zod schema matching backend class-validator rules
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  stock: z.number().int().min(0, 'Stock must be a whole number 0 or greater').optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Fetch existing product data
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  // 2. Setup Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Pre-fill form when product data loads
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        stock: product.stock,
      });
    }
  }, [product, reset]);

  // 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => updateProduct(id!, data),
    onSuccess: (data) => {
      setSuccessMessage(`Successfully updated "${data.name}"!`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['adminOverview'] });
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      alert(error.response?.data?.message || 'Failed to update product. Please try again.');
    }
  });

  // 4. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminOverview'] });
      navigate('/products', { replace: true });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      alert(error.response?.data?.message || 'Failed to delete product.');
    }
  });

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <div className="p-8 text-gray-500 animate-pulse">Loading product details...</div>;
  if (isError || !product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline">Back to Products</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate('/products')} 
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <p className="text-sm text-gray-500">Update inventory details.</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  {...register('price')}
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                {...register('stock')}
                type="number"
                step="1"
                min="0"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.stock ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
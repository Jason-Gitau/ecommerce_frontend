// src/pages/admin/AdminOrdersPage.tsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getAdminOrders, updateOrderStatus } from '../../api/adminApi';
import type { OrderStatus } from '../../api/adminApi';
import type { ExportOrdersParams } from '../../api/adminApi';
import Pagination from '../../components/Pagination';
import { Download, Loader2 } from 'lucide-react';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  REFUNDED: 'bg-orange-100 text-orange-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = Number(searchParams.get('page')) || 1;
  
  // CSV Export State
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportStatus, setExportStatus] = useState<OrderStatus | ''>('');
  const [isExporting, setIsExporting] = useState(false);

  // 1. Fetch Orders
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminOrders', currentPage],
    queryFn: () => getAdminOrders({ page: currentPage, limit: 15 }),
  });

  // 2. Mutation for Status Update
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => 
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    }
  });

  // 3. Handle CSV Export
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const params: ExportOrdersParams = {
        startDate: exportStartDate || undefined,
        endDate: exportEndDate || undefined,
        status: exportStatus || undefined,
      };

      // Must use raw axios here — the api wrapper strips the Axios response
      // object down to just response.data, losing the headers and blob.
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/admin/orders/export/csv`,
        {
          params,
          responseType: 'blob',
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${(await import('../../store/authStore')).useAuthStore.getState().accessToken}`,
          },
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from Content-Disposition header if available
      const disposition = response.headers['content-disposition'] as string | undefined;
      const filename = disposition
        ? disposition.split('filename=')[1]?.replace(/"/g, '').trim()
        : 'orders-export.csv';
      link.setAttribute('download', filename ?? 'orders-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV Export failed:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const orders = data?.data || [];
  const pagination = data?.meta?.pagination;

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading orders...</div>;
  if (isError) return <div className="text-red-600">Failed to load orders.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
      </div>

      {/* CSV Export Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export Orders to CSV
        </h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
            <input 
              type="date" 
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-500 mb-1">End Date</label>
            <input 
              type="date" 
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-500 mb-1">Status (Optional)</label>
            <select 
              value={exportStatus}
              onChange={(e) => setExportStatus(e.target.value as OrderStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Statuses</option>
              {Object.keys(STATUS_COLORS).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full md:w-auto px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium flex items-center justify-center disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download CSV
          </button>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{order.user?.email || order.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[order.status as OrderStatus] ?? 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={order.status}
                      onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                      disabled={statusMutation.isPending}
                      className="text-xs border border-gray-300 rounded-md py-1 px-2 bg-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    >
                      {Object.keys(STATUS_COLORS).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination 
          currentPage={pagination.page} 
          totalPages={pagination.totalPages} 
          onPageChange={(newPage) => setSearchParams(prev => { prev.set('page', String(newPage)); return prev; })} 
        />
      )}
    </div>
  );
}
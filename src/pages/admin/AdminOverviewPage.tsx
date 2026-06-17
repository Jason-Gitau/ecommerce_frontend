// src/pages/admin/AdminOverviewPage.tsx
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAdminOverview } from '../../api/adminApi';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Plus } from 'lucide-react';

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: getAdminOverview,
  });

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading dashboard metrics...</div>;
  if (isError) return <div className="text-red-600">Failed to load analytics.</div>;

  const stats = [
    { label: 'Total Revenue', value: `$${Number(data?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders', value: data?.totalOrders || 0, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Users', value: data?.totalUsers || 0, icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Low Stock Alerts', value: data?.lowStockAlerts || 0, icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
       <button 
          onClick={() => navigate('/admin/products/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for future charts */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <p className="text-gray-500 text-sm">[Chart component will go here in Phase 3]</p>
      </div>
    </div>
  );
}
// src/pages/admin/AdminUsersPage.tsx
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, updateAdminUser } from '../../api/adminApi';
import Pagination from '../../components/Pagination';
import { Shield, ShieldOff, Search } from 'lucide-react';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 1. Read filters from URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const roleFilter = searchParams.get('role') as 'USER' | 'ADMIN' | null;
  const statusFilter = searchParams.get('status') as 'active' | 'banned' | null;

  // 2. Fetch users based on URL params
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminUsers', currentPage, searchQuery, roleFilter, statusFilter],
    queryFn: () => getAdminUsers({
      page: currentPage,
      search: searchQuery || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    }),
  });

  // 3. Mutation for Banning/Unbanning
  const banMutation = useMutation({
    mutationFn: ({ id, isBanned }: { id: string, isBanned: boolean }) => 
      updateAdminUser(id, { isBanned }),
    onSuccess: () => {
      // Refresh the user list immediately after a successful ban/unban
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  // 4. Handlers for updating URL params
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      prev.set('page', String(newPage));
      return prev;
    });
  };

  const updateFilter = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set('page', '1'); // Always reset to page 1 when filters change
      return prev;
    });
  };

  const users = data?.data || [];
  const pagination = data?.meta?.pagination;

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading users...</div>;
  if (isError) return <div className="text-red-600">Failed to load users.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchParams(prev => { 
                prev.set('search', e.target.value); 
                prev.set('page', '1'); 
                return prev; 
              })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Role Filter */}
          <select 
            value={roleFilter || ''} 
            onChange={(e) => updateFilter('role', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter || ''} 
            onChange={(e) => updateFilter('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => banMutation.mutate({ id: user.id, isBanned: !user.isBanned })}
                      disabled={banMutation.isPending}
                      className={`inline-flex items-center px-3 py-1.5 border rounded-md font-medium transition-colors disabled:opacity-50 ${
                        user.isBanned
                          ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                          : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      {user.isBanned ? <Shield className="w-4 h-4 mr-1" /> : <ShieldOff className="w-4 h-4 mr-1" />}
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </button>
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
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  );
}
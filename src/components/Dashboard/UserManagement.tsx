import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Globe } from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Table } from '../UI/Table';
import { Modal } from '../UI/Modal';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../utils/api';
import { User } from '../../types';
import { UserForm } from './UserForm';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const itemsPerPage = 10;

  const { data: users, loading, error } = useApi<User[]>(() => api.getUsers());
  const { addNotification } = useNotification();

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return [];

    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, sortBy, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(id);
        addNotification({
          type: 'success',
          message: 'User deleted successfully',
        });
        // In a real app, you would refetch the data or update the local state
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to delete user',
        });
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUserSaved = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    // In a real app, you would refetch the data
    addNotification({
      type: 'success',
      message: editingUser ? 'User updated successfully' : 'User created successfully',
    });
  };

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-xs">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{user.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{user.phone}</span>
        </div>
      ),
    },
    {
      key: 'company',
      title: 'Company',
      render: (user: User) => user.company.name,
    },
    {
      key: 'website',
      title: 'Website',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <a
            href={`http://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            {user.website}
          </a>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(user)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(user.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-2">Manage your platform users</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {filteredAndSortedUsers.length} users found
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <Table
            data={paginatedUsers}
            columns={columns}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-500 text-center sm:text-left">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} results
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="lg"
      >
        <UserForm
          user={editingUser}
          onSave={handleUserSaved}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
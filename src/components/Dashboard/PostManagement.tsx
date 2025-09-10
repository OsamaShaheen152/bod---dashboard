import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Table } from '../UI/Table';
import { Modal } from '../UI/Modal';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../utils/api';
import { Post, User as UserType } from '../../types';
import { PostForm } from './PostForm';

export const PostManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const itemsPerPage = 10;

  const { data: posts, loading: loadingPosts } = useApi<Post[]>(() => api.getPosts());
  const { data: users, loading: loadingUsers } = useApi<UserType[]>(() => api.getUsers());
  const { addNotification } = useNotification();

  const postsWithUsers = useMemo(() => {
    if (!posts || !users) return [];
    
    return posts.map(post => ({
      ...post,
      user: users.find(user => user.id === post.userId),
    }));
  }, [posts, users]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = postsWithUsers.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'user') {
        aValue = a.user?.name || '';
        bValue = b.user?.name || '';
      } else {
        aValue = (a as any)[sortBy];
        bValue = (b as any)[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [postsWithUsers, searchTerm, sortBy, sortOrder]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.deletePost(id);
        addNotification({
          type: 'success',
          message: 'Post deleted successfully',
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to delete post',
        });
      }
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handlePostSaved = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    addNotification({
      type: 'success',
      message: editingPost ? 'Post updated successfully' : 'Post created successfully',
    });
  };

  const columns = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (post: Post) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{post.title}</div>
          <div className="text-sm text-gray-500 line-clamp-2 mt-1">{post.body}</div>
        </div>
      ),
    },
    {
      key: 'user',
      title: 'Author',
      sortable: true,
      render: (post: Post) => (
        <div className="flex items-center space-x-3">
          {post.user ? (
            <>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-xs">
                  {post.user.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">{post.user.name}</div>
                <div className="text-sm text-gray-500">{post.user.email}</div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-gray-500">
              <User className="w-4 h-4" />
              <span>Unknown User</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'userId',
      title: 'User ID',
      render: (post: Post) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {post.userId}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (post: Post) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(post)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(post.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const loading = loadingPosts || loadingUsers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Post Management</h2>
          <p className="text-gray-600 mt-2">Manage platform posts and content</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {filteredAndSortedPosts.length} posts found
          </div>
        </div>
      </Card>

      {/* Posts Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <Table
            data={paginatedPosts}
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedPosts.length)} of {filteredAndSortedPosts.length} results
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
        title={editingPost ? 'Edit Post' : 'Add New Post'}
        size="lg"
      >
        <PostForm
          post={editingPost}
          users={users || []}
          onSave={handlePostSaved}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
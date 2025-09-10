import React, { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../utils/api';
import { Post, User } from '../../types';

interface PostFormProps {
  post: Post | null;
  users: User[];
  onSave: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  body: string;
  userId: number;
}

interface FormErrors {
  title?: string;
  body?: string;
  userId?: string;
}

export const PostForm: React.FC<PostFormProps> = ({ post, users, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    body: '',
    userId: users[0]?.id || 1,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        body: post.body,
        userId: post.userId,
      });
    }
  }, [post]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body is required';
    } else if (formData.body.length < 10) {
      newErrors.body = 'Body must be at least 10 characters';
    }

    if (!formData.userId) {
      newErrors.userId = 'User is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        body: formData.body,
        userId: formData.userId,
      };

      if (post) {
        await api.updatePost(post.id, postData);
      } else {
        await api.createPost(postData);
      }

      onSave();
    } catch (error) {
      addNotification({
        type: 'error',
        message: `Failed to ${post ? 'update' : 'create'} post`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = field === 'userId' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          placeholder="Enter post title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <select
            value={formData.userId}
            onChange={handleInputChange('userId')}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.userId ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={formData.body}
            onChange={handleInputChange('body')}
            rows={6}
            placeholder="Enter post content"
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical ${
              errors.body ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};
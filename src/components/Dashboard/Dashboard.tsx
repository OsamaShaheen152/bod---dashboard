import React from 'react';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';
import { Card } from '../UI/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { User, Post } from '../../types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
  <Card className="relative overflow-hidden">
    <div className="flex items-center">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className="text-sm text-green-600 mt-1 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { data: users, loading: loadingUsers } = useApi<User[]>(() => api.getUsers());
  const { data: posts, loading: loadingPosts } = useApi<Post[]>(() => api.getPosts());

  const stats = [
    {
      title: 'Total Users',
      value: loadingUsers ? '...' : users?.length || 0,
      icon: Users,
      color: 'bg-blue-600',
      trend: '+12% from last month',
    },
    {
      title: 'Total Posts',
      value: loadingPosts ? '...' : posts?.length || 0,
      icon: FileText,
      color: 'bg-green-600',
      trend: '+18% from last month',
    },
    {
      title: 'Active Users',
      value: loadingUsers ? '...' : Math.floor((users?.length || 0) * 0.75),
      icon: Activity,
      color: 'bg-purple-600',
      trend: '+8% from last month',
    },
    {
      title: 'Growth Rate',
      value: '23.5%',
      icon: TrendingUp,
      color: 'bg-orange-600',
      trend: '+5% from last month',
    },
  ];

  const recentPosts = posts?.slice(0, 5) || [];
  const recentUsers = users?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Posts */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
          {loadingPosts ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {post.body}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">User ID: {post.userId}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Users */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          {loadingUsers ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
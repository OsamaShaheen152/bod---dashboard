import React from 'react';
import { TrendingUp, Users, FileText, Activity, Calendar, Target } from 'lucide-react';
import { Card } from '../UI/Card';
import { useApi } from '../../hooks/useApi';
import { api } from '../../utils/api';
import { User, Post } from '../../types';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon: Icon }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className={`flex items-center mt-2 text-sm ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`w-4 h-4 mr-1 ${changeType === 'negative' ? 'rotate-180' : ''}`} />
          {change}
        </div>
      </div>
      <div className="p-3 bg-blue-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </Card>
);

export const Analytics: React.FC = () => {
  const { data: users, loading: loadingUsers } = useApi<User[]>(() => api.getUsers());
  const { data: posts, loading: loadingPosts } = useApi<Post[]>(() => api.getPosts());

  const loading = loadingUsers || loadingPosts;

  // Calculate metrics
  const totalUsers = users?.length || 0;
  const totalPosts = posts?.length || 0;
  const avgPostsPerUser = totalUsers > 0 ? (totalPosts / totalUsers).toFixed(1) : '0';
  
  // Mock engagement data
  const engagementRate = '78.5%';
  
  // Mock activity data based on real data patterns
  const activeUsers = Math.floor(totalUsers * 0.65);
  const newUsersThisMonth = Math.floor(totalUsers * 0.15);

  const metrics = [
    {
      title: 'Total Users',
      value: loading ? '...' : totalUsers.toString(),
      change: '+12.5% from last month',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Total Posts',
      value: loading ? '...' : totalPosts.toString(),
      change: '+18.2% from last month',
      changeType: 'positive' as const,
      icon: FileText,
    },
    {
      title: 'Active Users',
      value: loading ? '...' : activeUsers.toString(),
      change: '+8.7% from last month',
      changeType: 'positive' as const,
      icon: Activity,
    },
    {
      title: 'Avg Posts/User',
      value: loading ? '...' : avgPostsPerUser,
      change: '+5.3% from last month',
      changeType: 'positive' as const,
      icon: Target,
    },
    {
      title: 'New Users',
      value: loading ? '...' : newUsersThisMonth.toString(),
      change: '+23.1% from last month',
      changeType: 'positive' as const,
      icon: Calendar,
    },
    {
      title: 'Engagement Rate',
      value: engagementRate,
      change: '-2.1% from last month',
      changeType: 'negative' as const,
      icon: TrendingUp,
    },
  ];

  // Top users by post count
  const topUsers = users && posts ? 
    users.map(user => ({
      ...user,
      postCount: posts.filter(post => post.userId === user.id).length,
    }))
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 5) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-2">Track your platform's performance and user engagement</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Contributors */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
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
              {topUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{user.postCount}</p>
                    <p className="text-sm text-gray-500">posts</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Activity Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">User Registrations</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '...' : newUsersThisMonth}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Posts</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : Math.floor(totalPosts * 0.3)}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Active Sessions</p>
                  <p className="text-sm text-gray-600">Right now</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {loading ? '...' : Math.floor(totalUsers * 0.2)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
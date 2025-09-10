import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  
  const { login, loading } = useAuth();
  const { addNotification } = useNotification();

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        addNotification({
          type: 'success',
          message: 'Successfully logged in!',
        });
      } else {
        addNotification({
          type: 'error',
          message: 'Invalid credentials. Please try again.',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'An error occurred during login.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md mx-4" padding="lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              className="pl-10"
              placeholder="Enter your username"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              className="pl-10"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full text-base"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo Account:</strong><br />
            Use any username and password to login
          </p>
        </div>
      </Card>
    </div>
  );
};
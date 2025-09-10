import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full px-4 sm:px-0">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        return (
          <div
            key={notification.id}
            className={`flex items-start p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${colors[notification.type]}`}
          >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium break-words">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
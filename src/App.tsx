import React from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { NotificationContainer } from './components/UI/Notification';
import { Spinner } from './components/UI/Spinner';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return user ? <Layout /> : <LoginForm />;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
          <NotificationContainer />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
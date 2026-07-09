import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-400"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return role === 'vendor'
      ? <Navigate to="/vendor" replace />
      : <Navigate to="/profile" replace />;
  }

  return children;
};

export default PublicRoute;

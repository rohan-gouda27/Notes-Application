import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  if (location.pathname === '/dashboard' && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    const fallback = userRole === 'instructor' ? '/instructor' : '/student';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}



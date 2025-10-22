import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ allowedRoles }) => {
  const { isAuthenticate, loading } = useSelector((state) => state.user);
  const role = useSelector((state) => state.user?.userDetails?.role);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticate) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
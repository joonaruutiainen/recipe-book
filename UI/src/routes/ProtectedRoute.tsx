import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = false;
  const location = useLocation();
  return !user ? <Navigate to='login' state={{ from: location }} replace /> : <Outlet />;
};

export default ProtectedRoute;

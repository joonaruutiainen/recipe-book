import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

const ProtectedRoute: React.FC<{ adminRequired?: boolean }> = ({ adminRequired = false }) => {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  return !user || (adminRequired && !user.admin) ? (
    <Navigate to='/login' state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;

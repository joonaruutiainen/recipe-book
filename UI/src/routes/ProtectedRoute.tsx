import React from 'react';
import { Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

const ProtectedRoute: React.FC<{ adminRequired?: boolean }> = ({ adminRequired = false }) => {
  const { user } = useAppSelector(state => state.auth);
  const { userId } = useParams();
  const location = useLocation();
  return !user || (adminRequired && !user.admin) || (!user.admin && userId && userId !== user.id) ? (
    <Navigate to='/login' state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;

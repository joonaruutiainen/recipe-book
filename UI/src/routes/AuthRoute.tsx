import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

const AuthRoute = () => {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  return user ? <Navigate to='/' state={{ from: location }} replace /> : <Outlet />;
};

export default AuthRoute;

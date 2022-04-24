import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const AuthRoute = () => {
  const user = true;
  const location = useLocation();
  return user ? <Navigate to='/' state={{ from: location }} replace /> : <Outlet />;
};

export default AuthRoute;

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, NavBar } from './components';
import './App.css';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { authActions } from './redux/slices/authSlice';

const App = () => {
  const initialized = useAppSelector(state => state.auth.initialized);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialized) dispatch(authActions.initSession());
  }, [dispatch, initialized]);

  return (
    <div className='App'>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;

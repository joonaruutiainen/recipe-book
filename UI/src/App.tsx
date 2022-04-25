import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, NavBar } from './components';
import './App.css';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { authActions } from './redux/slices/authSlice';
import { recipeActions } from './redux/slices/recipesSlice';

const App = () => {
  const { initialized, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialized) {
      dispatch(authActions.initSession());
      dispatch(recipeActions.getRecipes());
    }
  }, [dispatch, initialized]);

  useEffect(() => {
    if (user) {
      dispatch(recipeActions.getRecipes());
    }
  }, [dispatch, user]);

  return (
    <div className='App'>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default App;

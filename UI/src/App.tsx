import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Footer, NavBar } from './components';
import './App.css';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { authActions } from './redux/slices/authSlice';
import { recipeActions } from './redux/slices/recipesSlice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#39352C',
    },
    secondary: {
      main: '#554F43',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Segoe UI',
      fontSize: 36,
      color: '#39352C',
    },
    h2: {
      fontFamily: 'Segoe UI',
      fontSize: 32,
      color: '#39352C',
    },
    h3: {
      fontFamily: 'Segoe UI',
      fontSize: 28,
      color: '#39352C',
    },
    h4: {
      fontFamily: 'Segoe UI',
      fontSize: 24,
      color: '#39352C',
    },
    button: {
      fontSize: 20,
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <div className='App'>
        <NavBar />
        <Outlet />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;

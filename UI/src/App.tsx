import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NavBar } from './components';
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
      fontFamily: 'Helvetica',
      fontSize: 36,
      fontWeight: 'bold',
      color: '#39352C',
    },
    h2: {
      fontFamily: 'Helvetica',
      fontSize: 32,
      color: '#39352C',
    },
    h3: {
      fontFamily: 'Helvetica',
      fontSize: 28,
      color: '#39352C',
    },
    h4: {
      fontFamily: 'Helvetica',
      fontSize: 26,
      color: '#39352C',
    },
    h5: {
      fontFamily: 'Helvetica',
      fontSize: 24,
      color: '#39352C',
    },
    h6: {
      fontFamily: 'Helvetica',
      fontSize: 20,
      color: '#39352C',
    },
    button: {
      fontSize: 20,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 900,
      lg: 1300,
      xl: 1700,
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
        <div className='header'>
          <NavBar />
        </div>
        <div className='content'>
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;

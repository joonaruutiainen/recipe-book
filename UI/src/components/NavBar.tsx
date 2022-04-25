import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { authActions } from '../redux/slices/authSlice';

const NavBar = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const login = () =>
    dispatch(
      authActions.loginUser({
        identifier: 'admin',
        password: '12345678',
      })
    );

  const logout = () => dispatch(authActions.logoutUser());

  return (
    <nav
      style={{
        display: 'flex',
        gap: '10px',
        borderBottom: 'solid 1px',
        padding: '1rem 0 1rem 0',
      }}
    >
      {!user && (
        <button type='button' onClick={login}>
          Login
        </button>
      )}
      <Link to='/'>Home</Link>
      <Link to='login'>Login</Link>
      <Link to='register'>Register</Link>
      <Link to='recipes'>Recipes</Link>
      <Link to='recipeEditor'>RecipeEditor</Link>
      {user && (
        <button type='button' onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
};
export default NavBar;

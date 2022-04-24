import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav
    style={{
      display: 'flex',
      gap: '10px',
      borderBottom: 'solid 1px',
      padding: '1rem 0 1rem 0',
    }}
  >
    <Link to='/'>Home</Link>
    <Link to='login'>Login</Link>
    <Link to='register'>Register</Link>
    <Link to='recipes'>Recipes</Link>
    <Link to='recipeEditor'>RecipeEditor</Link>
  </nav>
);

export default NavBar;

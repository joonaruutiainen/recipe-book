import React from 'react';
import { Link } from 'react-router-dom';

const Recipes = () => (
  <div>
    <ul>
      <li>
        <Link to='1'>Recipe 1</Link>
      </li>
      <li>
        <Link to='2'>Recipe 2</Link>
      </li>
      <li>
        <Link to='3'>Recipe 3</Link>
      </li>
    </ul>
  </div>
);

export default Recipes;

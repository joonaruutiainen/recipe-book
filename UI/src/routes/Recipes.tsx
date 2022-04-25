import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';

const Recipes = () => {
  const recipes = useAppSelector(state => state.recipes.public);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div>
      {recipes.length === 0 && (
        <button type='button' onClick={() => dispatch(recipeActions.initRecipes())}>
          Get recipes
        </button>
      )}
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <button
              type='button'
              onClick={() => {
                navigate(recipe.id);
              }}
            >
              {recipe.id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;

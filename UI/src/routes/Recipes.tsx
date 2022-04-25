import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions, SelectionFilter } from '../redux/slices/recipesSlice';

const Recipes = () => {
  const user = useAppSelector(state => state.auth.user);
  const { selection: recipes, selectionFilter } = useAppSelector(state => state.recipes);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <button
          type='button'
          onClick={() => {
            if (!(selectionFilter === SelectionFilter.public))
              dispatch(recipeActions.setSelection(SelectionFilter.public));
          }}
        >
          Public recipes
        </button>
        <button
          type='button'
          onClick={() => {
            if (!user) navigate('/login');
            else dispatch(recipeActions.setSelection(SelectionFilter.myRecipes));
          }}
        >
          My recipes
        </button>
      </div>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <button
              type='button'
              onClick={() => {
                dispatch(recipeActions.selectRecipe(recipe.id));
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

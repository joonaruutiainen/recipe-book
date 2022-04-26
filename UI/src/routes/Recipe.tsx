import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';

const Recipe = () => {
  const { selected: recipe, error } = useAppSelector(state => state.recipes);
  const { recipeId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!recipe && !error && recipeId) dispatch(recipeActions.getRecipe(recipeId));
  }, [dispatch, recipe, error]);

  return (
    <div>
      {error && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <div>{error.message}</div>
          <button
            type='button'
            onClick={() => {
              navigate('/');
              dispatch(recipeActions.clearError());
            }}
          >
            Palaa etusivulle
          </button>
        </div>
      )}
      {recipe && <div>{recipe.title}</div>}
    </div>
  );
};

export default Recipe;

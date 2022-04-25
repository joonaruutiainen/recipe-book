import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';

const Recipe = () => {
  const recipe = useAppSelector(state => state.recipes.selected);
  const dispatch = useAppDispatch();
  const { recipeId } = useParams();

  useEffect(() => {
    if (!recipe && recipeId) dispatch(recipeActions.getRecipe(recipeId));
  }, [recipe, dispatch]);

  return <div>{recipe && <div>{recipe.title}</div>}</div>;
};

export default Recipe;

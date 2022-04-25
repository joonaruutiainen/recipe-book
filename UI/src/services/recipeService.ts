import { APIResponse } from '../types';
import apiService from './apiService';

interface RecipeService {
  getRecipes: () => Promise<APIResponse>;
  getRecipe: (recipeId: string) => Promise<APIResponse>;
}

const getRecipes = () =>
  apiService.makeRequest({
    url: '/recipes',
    method: 'get',
  });

const getRecipe = (recipeId: string) =>
  apiService.makeRequest({
    url: `/recipes/${recipeId}`,
    method: 'get',
  });

const recipeService: RecipeService = {
  getRecipes,
  getRecipe,
};

export default recipeService;

import { APIResponse } from '../types';
import apiService from './apiService';

interface RecipeService {
  getRecipes: () => Promise<APIResponse>;
}

const getRecipes = () =>
  apiService.makeRequest({
    url: '/recipes',
    method: 'get',
  });

const recipeService: RecipeService = {
  getRecipes,
};

export default recipeService;

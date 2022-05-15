import { APIResponse, RecipeEditorData } from '../types';
import apiService from './apiService';

interface RecipeService {
  getRecipes: () => Promise<APIResponse>;
  getRecipe: (recipeId: string) => Promise<APIResponse>;
  deleteRecipe: (recipeId: string) => Promise<APIResponse>;
  addRecipe: (recipeData: RecipeEditorData) => Promise<APIResponse>;
  updateRecipe: (recipeData: RecipeEditorData) => Promise<APIResponse>;
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

const deleteRecipe = (recipeId: string) =>
  apiService.makeRequest({
    url: `/recipes/${recipeId}`,
    method: 'delete',
  });

const addRecipe = (recipeData: RecipeEditorData) =>
  apiService.makeRequest({
    url: '/recipes',
    method: 'post',
    data: recipeData,
  });

const updateRecipe = (recipeData: RecipeEditorData) =>
  apiService.makeRequest({
    url: `/recipes/${recipeData.id}`,
    method: 'put',
    data: recipeData,
  });

const recipeService: RecipeService = {
  getRecipes,
  getRecipe,
  deleteRecipe,
  addRecipe,
  updateRecipe,
};

export default recipeService;

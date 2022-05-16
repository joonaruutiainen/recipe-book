import { APIResponse, RecipeEditorData } from '../types';
import apiService from './apiService';

interface RecipeService {
  getRecipes: () => Promise<APIResponse>;
  getRecipe: (recipeId: string) => Promise<APIResponse>;
  deleteRecipe: (recipeId: string) => Promise<APIResponse>;
  addRecipe: (recipeData: RecipeEditorData) => Promise<APIResponse>;
  updateRecipe: (recipeData: RecipeEditorData) => Promise<APIResponse>;
  uploadImage: (recipeId: string, image: File) => Promise<APIResponse>;
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

const uploadImage = (recipeId: string, image: File) => {
  const data = new FormData();
  data.append('image', image);
  return apiService.makeRequest({
    url: `/recipes/${recipeId}/uploadImage`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  });
};

const recipeService: RecipeService = {
  getRecipes,
  getRecipe,
  deleteRecipe,
  addRecipe,
  updateRecipe,
  uploadImage,
};

export default recipeService;

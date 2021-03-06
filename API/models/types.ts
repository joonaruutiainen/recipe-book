import { Model, ObjectId } from 'mongoose';

export interface APIError {
  message: string;
  code: number;
}
export interface APIValidationError extends APIError {
  details?: Array<string>;
}

export interface APIValidationResult {
  error?: APIValidationError;
  message?: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  admin: boolean;
  favorites: string[];
  verifyPassword: (password: string) => Promise<APIValidationResult>;
}

export interface UserModel extends Model<IUser> {
  validateUserData: (userData: IUser) => Promise<APIValidationResult>;
  validateUserName: (userId: ObjectId, name: string) => Promise<APIValidationResult>;
  validateUserEmail: (userId: ObjectId, email: string) => Promise<APIValidationResult>;
  validateUserPassword: (password: string) => Promise<APIValidationResult>;
}

export interface IRecipeDuration {
  hours: number;
  minutes: number;
}

export interface IRecipeTag {
  name: string;
  color: string;
}

export interface IRecipeSubtitle {
  index: number;
  name: string;
}

export interface IRecipeIngredient {
  quantity?: number;
  unit?: string;
  description: string;
  subtitle?: IRecipeSubtitle;
}

export interface IRecipeStep {
  index: number;
  title: string;
  description: string;
  pageNumber: number;
}

export interface IRecipeUser {
  id: string;
  name: string;
}

export interface IRecipe {
  image?: string;
  title: string;
  description: string;
  duration: IRecipeDuration;
  tags?: Array<IRecipeTag>;
  portionSize: number;
  subtitles?: Array<IRecipeSubtitle>;
  ingredients: Array<IRecipeIngredient>;
  pages: number;
  instructions: Array<IRecipeStep>;
  public: boolean;
  user: IRecipeUser;
}

export interface RecipeModel extends Model<IRecipe> {
  validateRecipeData: (recipeData: IRecipe) => Promise<APIValidationResult>;
}

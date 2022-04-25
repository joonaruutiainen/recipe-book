import ApplicationError from '../utils/ApplicationError';
import { User } from './User';
import { Recipe } from './Recipe';

export interface APIResponse {
  message: string;
  code?: number;
  payload?: User | [User] | Recipe | [Recipe];
  error?: ApplicationError;
}

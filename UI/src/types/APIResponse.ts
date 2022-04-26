import { User } from './User';
import { Recipe } from './Recipe';
import { APIError } from './APIError';

export interface APIResponse {
  message: string;
  code?: number;
  payload?: User | [User] | Recipe | [Recipe];
  error?: APIError;
}

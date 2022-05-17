import { APIError } from './APIError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface APIResponse<T = any> {
  message: string;
  code?: number;
  payload?: T;
  error?: APIError;
}

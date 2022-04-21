import { Response } from 'express';
import APIError from '../models/apiError';
import APIValidationError from '../models/apiValidationError';

const error = (res: Response, err: APIError) =>
  res.status(err.code).json({
    error: {
      message: err.message,
      details: err instanceof APIValidationError && err.details ? err.details : undefined,
    },
  });

// eslint-disable-next-line
const success = (res: Response, code: number, message?: string, payload?: any) =>
  res.status(code).json({
    message,
    payload,
  });

const makeResponse = {
  error,
  success,
};

export default makeResponse;

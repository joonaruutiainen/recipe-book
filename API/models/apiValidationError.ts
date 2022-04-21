import APIError from './apiError';

class APIValidationError extends APIError {
  details?: Array<string>;

  constructor(message: string, code: number, details?: Array<string>) {
    super(message, code);
    this.name = 'APIValidationError';
    this.details = details;
  }
}

export default APIValidationError;

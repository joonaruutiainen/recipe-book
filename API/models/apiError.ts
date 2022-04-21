class APIError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'APIValidationError';
    this.code = code;
  }
}

export default APIError;

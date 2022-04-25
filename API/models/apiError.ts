class APIError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'APIError';
    this.code = code;
  }
}

export default APIError;

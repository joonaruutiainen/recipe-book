class ApplicationError extends Error {
  code: number;

  details?: [string];

  constructor(message: string, code: number, details?: [string]) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.details = details;
  }
}

export default ApplicationError;

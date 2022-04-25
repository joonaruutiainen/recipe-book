class ApplicationError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
  }
}

export default ApplicationError;

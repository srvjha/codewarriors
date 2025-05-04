class ApiError extends Error {
  data: any;
  success: boolean;
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.data = null;
    this.success = false;
    this.name = new.target.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };

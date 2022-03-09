export default class ApplicationError extends Error {
  public message: string = 'ApplicationError';
  public status: string = 'error';
  public statusCode: number = 500;

  constructor(message?: string, status?: string, statusCode?: number) {
    super();
    if (message) {
      this.message = message;
    }

    if (status) {
      this.status = status;
    }

    if (statusCode) {
      this.statusCode = statusCode;
    }
  }
}

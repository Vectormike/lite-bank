import ApplicationError from './application-error';

export default class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Please sign in or create an account') {
    super(message, 'Unauthorized', 401);
  }
}

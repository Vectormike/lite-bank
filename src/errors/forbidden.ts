import ApplicationError from './application-error';

export default class ForbiddenError extends ApplicationError {
  constructor(message: string = 'You do not have permissions to perform this operation') {
    super(message, 'Forbidden', 403);
  }
}

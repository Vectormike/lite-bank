import ApplicationError from './application-error';

export default class BadRequestError extends ApplicationError {
  constructor(message: string = 'Bad request') {
    super(message, 'Bad request', 400);
  }
}

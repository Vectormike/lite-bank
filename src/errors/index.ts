import ApplicationErrorClass from './application-error';
import BadRequestErrorClass from "./bad-request";
import UnauthorizedErrorClass from './unauthorized';
import NotFoundErrorClass from './notfound';
import ForbiddenErrorClass from './forbidden';


export const ApplicationError = ApplicationErrorClass;
export const BadRequestError = BadRequestErrorClass;
export const UnauthorizedError = UnauthorizedErrorClass;
export const NotFoundError = NotFoundErrorClass;
export const ForbiddenError = ForbiddenErrorClass;
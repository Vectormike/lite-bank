import { CurrentUserType } from "./CurrentUser";
import { PaginationType } from "./Pagination";

/**
 * This contains a set of properties for the optional `options` parameter of
 * the public methods in the service class of a component.
 */
export interface ServiceMethodOptions {
  /**
   * A reference to the data of the current user, decoded from the JWT
   */
  currentUser?: CurrentUserType;

  /**
   * Pagination
   */
  pagination?: PaginationType;

  /**
   * The request query object
   */
  query?: any
}

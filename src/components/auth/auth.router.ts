import { Router } from 'express';
import { IAuthController } from './auth.controller';
import { ComponentRouterOptions } from '../../shared/types/ComponentRouterOptions';
import { AuthValidator } from './auth.dto';

export function AuthRouter(options: ComponentRouterOptions<IAuthController, AuthValidator>): Router {
  const { controller, validator } = options;

  const router = Router();

  /**
   * @register - register a user
   */
  router.post('/register', validator.CreateAccountDto.validate, controller.register);

  /**
   * @login - sign in a user
   */
  router.post('/login', validator.LoginDto.validate, controller.login);

  return router;
}

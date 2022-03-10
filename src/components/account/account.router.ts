import { Router } from 'express';
import { IAccountController } from './account.controller';
import { AccountValidator } from './account.dto';
import { ComponentRouterOptions } from '../../shared/types/ComponentRouterOptions';

export function AccountRouter(options: ComponentRouterOptions<IAccountController, AccountValidator>): Router {
  const { controller, guards, validator } = options;
  const router = Router();

  router.post('/deposit', guards.AuthGuard({ strict: true }), controller.fundAccount);
  router.post('/transfer', guards.AuthGuard({ strict: true }), controller.transferFund);
  router.post('/withdraw', guards.AuthGuard({ strict: true }), controller.withdrawFund);

  return router;
}

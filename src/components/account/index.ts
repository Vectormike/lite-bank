import Guards from '../../shared/guards';
import { AccountControllerFactory } from './account.controller';
import { AccountRouter } from './account.router';
import { AccountService } from './account.service';

export const accountService = new AccountService();

export const accountController = AccountControllerFactory(accountService);

export const accountRouter = AccountRouter({
  controller: accountController,
  guards: Guards,
});

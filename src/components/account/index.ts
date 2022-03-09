import Guards from '../../shared/guards';
import { FileControllerFactory } from './account.controller';
import { FileRouter } from './account.router';
import { AccountService } from './account.service';

export const accountService = new AccountService();

export const fileController = FileControllerFactory(accountService);

export const fileRouter = FileRouter({
  controller: fileController,
  guards: Guards,
});

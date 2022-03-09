import { User } from './user.model';
import { UserService } from './user.service';
export const userService = new UserService(User);


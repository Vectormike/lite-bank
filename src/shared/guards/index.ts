import AuthGuard from './auth.guard';
import RoleGuard from './role.guard';

export class Guards{
    AuthGuard = AuthGuard;
    RoleGuard = RoleGuard;
}

export default new Guards();

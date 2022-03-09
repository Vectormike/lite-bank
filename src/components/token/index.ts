import { Token } from './token.model';
import { TokenService } from './token.service';

export const tokenService = new TokenService(Token);
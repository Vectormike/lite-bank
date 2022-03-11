import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import env from '../../helpers/env';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../errors';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { AccountService } from '../account/account.service';
import { UserType } from '../user/user.type';
import { CreateUserAccountInput, LoginInput } from './auth.interface';
import { LoggedInType } from './auth.type';
import { knex } from '../../config/database';
import { UserShape } from '../user/user.model';
import Randomstring from 'randomstring';
import logger from '../../logger';

export class AuthService {
  frontendBaseUrl: string = env.getBackendUrl();
  JWT_AUTH_SECRET: string = env.get('JWT_AUTH_SECRET');
  REFRESH_TOKEN_SECRET: string = env.get('REFRESH_TOKEN_SECRET');
  private BCRYPT_SALT: number = parseInt(env.get('BCRYPT_SALT'));

  constructor(private readonly userService: UserService, private readonly tokenService: TokenService, private readonly accountService: AccountService) {}

  /**
   * Generates JWT for a user
   * @param data - An object containing the ID and email of a user
   * @returns { string } - JWT
   */
  private generateJWT(user: UserShape): string {
    const payload = {
      id: user.id,
      email: user.email,
      date: Date.now(),
    };
    return jwt.sign(payload, this.JWT_AUTH_SECRET, { expiresIn: '1d' });
  }

  /**
   * Generates JWT for a user
   * @param data - An object containing the ID and email of a user
   * @returns { string } - JWT
   */
  private generateRefreshToken(user: UserShape): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      date: Date.now(),
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { expiresIn: '90d' }, (err, token) => {
        console.log(payload);
        if (err) {
          reject(new Error('Internal Server Error'));
        }
        resolve(token);
      });
    });
  }

  /**
   * Composes the login data
   */
  private composeLoginData(user: UserShape, token: string, refreshToken: string): LoggedInType {
    return {
      id: user.id,
      email: user.email,
      // accountNumber: user.accountNumber,
      token,
      refreshToken,
    };
  }

  /**
   * Creates a new user account
   */
  async register(data: CreateUserAccountInput): Promise<UserType> {
    const transaction = await knex.transaction();
    try {
      const user = await this.userService.createUser(
        {
          email: data.email,
          password: data.password,
        },
        transaction
      );

      const accountNumber = Randomstring.generate({
        length: 10,
        charset: 'numeric',
      });

      await this.accountService.createAccount(
        {
          user_id: user.id,
          accountNumber: accountNumber,
        },
        transaction
      );

      await transaction.commit();

      return {
        email: user.email,
        accountNumber,
      };
    } catch (error) {
      logger.info(JSON.stringify(error));
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Logs a user in
   */
  async login(data: LoginInput): Promise<LoggedInType> {
    const genericMessage = 'Invalid email or password';
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    if (!user.password) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      logger.info(genericMessage);
      throw new UnauthorizedError(genericMessage);
    }

    const jwt = this.generateJWT(user);

    const refreshToken = await this.generateRefreshToken(user);

    return this.composeLoginData(user, jwt, refreshToken);
  }
}

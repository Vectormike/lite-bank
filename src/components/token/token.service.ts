
import * as randomstring from 'randomstring';
import moment from 'moment';
import env from '../../helpers/env';
import { Token } from './token.model';
import {
  CreatePasswordResetTokenInput,
  CreateTokenInput
} from './token.input';
import { TokenType } from './token.type';


export class TokenService {
  constructor(
    private readonly tokenModel = Token
  ) {}

  /**
   * checkIfExpired - check if token has expired
   * @param token 
   * @returns boolen
   */
  checkIfExpired(token: TokenType): boolean {
    if (!token.expiresAt) {
      return false;
    }

    return moment(new Date(token.expiresAt)).isBefore(new Date());
  }

  /**
   * Get expiration date
   */
  private getExpiration(amount: number, unit?: moment.unitOfTime.DurationConstructor): Date {
    return moment(new Date()).add(amount, unit).toDate();
  }

  /**
   * Creates a new token
   */
  async create(createTokenInput: CreateTokenInput): Promise<TokenType> {
    return await this.tokenModel.query().insert(createTokenInput);
  }

  /**
   * Creates a password reset token. The reset token expires at exactly 24 hours from the time
   * of creation.
   */
  async createPasswordResetToken(input: CreatePasswordResetTokenInput): Promise<TokenType> {
    const token = await this.tokenModel.query().findOne({ ownerId: input.ownerId, type: 'password-reset' });
    const expiresAt = this.getExpiration(24, 'hours');

    if (token) {
     const updateTokenId = await this.tokenModel.query().patch({ value: input.value, expiresAt }).where({ id: token.id })
     return await this.tokenModel.query().findOne({ id: updateTokenId }) 
    }
    return this.create({
      ...input,
      type: 'password-reset',
      expiresAt,
    });
  }

  /**
   * Finds a token by value
   */
  async findByValue(value: string): Promise<TokenType> {
    return await this.tokenModel.query().findOne({ value });
  }

  /**
   * Finds a token by it's value and deletes it from the database
   */
  async delete(value: string): Promise<void> {
    await this.tokenModel.query().where({value});
  }
}

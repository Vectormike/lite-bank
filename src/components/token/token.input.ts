export class CreateTokenInput {
  value?: string;
  ownerId: number;
  type: string;
  expiresAt: Date;
}

export class CreatePasswordResetTokenInput {
  value: string;
  ownerId: number;
}

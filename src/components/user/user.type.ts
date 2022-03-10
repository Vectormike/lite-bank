export class UserType {
  readonly id?: number;
  email?: string;
  password?: string;
  accountNumber: string;
  lastLoggedIn?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  role?: string;
}

export class UserProfileType {
  readonly _id?: number;
  readonly id?: string;
  email?: string;
  lastLoggedIn?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  role?: string;
}

export class PreUserCreationProcessOutput {
  hashedPassword: string;
}

export interface CreateUserAccountInput {
  email: string;
  password: string;
}

export interface AuthJWTInput {
  id: number;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

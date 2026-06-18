import type { AuthResponse, LoginPayload, RegisterPayload } from '../dtos/authDTO';

export interface IAuthService {
  login(data: LoginPayload): Promise<AuthResponse>;
  register(data: RegisterPayload): Promise<AuthResponse>;
}

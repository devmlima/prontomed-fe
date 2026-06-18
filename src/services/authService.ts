import { api } from '../core/http/client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../core/dtos/authDTO';
import type { IAuthService } from '../core/interfaces/IAuthService';

class AuthService implements IAuthService {
  async login(data: LoginPayload): Promise<AuthResponse> {
    try {
      const { data: res } = await api.post<AuthResponse>('/auth/login', data);
      return res;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      throw new Error(msg ?? 'Falha ao fazer login');
    }
  }

  async register(data: RegisterPayload): Promise<AuthResponse> {
    try {
      const { data: res } = await api.post<AuthResponse>('/auth/register', data);
      return res;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      throw new Error(msg ?? 'Falha ao cadastrar');
    }
  }
}

export const authService = new AuthService();

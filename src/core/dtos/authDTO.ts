export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  crm: string;
}

export interface AuthResponse {
  token: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    crm: string;
  };
}

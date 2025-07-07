export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreationData {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

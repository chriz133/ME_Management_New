export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  displayName: string;
  role: string;
  expiresAt: Date;
}

export interface User {
  username: string;
  displayName: string;
  role: string;
  token: string;
}

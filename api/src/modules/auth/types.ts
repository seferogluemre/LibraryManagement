import type { User } from "@prisma/client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export interface AuthenticatedUser extends User {}

export interface LogoutRequest {
  refreshToken?: string;
}

export interface AuthContext {
  user: UserProfile;
  isAuthenticated: boolean;
}

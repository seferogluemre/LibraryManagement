import type { User } from "@prisma/client";
import type { LoginResponse, RefreshTokenResponse, UserProfile } from "./types";

export class AuthFormatter {

  /**
   * User entity'sini UserProfile formatına çevirir
   */
  static userProfile(user: User): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  /**
   * Login response formatı
   */
  static loginResponse(
    user: User,
    accessToken: string,
    refreshToken: string
  ): LoginResponse {
    return {
      user: this.userProfile(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh token response formatı
   */
  static refreshTokenResponse(
    accessToken: string,
    refreshToken: string
  ): RefreshTokenResponse {
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Logout response formatı
   */
  static logoutResponse(): { message: string } {
    return {
      message: "Başarıyla çıkış yapıldı",
    };
  }
}

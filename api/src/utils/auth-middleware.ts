import { AuthService } from "@modules/auth/service";
import { UnauthorizedException } from "@utils/http-errors";
import { Elysia } from "elysia";

/**
 * JWT Authentication Guard
 * Authorization header'dan token'ı alır ve doğrular
 */
export const authGuard = async (
  headers: Record<string, string | undefined>
) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedException("Authorization header gerekli");
  }

  const token = authHeader.substring(7);

  try {
    const user = await AuthService.validateToken(token);
    return user;
  } catch (error) {
    throw new UnauthorizedException("Geçersiz token");
  }
};

/**
 * JWT Authentication Middleware
 * Elysia instance
 */
export const authMiddleware = new Elysia({ name: "auth" }).macro(
  ({ onBeforeHandle }) => ({
    auth(enabled: boolean) {
      if (!enabled) return;

      onBeforeHandle(async ({ headers, set }) => {
        try {
          const user = await authGuard(headers);
          return { user, isAuthenticated: true };
        } catch (error) {
          set.status = 401;
          throw error;
        }
      });
    },
  })
);

/**
 * Simple auth plugin
 */
export const auth = new Elysia({ name: "auth-plugin" }).derive(
  async ({ headers }) => {
    try {
      const user = await authGuard(headers);
      return { user, isAuthenticated: true };
    } catch {
      throw new UnauthorizedException("Geçersiz token");
    }
  }
);

/**
 * Optional Auth Middleware
 * Token varsa doğrular, yoksa null user döner
 */
export const optionalAuthMiddleware = new Elysia({
  name: "optional-auth-middleware",
}).derive(async ({ headers }) => {
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      user: null,
      isAuthenticated: false,
    };
  }

  const token = authHeader.substring(7);

  try {
    const user = await AuthService.validateToken(token);
    return {
      user,
      isAuthenticated: true,
    };
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false,
    };
  }
});

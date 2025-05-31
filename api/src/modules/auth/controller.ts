import { Elysia } from "elysia";
import { authMiddleware } from "../../utils/auth-middleware";
import { loginDto, logoutDto, meDto, refreshTokenDto } from "./dtos";
import { AuthFormatter } from "./formatters";
import { AuthService } from "./service";

export const app = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Authentication"],
  },
})
  .post(
    "/login",
    async ({ body }) => {
      const { user, accessToken, refreshToken } = await AuthService.login(body);
      return AuthFormatter.loginResponse(user, accessToken, refreshToken);
    },
    loginDto
  )
  .post(
    "/refresh-token",
    async ({ body }) => {
      const { accessToken, refreshToken } =
        await AuthService.refreshToken(body);
      return AuthFormatter.refreshTokenResponse(accessToken, refreshToken);
    },
    refreshTokenDto
  )
  .post(
    "/logout",
    async () => {
      const result = await AuthService.logout();
      return AuthFormatter.logoutResponse();
    },
    logoutDto
  )
  .use(authMiddleware)
  .get(
    "/me", // Kullanıcı profili
    async ({ headers }) => {
      const userProfile = await AuthService.me(headers.authorization);
      return userProfile;
    },
    meDto
  );

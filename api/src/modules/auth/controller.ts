import { authGuard } from "@utils/auth-middleware";
import { error } from "console";
import { Elysia } from "elysia";
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
      try {
        const { user, accessToken, refreshToken } =
          await AuthService.login(body);
        return AuthFormatter.loginResponse(user, accessToken, refreshToken);
      } catch (err) {
        return error(401, { message: (err as Error).message });
      }
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
    async ({ headers }) => {
      const user = await authGuard(headers);
      await AuthService.logout(user.id);
      return AuthFormatter.logoutResponse();
    },
    logoutDto
  )
  .get(
    "/me",
    async ({ headers }) => {
      const user = await authGuard(headers);
      return AuthFormatter.userProfile(user);
    },
    meDto
  );

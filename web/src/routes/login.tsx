import { LoginPage } from "@/features/auth/login";
import UnauthorizedError from "@/features/errors/unauthorized-error";
import { redirect } from "@tanstack/react-router";

import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context?.auth?.accessToken) {
      throw redirect({
        to: "/dashboard",
        replace: true,
      });
    }
  },
  component: LoginPage,
  errorComponent: () => {
    return <UnauthorizedError />;
  }
}); 
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import {
  clearLocalStorageAuthState,
  getAuthState,
  setAuthState,
  type AuthState
} from "@/lib/auth";
import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import React from "react";
import type { RouterContext } from "../main"; // main.tsx'den arayüzü import et

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouter();
  const [auth, setAuth] = React.useState<AuthState>(getAuthState());

  React.useEffect(() => {
    const context: RouterContext = {
      ...auth,
      login: (data) => {
        setAuthState(data);
        setAuth(data);
      },
      logout: () => {
        clearLocalStorageAuthState();
        setAuth({ accessToken: null, refreshToken: null, user: null });
      },
    };
    router.update({ context });
  }, [auth, router]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}

import { MainLayout } from "@/components/layout/main-layout";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getAuthState } from "@/lib/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.accessToken) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
        replace: true,
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  useGeolocation();

  useEffect(() => {
    const authState = getAuthState();
    const userId = authState.user?.id;

    if (!userId) {
      console.error("WebSocket bağlantısı için kullanıcı ID'si bulunamadı.");
      return;
    }

    const wsUrl = `ws://localhost:3000/ws?userId=${userId}`;
    const ws = new WebSocket(wsUrl);


    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

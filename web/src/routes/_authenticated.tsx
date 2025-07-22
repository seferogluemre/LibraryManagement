import { MainLayout } from "@/components/layout/main-layout";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getAuthState, getLoginTimestamp } from "@/services/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    // @ts-expect-error - context type is not properly inferred
    if (!context.auth.accessToken) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  useGeolocation();
  const [sessionExpiredWarningShown, setSessionExpiredWarningShown] =
    useState(false);

  useEffect(() => {
    const authState = getAuthState();
    const userId = authState.user?.id;

    if (!userId) {
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

  useEffect(() => {
    const loginTimestamp = getLoginTimestamp();
    if (!loginTimestamp || sessionExpiredWarningShown) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const sessionDuration = now - loginTimestamp;
      const oneHour = 60 * 60 * 1000;

      if (sessionDuration > oneHour) {
        toast.warning(
          "Oturumunuzun geçerliliği bitmiştir. Yaptığınız işlemler düzgün sonuçlar vermeyebilir. Lütfen çıkış yapıp tekrar giriş yapınız.",
          {
            duration: Infinity,
            dismissible: true,
          }
        );
        setSessionExpiredWarningShown(true);
        clearInterval(interval);
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [sessionExpiredWarningShown]);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

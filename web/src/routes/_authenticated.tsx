import { Sidebar } from "@/components/layout/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

const beforeLoad = ({ context, location }) => {
  if (!context.accessToken) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
      replace: true,
    });
  }
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Ana İçerik Alanı */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Outlet />
        </main>
      </div>
    </div>
  );
}

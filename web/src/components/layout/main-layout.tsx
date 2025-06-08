import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Menu, X } from "lucide-react";
import React from "react";
import { SidebarOverlay } from "./sidebar-overlay";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobile = useMobile();
  const { isOpen, toggle } = useSidebarStore();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SidebarOverlay />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen && !isMobile ? "ml-64" : "ml-0"
        )}
      >
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="shrink-0 md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="sr-only">Toggle navigation</span>
          </Button>

          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold">
              Kütüphane Yönetim Sistemi
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </>
  );
}

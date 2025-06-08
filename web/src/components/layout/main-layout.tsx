import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Menu, X } from "lucide-react";
import React from "react";
import { Sidebar } from "./sidebar";
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
    <div className="min-h-screen bg-background">
      <Sidebar />

      <SidebarOverlay />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen && !isMobile ? "ml-80" : "ml-0"
        )}
      >
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="shrink-0"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                Kütüphane Yönetim Sistemi
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

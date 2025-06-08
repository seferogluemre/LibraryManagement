import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useEffect, useState } from "react";

export function SidebarOverlay() {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, isMobile, close } = useSidebarStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isMobile || !isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm",
        "transition-opacity duration-300"
      )}
      onClick={close}
    />
  );
}

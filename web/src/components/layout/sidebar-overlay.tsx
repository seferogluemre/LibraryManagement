import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";

export function SidebarOverlay() {
  const { isOpen, isMobile, close } = useSidebarStore();

  if (!isMobile || !isOpen) return null;

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

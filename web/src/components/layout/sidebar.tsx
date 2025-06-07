import { navigationItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useState } from "react";
import { SidebarItem } from "./sidebar-item";

export function Sidebar() {
  const { isOpen, isMobile } = useSidebarStore();
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isMobile ? "w-full" : "w-80"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-semibold text-white">Navigasyon</h1>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onClick={() => {
              setActiveItem(item.id);
              // Burada routing logic gelecek
              console.log(`Navigate to: ${item.href}`);
            }}
          />
        ))}
      </div>

      {/* Footer - Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              K
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Kütüphaneci</p>
            <p className="text-xs text-slate-400">librarian</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

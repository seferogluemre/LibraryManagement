import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation";

interface SidebarItemProps {
  item: NavigationItem;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ item, isActive, onClick }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200",
        "hover:bg-slate-700/50 hover:text-white",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        isActive ? "bg-slate-700 text-white shadow-sm" : "text-slate-300"
      )}
    >
      <Icon size={20} className="shrink-0" />

      <span className="flex-1 font-medium">{item.title}</span>

      {item.badge && (
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          {item.badge}
        </span>
      )}
    </button>
  );
}

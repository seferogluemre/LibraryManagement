import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  item: {
    href: string;
    label: string;
    icon: LucideIcon;
    color?: string;
  };
}

export function SidebarItem({ item }: SidebarItemProps) {
  return (
    <Link
      to={item.href}
      className="relative flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group overflow-hidden"
      activeProps={{
        className: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
      }}
    >
        <span className="absolute left-0 top-0 h-full w-1 bg-transparent transition-all duration-300 group-hover:bg-primary/20" />
      <item.icon className={cn("w-5 h-5 mr-3 transition-colors", item.color, "group-hover:text-foreground")} />
      <span className="transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
    </Link>
  );
}

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
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group"
      activeProps={{
        className: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
      }}
    >
      <item.icon className={cn("w-5 h-5 mr-3", item.color, "group-hover:text-foreground")} />
      {item.label}
    </Link>
  );
}

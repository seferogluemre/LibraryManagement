import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  item: {
    href: string;
    label: string;
    icon: LucideIcon;
  };
}

export function SidebarItem({ item }: SidebarItemProps) {
  return (
    <Link
      to={item.href}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      activeProps={{
        className: "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
      }}
    >
      <item.icon className="w-5 h-5 mr-3" />
      {item.label}
    </Link>
  );
}

import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
  isActive?: boolean;
  children?: NavigationItem[];
}

export interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

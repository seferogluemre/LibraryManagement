import type { LucideIcon } from "lucide-react";
import type { Key } from "react";

export interface NavigationItem {
  label: Key | null | undefined;
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
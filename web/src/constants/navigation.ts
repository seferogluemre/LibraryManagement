import type { NavigationItem } from "@/types/navigation";
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  History,
  Tag,
  UserPen,
  Users,
} from "lucide-react";

export const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    id: "online-users",
    title: "Online Kullanıcılar",
    icon: Activity,
    href: "/online-users",
    badge: 12,
  },
  {
    id: "student-management",
    title: "Öğrenci Yönetimi",
    icon: Users,
    href: "/students",
  },
  {
    id: "class-management",
    title: "Sınıf Yönetimi",
    icon: GraduationCap,
    href: "/classes",
  },
  {
    id: "student-transfer",
    title: "Öğrenci Transferi",
    icon: ArrowLeftRight,
    href: "/transfers",
  },
  {
    id: "transfer-history",
    title: "Transfer Geçmişi",
    icon: History,
    href: "/transfer-history",
  },
  {
    id: "book-management",
    title: "Kitap Yönetimi",
    icon: BookOpen,
    href: "/books",
  },
  {
    id: "author-management",
    title: "Yazar Yönetimi",
    icon: UserPen,
    href: "/authors",
  },
  {
    id: "category-management",
    title: "Kategori Yönetimi",
    icon: Tag,
    href: "/categories",
  },
  {
    id: "publisher-management",
    title: "Yayınevi Yönetimi",
    icon: Building2,
    href: "/publishers",
  },
  {
    id: "lending-operations",
    title: "Ödünç İşlemleri",
    icon: FileText,
    href: "/lending",
  },
];

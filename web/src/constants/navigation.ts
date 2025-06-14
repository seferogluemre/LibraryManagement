import {
  ArrowRightLeft,
  Book,
  BookCopy,
  Building,
  History,
  LayoutDashboard,
  PenSquare,
  School,
  Tags,
  Users
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/online-users", icon: Users, label: "Online Kullanıcılar" },
  { href: "/students", icon: Users, label: "Öğrenci Yönetimi" },
  { href: "/classes", icon: School, label: "Sınıf Yönetimi" },
  { href: "/transfers", icon: ArrowRightLeft, label: "Öğrenci Transferi" },
  { href: "/history", icon: History, label: "Transfer Geçmişi" },
  { href: "/books", icon: Book, label: "Kitap Yönetimi" },
  { href: "/authors", icon: PenSquare, label: "Yazar Yönetimi" },
  { href: "/categories", icon: Tags, label: "Kategori Yönetimi" },
  { href: "/publishers", icon: Building, label: "Yayınevi Yönetimi" },
  { href: "/lending", icon: BookCopy, label: "Ödünç İşlemleri" },
];
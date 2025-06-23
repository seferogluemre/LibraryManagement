import {
  ArrowRightLeft,
  Book,
  BookCheck,
  Building,
  History,
  LayoutDashboard,
  PenSquare,
  School,
  Tags,
  Users,
} from "lucide-react"

export const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "text-sky-500",
  },
  {
    href: "/online-users",
    icon: Users,
    label: "Online Kullanıcılar",
    color: "text-green-500",
  },
  {
    href: "/students",
    icon: Users,
    label: "Öğrenci Yönetimi",
    color: "text-violet-500",
  },
  {
    href: "/classes",
    icon: School,
    label: "Sınıf Yönetimi",
    color: "text-orange-500",
  },
  {
    href: "/transfers",
    icon: ArrowRightLeft,
    label: "Öğrenci Transferi",
    color: "text-yellow-500",
  },
  {
    href: "/transfer-history",
    icon: History,
    label: "Transfer Geçmişi",
    color: "text-red-500",
  },
  {
    href: "/books",
    icon: Book,
    label: "Kitap Yönetimi",
    color: "text-blue-500",
  },
  {
    href: "/authors",
    icon: PenSquare,
    label: "Yazar Yönetimi",
    color: "text-indigo-500",
  },
  {
    href: "/categories",
    icon: Tags,
    label: "Kategori Yönetimi",
    color: "text-pink-500",
  },
  {
    href: "/publishers",
    icon: Building,
    label: "Yayınevi Yönetimi",
    color: "text-emerald-500",
  },
  {
    href: "/assignments",
    icon: BookCheck,
    label: "Ödünç İşlemleri",
    color: "text-rose-500",
  },
]
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouteContext } from "@tanstack/react-router";
import {
    ArrowRightLeft,
    Book,
    BookCopy,
    Building,
    History,
    LayoutDashboard,
    PenSquare,
    School,
    Settings,
    Tags,
    Users
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/users", icon: Users, label: "Online Kullanıcılar" },
  { href: "/students", icon: Users, label: "Öğrenci Yönetimi" },
  { href: "/classes", icon: School, label: "Sınıf Yönetimi" },
  { href: "/transfers", icon: ArrowRightLeft, label: "Öğrenci Transferi" },
  { href: "/history", icon: History, label: "Transfer Geçmişi" },
  { href: "/books", icon: Book, label: "Kitap Yönetimi" },
  { href: "/authors", icon: PenSquare, label: "Yazar Yönetimi" },
  { href: "/categories", icon: Tags, label: "Kategori Yönetimi" },
  { href: "/publishers", icon: Building, label: "Yayınevi Yönetimi" },
  { href: "/lending", icon: BookCopy, label: "Ödünç İşlemleri" },
  { href: "/settings", icon: Settings, label: "Ayarlar" },
];

export function Sidebar() {
    const { user } = useRouteContext({ from: '/_authenticated' });

    return (
        <aside className="w-64 flex-shrink-0 bg-background border-r flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-xl font-bold tracking-wider">Navigasyon</h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <SidebarItem key={item.label} item={item} />
                ))}
            </nav>
            <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold">{user?.name || 'Kullanıcı'}</p>
                        <p className="text-xs text-muted-foreground">{user?.role || 'user'}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useRouteContext } from "@tanstack/react-router";
import {
    ArrowRightLeft,
    Book,
    BookCopy,
    Building,
    History,
    LayoutDashboard,
    Menu,
    PenSquare,
    School,
    Settings,
    Tags,
    Users,
    X
} from "lucide-react";
import { useEffect } from "react";
import { SidebarItem } from "./sidebar-item";

const navItems = [
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
  { href: "/settings", icon: Settings, label: "Ayarlar" },
];

export function Sidebar() {
    const { user } = useRouteContext({ from: '/_authenticated' });
    const { isOpen, toggle, setIsMobile } = useSidebarStore();

    // Responsive design listener
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Initial check
        checkMobile();

        // Add event listener
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, [setIsMobile]);

    return (
        <>
            {/* Mobile toggle button */}
            <Button 
                variant="outline" 
                size="icon" 
                className="lg:hidden fixed top-4 left-4 z-50" 
                onClick={toggle}
            >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Sidebar with responsive classes */}
            <aside 
                className={`
                    fixed lg:static 
                    top-0 left-0 bottom-0 
                    w-64 bg-background border-r 
                    flex flex-col 
                    transform transition-transform duration-300 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 
                    z-40 lg:z-0
                `}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-wider">Navigasyon</h1>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="lg:hidden" 
                        onClick={toggle}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
        </>
    );
}

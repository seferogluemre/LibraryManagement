import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { navItems } from "@/constants/navigation";
import { clearLocalStorageAuthState } from "@/lib/auth";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import {
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { SidebarItem } from "./sidebar-item";



export function Sidebar() {
    const { user } = useRouteContext({ from: '/_authenticated' });
    const { isOpen, toggle, setIsMobile } = useSidebarStore();
    const router = useRouter();

    const handleLogout = () => {
        clearLocalStorageAuthState();
        toast.success("Başarıyla çıkış yaptınız.");
        router.navigate({ to: "/login" });
    };

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
                <div className="p-4 border-t mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-semibold">{user?.name || 'Kullanıcı'}</p>
                            <p className="text-xs text-muted-foreground">{user?.role || 'user'}</p>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Çıkış Yap
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Oturumunuzu sonlandırmak ve güvenli bir şekilde çıkış yapmak
                                    istediğinizden emin misiniz?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleLogout}>
                                    Evet, Çıkış Yap
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </aside>
        </>
    );
}

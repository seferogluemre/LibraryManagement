import React from "react";
import { cn } from "#lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  showSidebar?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Main = ({ fixed, showSidebar = true, ...props }: MainProps) => {
  // Sidebar'ı gizlemek için CSS değişkenleri ayarla
  React.useEffect(() => {
    if (showSidebar === false) {
      // CSS değişkenlerini doğrudan document.documentElement'e uygula
      document.documentElement.style.setProperty('--sidebar-width', '0');
      document.documentElement.style.setProperty('--sidebar-open-width', '0');
      // Sidebar ile ilgili diğer elementleri gizle
      document.querySelectorAll('[data-sidebar]').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    }
    
    return () => {
      // Component unmount olduğunda değerleri sıfırla
      if (showSidebar === false) {
        document.documentElement.style.removeProperty('--sidebar-width');
        document.documentElement.style.removeProperty('--sidebar-open-width');
        document.querySelectorAll('[data-sidebar]').forEach((el) => {
          (el as HTMLElement).style.removeProperty('display');
        });
      }
    };
  }, [showSidebar]);

  return (
    <main
      className={cn(
        "peer-[.header-fixed]/header:mt-16",
        "px-4 py-6",
        fixed && "fixed-main flex flex-grow flex-col overflow-hidden",
        showSidebar === false && "sidebar-hidden !ml-0 !pl-0 w-full"
      )}
      {...props}
    />
  );
};

Main.displayName = "Main";

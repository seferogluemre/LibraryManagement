import { cn } from "@/lib/utils";
import React from "react";
import { Sidebar } from "./sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "lg:ml-0 ml-0 pt-16 lg:pt-0"
        )}
      >

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:ml-0">{children}</main>
      </div>
    </div>
  );
}

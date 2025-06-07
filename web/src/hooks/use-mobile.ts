// src/hooks/use-mobile.ts
import { useSidebarStore } from "@/stores/sidebar-store";
import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768; // md breakpoint

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const { setIsMobile: setSidebarMobile } = useSidebarStore();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setSidebarMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [setSidebarMobile]);

  return isMobile;
}

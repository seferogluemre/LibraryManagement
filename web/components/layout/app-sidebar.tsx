import { NavGroup } from "#components/layout/nav-group";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from "#components/ui/sidebar";
import { cn } from "#lib/utils";
import logo from "../../assets/logo.png";
import { sidebarData } from "./data/sidebar-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader className="flex flex-col items-center p-4">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center w-full" : "justify-between w-full"
        )}>
          <div className="flex items-center">
            <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <img src={logo} alt="Artidenizcilik Logo" className="h-full w-full object-contain" />
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-semibold">ARTIDENİZCİLİK</p>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}

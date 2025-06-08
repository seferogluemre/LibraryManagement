import {
  IconAddressBook,
  IconAnchor,
  IconBuilding,
  IconCategory,
  IconHome,
  IconLayoutDashboard,
  IconUsers,
} from "@tabler/icons-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Artidenizcilik",
      logo: IconHome,
      plan: "Pro",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Companies",
          icon: IconBuilding,
          items: [
            {
              title: "Suppliers",
              url: "/companies/suppliers",
              icon: IconBuilding,
            },
            {
              title: "Shipyards",
              url: "/companies/shipyards",
              icon: IconAnchor,
            },
          ],
        },
        {
          title: "Projects",
          url: "/projects",
          icon: IconLayoutDashboard,
        },

        {
          title: "Product Categories",
          url: "/product-categories",
          icon: IconCategory,
        },
        {
          title: "Staff",
          url: "/staff",
          icon: IconUsers,
        },
        {
          title: "Vessel",
          icon: IconAnchor,
          items: [
            {
              title: "Vessel Classes",
              url: "/vessel-classes",
            },
            {
              title: "Vessel Types",
              url: "/vessel-types",
            },
          ],
        },
        {
          title: "Contacts",
          url: "/contacts",
          icon: IconAddressBook,
        },
      ],
    },
  ],
};

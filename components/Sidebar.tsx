"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogOut, Newspaper, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const links = [
    {
      title: "Articles",
      url: "/dashboard/articles",
      isActive: isActive(pathname, "/dashboard/articles"),
      icon: <Newspaper />,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: <Tag />,
      isActive: isActive(pathname, "/dashboard/categories"),
    },
  ];

  function isActive(pathname: string, url: string) {
    if (pathname === url) {
      return true;
    }

    return false;
  }

  return (
    <Sidebar {...props}>
      <SidebarContent className="p-5 bg-blue-600">
        <SidebarGroupLabel className="mb-5" asChild>
          <Link href="/">
            <Image
              priority
              src="/logo.svg"
              width={100}
              height={100}
              alt="LogoIpsum"
              className="w-40"
            />
          </Link>
        </SidebarGroupLabel>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.title}>
              <SidebarMenuButton asChild isActive={link.isActive}>
                <Link className="text-white font-semibold" href={link.url}>
                  {link.icon}
                  {link.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => confirm("Are you sure you want to logout?")}
              className="text-white font-semibold"
            >
              <LogOut /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

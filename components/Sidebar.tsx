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
import { removeToken } from "@/lib/tokenizer";
import { useUserStore } from "@/stores/useUserStore";
import { LogOut, Newspaper, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearuser } = useUserStore();
  const [open, setOpen] = useState<boolean>(false);

  const isActive = (pathname: string, url: string) => {
    if (pathname.includes(url)) return true;
    return false;
  };

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

  const logout = async () => {
    await removeToken();
    router.push("/");
    clearuser();
  };

  return (
    <>
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
                onClick={() => setOpen(true)}
                className="text-white font-semibold"
              >
                <LogOut /> Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={logout}
              className="bg-red-500 hover:bg-red-600"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

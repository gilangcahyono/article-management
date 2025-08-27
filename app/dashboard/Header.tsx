"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const header = pathname.split("/")[2];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-lg font-semibold capitalize">{header}</h1>
    </header>
  );
};

export default Header;

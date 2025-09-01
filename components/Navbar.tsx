"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { removeToken } from "@/lib/tokenizer";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "./ui/button";

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { user, clearuser } = useUserStore();

  const logout = async () => {
    await removeToken();
    router.push("/");
    clearuser();
  };

  return (
    <nav className="shadow flex items-center justify-between p-4">
      <Link href="/">
        <Image
          src="/logo.svg"
          width={100}
          height={100}
          alt="LogoIpsum"
          className="w-32"
        />
      </Link>

      {!user ? (
        <Button className="bg-blue-500 hover:bg-blue-600" asChild>
          <Link href="/login">Login</Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3">
            <Avatar>
              <AvatarImage />
              <AvatarFallback className="bg-blue-200 font-semibold">
                {user[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="hidden sm:block underline text-blue-500">{user}</p>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/articles">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="w-full text-red-500">
              <button onClick={() => setOpen(true)}>
                <LogOut className="text-red-500" />
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

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
    </nav>
  );
};

export default Navbar;

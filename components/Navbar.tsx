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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { getToken } from "@/lib/tokenizer";

const Navbar = async () => {
  const token = await getToken();

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

      {!token ? (
        <Link href="/login">
          <Avatar>
            <AvatarFallback className="bg-blue-200 font-semibold">
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3">
            <Avatar>
              <AvatarImage />
              <AvatarFallback className="bg-blue-200 font-semibold">
                J
              </AvatarFallback>
            </Avatar>
            <p className="hidden sm:block underline text-blue-500">joniku</p>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href="/profile">My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/articles">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="w-full text-red-500">
                  <LogOut className="text-red-500" />
                  Logout
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default Navbar;

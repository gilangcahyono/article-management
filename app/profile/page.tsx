import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import axios from "@/lib/axios";
import { getToken } from "@/lib/tokenizer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const Page: React.FC = async () => {
  const res = await axios.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  const user: User = res.data;

  return (
    <>
      <Navbar />
      <div className="flex gap-6 flex-col items-center justify-center min-h-[80dvh] px-10">
        <h1 className="text-center font-semibold text-2xl">User Profile</h1>
        <Avatar className="w-16 h-16 mx-auto">
          <AvatarFallback className="bg-blue-200 font-semibold text-2xl">
            {user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Button
          asChild
          className="w-full sm:w-sm bg-blue-500 hover:bg-blue-600"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default Page;

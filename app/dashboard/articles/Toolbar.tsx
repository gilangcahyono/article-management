"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Category } from "@/types/articles";

const Toolbar = () => {
  const queryParams = useSearchParams();
  const searchParam = queryParams.get("search");
  const [search, setSearch] = useState<string>(searchParam || "");
  const router = useRouter();

  // useEffect(() => {
  //   if (search.trim()) {
  //     router.push(`/dashboard/categories?search=${encodeURIComponent(search)}`);
  //   } else {
  //     router.replace("/dashboard/categories");
  //     setSearch("");
  //   }
  // }, [search, router]);

  return (
    <div className="flex flex-col-reverse sm:flex-row mb-5 gap-3">
      <Select>
        <SelectTrigger className="bg-white w-full sm:w-fit">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {/* {categories.map((category: Category, i: number) => (
              <SelectItem key={i} value={category.id}>
                <span className="text-black">{category.name}</span>
              </SelectItem>
            ))} */}
            <SelectItem value="Management">
              <span className="text-black">Management</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input type="text" placeholder="Search by title" className="pl-10" />
      </div>

      <Button
        className="bg-blue-500 hover:bg-blue-600 ms-auto w-full sm:w-fit"
        asChild
      >
        <Link href="/dashboard/articles/add">
          <Plus />
          Write an article
        </Link>
      </Button>
    </div>
  );
};

export default Toolbar;

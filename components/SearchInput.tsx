"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "@/lib/axios";
import { Category } from "@/types/articles";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchInput = () => {
  const queryParams = useSearchParams();
  const categoryParam = queryParams.get("category");
  const searchParam = queryParams.get("search");
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string>(categoryParam || "");
  const [search, setSearch] = useState<string>(searchParam || "");
  const router = useRouter();

  useEffect(() => {
    axios.get("/categories").then((res) => {
      const data = res.data.data.filter(
        (category: Category) => category.id !== ""
      );
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    // if (category.trim()) {
    router.push(`/?category=${encodeURIComponent(category)}`);
    // } else {
    //   router.replace("/");
    //   setCategory("");
    // }
  }, [category, router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim()) {
        router.push(`/?search=${encodeURIComponent(search)}`);
      } else {
        router.replace("/");
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, router]);

  return (
    <section className="bg-blue-500 py-10">
      <div className="flex flex-col sm:flex-row justify-center gap-2 bg-blue-400 w-xs sm:w-fit mx-auto p-1.5 rounded-lg">
        <Select onValueChange={(value) => setCategory(value)} value={category}>
          <SelectTrigger className="bg-white w-full sm:w-fit">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category: Category, i: number) => (
                <SelectItem key={i} value={category.id || "null"}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Search articles"
          className="w-full sm:w-sm bg-white"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
    </section>
  );
};

export default SearchInput;

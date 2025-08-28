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
    axios
      .get("/categories", {
        params: {
          limit: 100,
        },
      })
      .then((res) => {
        const data = res.data.data.filter(
          (category: Category) => category.id !== ""
        );
        setCategories(data);
      });
  }, []);

  useEffect(() => {
    if (category.trim()) {
      router.push(`/?category=${encodeURIComponent(category)}`);
      setSearch("");
    } else {
      router.replace("/");
    }
  }, [category, router]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim()) {
        router.push(`/?search=${encodeURIComponent(search)}`);
        setCategory("");
      } else {
        router.replace("/");
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, router]);

  return (
    <section className="relative h-[50dvh] bg-[url('https://img.lovepik.com/element/40066/4015.png_1200.png')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-blue-500/80" />

      <div className="relative z-10 text-white text-center flex flex-col gap-3 items-center justify-center h-full">
        <p className="font-semibold">Blog M</p>
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Exploring thoughts, stories, and everything in between.
        </h1>
        <h3 className="text-xl font-normal mb-4">Your daily dose of insight</h3>

        <div className="flex flex-col h-fit sm:flex-row justify-center gap-2 bg-blue-400 w-xs sm:w-fit mx-auto p-1.5 rounded-lg">
          <Select
            onValueChange={(value) => setCategory(value)}
            value={category}
          >
            <SelectTrigger className="bg-white w-full sm:w-fit">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category: Category, i: number) => (
                  <SelectItem key={i} value={category.id}>
                    <span className="text-black">{category.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Search articles"
            className="w-full sm:w-sm bg-white text-black"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>
    </section>
  );
};

export default SearchInput;

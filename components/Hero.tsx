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

const Hero = () => {
  const queryParams = useSearchParams();
  const searchParam = queryParams.get("search");
  const category = queryParams.get("category");
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>(searchParam || "");
  const router = useRouter();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setSearch(searchParam || "");
  }, [searchParam]);

  const getCategories = async () => {
    const res = await axios.get("/categories", {
      params: {
        limit: 100,
      },
    });
    const data = res.data.data.filter(
      (category: Category) => category.id !== ""
    );
    setCategories(data);
  };

  const handleChangeCategory = (value: string) => {
    router.push(`/?category=${encodeURIComponent(value)}`);
    setSearch("");
  };

  const handleChangeSearch = (value: string) => {
    setSearch(value);
    router.push(`/?search=${encodeURIComponent(value)}`);
    if (value === "" && category !== "") return router.replace("/");
  };

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
          <Select onValueChange={handleChangeCategory} value={category || ""}>
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
            onChange={(e) => handleChangeSearch(e.target.value)}
            value={search}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

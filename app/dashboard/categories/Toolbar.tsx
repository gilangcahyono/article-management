"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Toolbar = () => {
  const queryParams = useSearchParams();
  const searchParam = queryParams.get("search");
  const [search, setSearch] = useState<string>(searchParam || "");
  const [category, setCategory] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (search.trim()) {
      router.push(`/dashboard/categories?search=${encodeURIComponent(search)}`);
    } else {
      router.replace("/dashboard/categories");
      setSearch("");
    }
  }, [search, router]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(category);
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row mb-5 gap-3 justify-between">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search category"
          className="pl-10"
        />
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 w-full sm:w-fit"
          >
            <Plus />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleAdd} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="mb-3">Add Category</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="add-category">Category</Label>
              <Input
                id="add-category"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                placeholder="Input category"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Toolbar;

/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { getToken } from "@/lib/tokenizer";

const formSchema = z.object({
  name: z.string().nonempty("Category field cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

const Toolbar = () => {
  const queryParams = useSearchParams();
  const searchParam = queryParams.get("search");
  const [search, setSearch] = useState<string>(searchParam || "");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (search.trim()) {
      router.push(`/dashboard/categories?search=${encodeURIComponent(search)}`);
    } else {
      router.replace("/dashboard/categories");
      setSearch("");
    }
  }, [search, router]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const token = await getToken();
    try {
      await axios.post("/categories", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setOpen(false);
      router.refresh();
      form.reset();
      toast.success("Category added successfully");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
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

      <Dialog open={open} onOpenChange={setOpen}>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="mb-3">Add Category</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Input category"
                        {...field}
                        type="text"
                        readOnly={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={form.formState.isSubmitting}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {form.formState.isSubmitting ? "Adding..." : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Toolbar;

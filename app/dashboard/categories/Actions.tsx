/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SquarePen, Trash2 } from "lucide-react";
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
import { Category } from "@/types/articles";
import { getToken } from "@/lib/tokenizer";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().nonempty("Category field cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

const Actions: React.FC<{ category: Category }> = ({ category }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = async (categoryId: string) => {
    const token = await getToken();
    try {
      await axios.delete(`/categories/${categoryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      router.refresh();
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category.name,
      });
    }
  }, [open, form, category.name]);

  const onSubmit = async (data: FormData) => {
    const token = await getToken();
    try {
      await axios.put(`/categories/${category.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setOpen(false);
      form.reset();
      router.refresh();
      toast.success("Category updated successfully");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="flex gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SquarePen size={20} className="text-yellow-500" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="mb-3">Edit Category</DialogTitle>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Trash2 size={20} className="text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Delete category “{category.name}”? This will remove it from master
              data permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(category.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Actions;

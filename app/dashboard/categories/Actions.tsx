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
import { Label } from "@/components/ui/label";

const Actions: React.FC<{ category: Category }> = ({ category }) => {
  const router = useRouter();

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

  return (
    <>
      <div className="flex gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <SquarePen size={20} className="text-yellow-500" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader className="mb-3">
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="edit-category">Category</Label>
              <Input id="edit-category" defaultValue={category.name} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Save changes
              </Button>
            </DialogFooter>
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
                Delete category “{category.name}”? This will remove it from
                master data permanently.
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
    </>
  );
};

export default Actions;

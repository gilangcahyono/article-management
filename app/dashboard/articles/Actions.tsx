"use client";

import { Eye, SquarePen, Trash2 } from "lucide-react";
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
import { Article } from "@/types/articles";
import { getToken } from "@/lib/tokenizer";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const Actions: React.FC<{ article: Article }> = ({ article }) => {
  const router = useRouter();

  const handleDelete = async (articleId: string) => {
    const token = await getToken();
    try {
      await axios.delete(`/articles/${articleId}`, {
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
    <div className="flex gap-3">
      <Link
        href={`/articles/${article.id}`}
        className="text-blue-500 underline"
      >
        <Eye size={20} />
      </Link>
      <button className="text-yellow-500 underline">
        <SquarePen size={20} />
      </button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Trash2 size={20} className="text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Delete article “{article.title}”? This will remove it from master
              data permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(article.id)}
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

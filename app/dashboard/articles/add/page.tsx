/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/tokenizer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Preview from "@/components/Preview";
import { useEffect, useState } from "react";
import { Article } from "@/types/articles";

const article: Article = {
  id: "7a768e14-567f-4241-a0f4-18ebb24fe6ae",
  userId: "69d72f64-e938-40de-bbf2-15750adb4bae",
  categoryId: "716cc32c-578a-4889-8fac-8f3a5e6e71ce",
  title: "Kucing: Sahabat Berbulu yang Menggemaskan",
  content:
    '<p>Kucing adalah <strong>hewan peliharaan</strong> populer dengan berbagai ras dan karakter <em>unik</em>. Dikenal dengan kemandirian dan keanggunannya, kucing juga sangat penyayang dan suka bermain. Mereka memiliki insting berburu yang kuat namun bisa menjadi teman yang setia di rumah. Perawatannya relatif mudah, menjadikannya pilihan favorit banyak orang.</p><p></p><img src="https://s3.sellerpintar.com/articles/articles/1755428738389-content-image-1755428737450.png"><p></p><p></p>',
  imageUrl:
    "https://s3.sellerpintar.com/articles/articles/1755428738490-d17cc7bf0e13fcdf975dd682d5df792f.jpg",
  createdAt: "2025-08-17T11:05:38.584Z",
  updatedAt: "2025-08-17T11:05:38.584Z",
  category: {
    id: "716cc32c-578a-4889-8fac-8f3a5e6e71ce",
    userId: "55b0a361-45d1-476e-bdfd-fad0e86315e5",
    name: "Animal",
    createdAt: "2025-08-05T02:01:39.290Z",
    updatedAt: "2025-08-07T22:48:33.119Z",
  },
  user: {
    id: "69d72f64-e938-40de-bbf2-15750adb4bae",
    username: "riskyadmin",
  },
};

const formSchema = z.object({
  title: z.string().nonempty("Please enter a title"),
  categoryId: z.string().nonempty("Please select a category"),
  content: z.string().nonempty("Content field cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

const Page: React.FC = () => {
  const router = useRouter();
  // const [articles, setArticles] = useState<Article>();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      content: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    return;
    const token = getToken();
    try {
      await axios.post("/articles", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/dashboard/articles", { scroll: false });
      toast.success("Article created successfully");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="p-5 border bg-white rounded-lg">
      <div className="text-md font-semibold flex gap-4 items-center pb-5 mb-5 border-b">
        <Link href="/dashboard/articles">
          <ArrowLeft size={20} />
        </Link>
        Create Article
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Input a title" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type a content..."
                    className="min-h-60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={form.formState.isSubmitting}
              asChild
            >
              <Link href="/dashboard/articles">Cancel</Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={form.formState.isSubmitting}
              onClick={() => setOpen(true)}
            >
              Preview
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={form.formState.isSubmitting}
            >
              Upload
            </Button>
          </div>
        </form>
      </Form>

      <Preview article={article} open={open} setOpen={setOpen} />
    </div>
  );
};

export default Page;

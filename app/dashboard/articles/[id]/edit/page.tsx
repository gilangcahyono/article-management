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
import { use, useEffect, useState } from "react";
import { Article } from "@/types/articles";

const formSchema = z.object({
  title: z.string().nonempty("Please enter a title"),
  categoryId: z.string().nonempty("Please select a category"),
  content: z.string().nonempty("Content field cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;
type Props = {
  params: Promise<{ id: string }>;
};

const Page: React.FC<Props> = ({ params }) => {
  const { id: articleId } = use(params);
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    axios.get(`/articles/${articleId}`).then((res) => setArticle(res.data));
  }, [articleId]);

  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article?.title,
      categoryId: article?.categoryId,
      content: article?.content,
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        categoryId: article.categoryId,
        content: article.content,
      });
    }
  }, [article, form]);

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
        Edit Article
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
                    rows={20}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={form.formState.isSubmitting}
          >
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;

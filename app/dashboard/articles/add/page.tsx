/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, ImagePlus } from "lucide-react";
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
import { Category } from "@/types/articles";

// const article: Article = {
//   id: "7a768e14-567f-4241-a0f4-18ebb24fe6ae",
//   userId: "69d72f64-e938-40de-bbf2-15750adb4bae",
//   categoryId: "716cc32c-578a-4889-8fac-8f3a5e6e71ce",
//   title: "Kucing: Sahabat Berbulu yang Menggemaskan",
//   thumbnail: "https://robohash.org/7a768e14-567f-4241-a0f4-18ebb24fe6ae.jpg",
//   content:
//     '<p>Kucing adalah <strong>hewan peliharaan</strong> populer dengan berbagai ras dan karakter <em>unik</em>. Dikenal dengan kemandirian dan keanggunannya, kucing juga sangat penyayang dan suka bermain. Mereka memiliki insting berburu yang kuat namun bisa menjadi teman yang setia di rumah. Perawatannya relatif mudah, menjadikannya pilihan favorit banyak orang.</p><p></p><img src="https://s3.sellerpintar.com/articles/articles/1755428738389-content-image-1755428737450.png"><p></p><p></p>',
//   imageUrl:
//     "https://s3.sellerpintar.com/articles/articles/1755428738490-d17cc7bf0e13fcdf975dd682d5df792f.jpg",
//   createdAt: "2025-08-17T11:05:38.584Z",
//   updatedAt: "2025-08-17T11:05:38.584Z",
//   category: {
//     id: "716cc32c-578a-4889-8fac-8f3a5e6e71ce",
//     userId: "55b0a361-45d1-476e-bdfd-fad0e86315e5",
//     name: "Animal",
//     createdAt: "2025-08-05T02:01:39.290Z",
//     updatedAt: "2025-08-07T22:48:33.119Z",
//   },
//   user: {
//     id: "69d72f64-e938-40de-bbf2-15750adb4bae",
//     username: "riskyadmin",
//   },
// };

const formSchema = z.object({
  title: z.string().nonempty("Please enter a title"),
  categoryId: z.string().nonempty("Please select a category"),
  content: z.string().nonempty("Content field cannot be empty"),
  thumbnail: z
    .any()
    .refine((files) => files && files.length > 0, {
      message: "Please select a file",
    })
    .refine((files) => files && files[0].size <= 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    })
    .refine(
      (files) => files && ["image/jpeg", "image/png"].includes(files[0].type),
      {
        message: "File must be an image (jpeg/png)",
      }
    )
    .transform((files) => files[0] as File),
});

type FormData = z.infer<typeof formSchema>;
type Article = {
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  user: string;
};

const Page: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    getCategories();
  }, []);

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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      content: "",
      thumbnail: undefined,
    },
  });

  // useEffect(() => {
  //   setArticle({
  //     title: form.getValues("title"),
  //     category: form.getValues("categoryId"),
  //     content: form.getValues("content"),
  //     imageUrl: imagePreviewUrl || "",
  //   });
  // }, [form, imagePreviewUrl]);

  const onSubmit = async (data: FormData) => {
    data.content = `<p class='mb-3'>${data.content.replace(
      /\n/g,
      "</p><p class='mb-3'>"
    )}</p>`;
    const newThumbnail = new FormData();
    newThumbnail.append("image", data.thumbnail);
    const token = await getToken();
    try {
      const res = await axios.post("/upload", newThumbnail, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newArticle = {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        imageUrl: res.data.imageUrl,
      };

      await axios.post("/articles", newArticle, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/dashboard/articles", { scroll: false });
      toast.success("Article created successfully");
    } catch (error: any) {
      // console.error(error);
      toast.error(error.response.data.error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.clearErrors("thumbnail");
    const files: any = e.target.files;
    if (!files || files.length === 0) return;
    form.setValue("thumbnail", files);
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);
  };

  return (
    <div className="p-5 border bg-gray-50 rounded-lg">
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
            name="thumbnail"
            render={() => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="thumbnail"
                  />
                </FormControl>
                <label
                  htmlFor="thumbnail"
                  className="border-dashed border-2 border-gray-300 overflow-hidden text-gray-500  rounded-lg w-full sm:max-w-xs aspect-video bg-white mx-auto sm:mx-0"
                >
                  <div
                    className={`${
                      imagePreviewUrl ? "hidden" : ""
                    } flex flex-col justify-center items-center h-full`}
                  >
                    <ImagePlus className="mb-3" />
                    <p className=" underline">Click to select file</p>
                    <p className="">Support File Type: jpg or png</p>
                  </div>
                  {imagePreviewUrl && (
                    <img
                      src={imagePreviewUrl}
                      alt="sdfs"
                      className="aspect-video object-cover"
                    />
                  )}
                </label>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Input a title"
                    {...field}
                    type="text"
                    className="bg-white"
                  />
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
                  <FormControl className="w-full bg-white">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: Category, i: number) => (
                      <SelectItem key={i} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
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
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type a content..."
                    className="min-h-60 bg-white"
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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "@/lib/axios";
import { formatedDate } from "@/lib/utils";
import { Article } from "@/types/articles";
import { Eye, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Params {
  searchParams: Promise<{ search: string; category: string; page: string }>;
}

const Page: React.FC<Params> = async ({ searchParams }) => {
  const search = (await searchParams).search;
  const category = (await searchParams).category;
  const page = (await searchParams).page;

  const res = await axios.get("/articles", {
    params: {
      title: search,
      category: category,
      sortOrder: "asc",
      page: page || 1,
      limit: 50,
    },
  });

  const articles: Article[] = res.data.data;

  return (
    <div className="p-5 border bg-white rounded-lg">
      <h2 className="text-md font-semibold pb-5 mb-5 border-b">
        Total Articles : {articles.length}
      </h2>

      <div className="flex flex-col-reverse sm:flex-row mb-5 gap-3">
        <Select>
          <SelectTrigger className="bg-white w-full sm:w-fit">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* {categories.map((category: Category, i: number) => (
                <SelectItem key={i} value={category.id}>
                  <span className="text-black">{category.name}</span>
                </SelectItem>
              ))} */}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input type="text" placeholder="Search by title" className="pl-10" />
        </div>

        <Button
          className="bg-blue-500 hover:bg-blue-600 ms-auto w-full sm:w-fit"
          asChild
        >
          <Link href="/articles/add">
            <Plus />
            Write an article
          </Link>
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article: Article, i: number) => (
            <TableRow key={i}>
              <TableCell>
                <Image
                  src={`https://robohash.org/${i}.jpg`}
                  width={50}
                  height={50}
                  alt="Thumbnail"
                  className="rounded-lg"
                />
              </TableCell>
              <TableCell className="max-w-96 overflow-hidden text-ellipsis">
                {article.title}
              </TableCell>
              <TableCell>{article.category.name}</TableCell>
              <TableCell>{formatedDate(article.createdAt)}</TableCell>
              <TableCell>
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
                  <button className="text-red-500 underline">
                    <Trash2 size={20} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;

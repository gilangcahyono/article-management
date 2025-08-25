import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import axios from "@/lib/axios";
import { formatedDate } from "@/lib/utils";
import { Article } from "@/types/articles";
import Image from "next/image";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchInput from "@/components/SearchInput";
import { getToken } from "@/lib/tokenizer";

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
    },
    headers: { Authorization: `Bearer ${await getToken()}` },
  });
  const articles: Article[] = res.data.data;

  return (
    <>
      <Navbar />
      <SearchInput />

      <div className="px-4 my-6">
        {articles.length > 0 && (
          <p className="hidden sm:block text-sm font-semibold text-muted-foreground mb-3">
            Showing : {articles.length} of {res.data.total}
          </p>
        )}

        <div className="flex gap-8 flex-wrap justify-center">
          {articles &&
            articles.map((article: Article, i: number) => (
              <div key={i} className="w-xs">
                <Image
                  loading="lazy"
                  src={
                    article.imageUrl ||
                    `https://robohash.org/${article.title}.jpeg`
                  }
                  alt={article.title}
                  width={100}
                  height={100}
                  className="rounded-lg w-full h-52 object-cover"
                />
                <span className="block text-xs text-muted-foreground mt-2">
                  {formatedDate(article.createdAt)}
                </span>
                <Link
                  href={`/articles/${article.id}`}
                  className="block font-semibold mt-2"
                >
                  <span className="sm:line-clamp-1">{article.title}</span>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Neque, velit? Assumenda, dolor eligendi inventore iste tenetur
                  dolores quasi expedita earum. Beatae aperiam ab, saepe non
                  rerum quod quasi id a.{article.content}
                </p>
                <div className="flex gap-3 mt-2">
                  <Link
                    href={`/articles?category=${article.category.name}`}
                    className="bg-blue-200 rounded-xl px-3 py-1 text-sm text-blue-900"
                  >
                    {article.category.name}
                  </Link>
                </div>
              </div>
            ))}

          {!articles.length && (
            <p className="text-center xmy-10">No articles found</p>
          )}
        </div>

        {articles.length > 0 && (
          <Pagination className="my-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={
                    !page ? "/articles#" : `/articles?page=${Number(page) - 1}`
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`/articles?page=${!page ? 2 : Number(page) + 1}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;

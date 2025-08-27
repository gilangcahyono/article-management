import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import axios from "@/lib/axios";
import { getToken } from "@/lib/tokenizer";
import { formatedDate } from "@/lib/utils";
import { Article } from "@/types/articles";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

const Page: React.FC<Props> = async ({ params }) => {
  const { id: articleId } = await params;
  const token = await getToken();
  const res = await axios.get(`/articles/${articleId}`);

  const article: Article = res.data;

  const other = await axios.get(`/articles`, {
    params: {
      category: article.categoryId,
      limit: 3,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const otherArticles: Article[] = other.data.data;

  return (
    <>
      <Navbar />

      <div className="px-4 sm:px-[10vw] my-6">
        <p className="text-center font-semibold text-muted-foreground mb-3">
          {formatedDate(article.createdAt)} - Created by {article.user.username}
        </p>
        <h1 className="text-center font-semibold text-3xl mb-6 sm:mb-10">
          {article.title}
        </h1>
        <figure className="mb-6">
          <Image
            loading="lazy"
            src={article.imageUrl}
            alt={article.title}
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full rounded-lg"
          />
        </figure>

        <section
          id="content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <h4 className="font-bold text-xl my-6">Other articles</h4>

        <div className="flex gap-8 flex-wrap justify-center sm:justify-normal">
          {otherArticles &&
            otherArticles.map((article: Article, i: number) => (
              <div key={i} className="w-full sm:max-w-3xs">
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
                    href={`/?category=${article.category.id}`}
                    className="bg-blue-200 rounded-xl px-3 py-1 text-sm text-blue-900"
                  >
                    {article.category.name}
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Page;

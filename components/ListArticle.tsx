"use client";

import axios from "@/lib/axios";
import { formatedDate } from "@/lib/utils";
import { Article } from "@/types/articles";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  initialArticles: Article[];
};

const ListArticle: React.FC<Props> = ({ initialArticles }) => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  const searchArticles = async (search: string) => {
    const res = await axios.get("/articles", {
      params: {
        title: search,
      },
    });
    setArticles(res.data.data);
  };

  return (
    articles &&
    articles.map((article: Article, i: number) => (
      <div key={i} className="w-xs">
        <Image
          loading="lazy"
          src={article.imageUrl || `https://robohash.org/${article.title}.jpeg`}
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, velit?
          Assumenda, dolor eligendi inventore iste tenetur dolores quasi
          expedita earum. {article.content}
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
    ))
  );
};

export default ListArticle;

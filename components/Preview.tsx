"use client";

import { formatedDate } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import Footer from "./Footer";

type Article = {
  title?: string;
  category?: string;
  content?: string;
  imageUrl?: string;
  createdAt?: string;
  user?: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  article: Article;
};

const Preview: React.FC<Props> = (props) => {
  const { open, setOpen, article } = props;

  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed inset-0 z-99 bg-white overflow-y-auto`}
    >
      <header className="flex justify-between items-center w-full p-4 border-b">
        <h1 className="text-lg font-semibold">Preview</h1>
        <X onClick={() => setOpen(false)} />
      </header>

      <div className="px-4 sm:px-[10vw] my-6">
        <p className="text-center font-semibold text-muted-foreground mb-3">
          {formatedDate(new Date().toISOString())} - Created by {article?.user}
        </p>

        <h1 className="text-center font-semibold text-3xl mb-6 sm:mb-10">
          {article?.title}
        </h1>

        <figure className="mb-6">
          <Image
            loading="lazy"
            src={article?.imageUrl || ""}
            alt={article?.title || ""}
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover w-full rounded-lg"
          />
        </figure>

        {/* <section
          id="content"
          className="overflow-hidden"
          dangerouslySetInnerHTML={{ __html: article.content }}
        /> */}

        <h4 className="font-bold text-xl my-6">Other articles</h4>

        <div className="flex gap-8 flex-wrap justify-center sm:justify-normal">
          {[...Array(3)].map((article, i) => (
            <div key={i} className="w-full sm:max-w-3xs">
              <Image
                loading="lazy"
                src={`https://robohash.org/${i}.jpeg`}
                alt="article title"
                width={100}
                height={100}
                className="rounded-lg w-full h-52 object-cover"
              />
              <span className="block text-xs text-muted-foreground mt-2">
                {formatedDate("2025-08-20T13:23:15.791Z")}
              </span>
              <span className="block font-semibold mt-2">
                <span className="sm:line-clamp-1 w-fit ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Recusandae, atque!
                </span>
              </span>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque,
                velit? Assumenda, dolor eligendi inventore iste tenetur dolores
                quasi expedita earum. Beatae aperiam ab, saepe non rerum quod
                quasi id a.
              </p>
              <div className="flex gap-3 mt-2">
                <span className="bg-blue-200 rounded-xl px-3 py-1 text-sm text-blue-900">
                  {article?.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Preview;

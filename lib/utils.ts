import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatedDate = (isoDate: string): string => {
  // const isoDate = "2025-08-17T07:14:12.052Z";
  const date = new Date(isoDate);

  const formatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted;
};

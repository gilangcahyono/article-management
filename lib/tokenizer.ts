"use server";

import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const getToken = async (): Promise<string> => {
  const cookieStore = await cookies();
  const token: RequestCookie | undefined = cookieStore.get("token");
  return token ? token?.value : "";
};

export const setToken = async (value: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("token", value);
};

export const removeToken = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};

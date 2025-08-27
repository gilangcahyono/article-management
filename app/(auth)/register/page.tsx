/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setToken } from "@/lib/tokenizer";

const formSchema = z
  .object({
    username: z
      .string()
      .nonempty("Username is required.")
      .min(2, "Username must be at least 2 characters."),
    password: z
      .string()
      .nonempty("Password is required.")
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .nonempty("Confirm Password is required.")
      .min(8, "Confirm Password must be at least 8 characters."),
    role: z.string().nonempty("Role is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("/auth/register", data);
      const credentials = { username: data.username, password: data.password };
      const res = await axios.post("/auth/login", credentials);
      const token = res.data.token;
      await setToken(token);
      router.push("/", { scroll: false });
      toast.success("Registration successful");
    } catch (error) {
      console.error(error);
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="px-4 py-10 bg-white rounded-lg w-sm">
        <figure className="flex justify-center mb-8">
          <img src="/logo.svg" alt="LogoIpsum" className="w-44" />
        </figure>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="input username"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="input password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="input password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
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

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Loading..." : "Register"}
            </Button>
          </form>
          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="underline text-blue-500">
              Login
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signupSchema } from "@/schemas/formSchema";
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
import { useRouter } from "next/navigation";
import { delay } from "@/utils/delay";

export function SignupForm({ toastMsg , setIsLoading }: any) {

  // 1. Define your form.

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repassword: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signupSchema>) {
  setIsLoading(true)
  await delay(2000)
    const { email, password, name } = values;
   
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (!res.ok) {

        if (res.status === 409) {
          toastMsg({
            title: "Signup Error Occured",
            description: `Email already exists`,
          });
          setIsLoading(false)
        }
        return;

      }
      toastMsg({
        title: "Signup Successful",
        description: "Redirecting to Login Page.",
      });
      setIsLoading
      router.push('/login')
    } catch (err:any) {
      console.error("Signup error:", err.message);
      toastMsg({
        title: "Signup Error",
        description: err.message
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="username"
                  autoComplete="off"
                  placeholder="e.g. Johndoe"
                  {...field}
                  className="text-gray-600 rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="off"
                  placeholder="e.g. Johndoe@gmail.com"
                  {...field}
                  className="text-gray-600 rounded-xl"
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
              <FormLabel className="text-gray-800 font-semibold">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password "
                  {...field}
                  className="text-gray-600 rounded-xl ring-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 font-semibold">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your Password "
                  {...field}
                  className="text-gray-600 rounded-xl ring-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-xl text-base font-extrabold"
        >
          Signup
        </Button>
      </form>
    </Form>
  );
}

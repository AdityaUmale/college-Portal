"use client";
import axios from "axios";
import { useEffect , useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/schemas/formSchema";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { delay } from "@/utils/delay";

export function LoginForm({ toastMsg , setIsLoading }:any) {
 const router= useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    await delay(2000)
      const { email, password } = values;
     
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DATABASE_URL}/api/v1/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );
  
        if (!res.ok) {
          console.log(res.status);
        
          switch (res.status) {
            case 400:
              toastMsg({
                title: "Validation Error",
                description: "Validation Failed",
              });
              break;
            case 404:
              toastMsg({
                title: "Login Error",
                description: "User not found",
              });
              break;
            case 401:
              console.log("invli")
              toastMsg({
                title: "Login Error",
                description: "Invalid password",
              });
              break;
            default:
              toastMsg({
                title: "Error",
                description: "An unexpected error occurred",
              });
          }
        
          setIsLoading(false);
          return;
        }
        toastMsg({
          title: "Login Successful",
          description: "Redirecting to User Dashboard.",
        });
        setIsLoading(false)
        router.push('/')
      } catch (err:any) {
        console.error("Login error:", err.message);
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
                  className="text-gray-600 rounded-xl "
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
                  // JUST ADD type="password" to the Input component to have eye icon
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
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember Me
            </label>
          </div>
          <Link href="/">
            <p className="text-sm text-secondary font-semibold">
              Forgot Password ?
            </p>
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full rounded-xl text-base font-extrabold"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
